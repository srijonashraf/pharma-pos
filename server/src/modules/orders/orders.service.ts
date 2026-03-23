import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { OrdersRepository } from './orders.repository';
import { MedicinesRepository } from '../medicines/medicines.repository';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { Order } from './entities/order.entity';
import { Medicine } from '../medicines/entities/medicine.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';

interface LineItem {
  medicineId: string;
  medicineName: string;
  unit: string;
  unitPrice: number;
  discountPct: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  adjustment: number;
  totalAmount: number;
  payment: {
    method: string;
    amountTaken: number;
    amountPaid: number;
    amountReturn: number;
    amountDue: number;
    status: string;
  };
  status: string;
  createdAt: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly repository: OrdersRepository,
    private readonly medicinesRepository: MedicinesRepository,
    private readonly configService: ConfigService,
  ) {}

  async findAll(filter: OrderFilterDto) {
    return this.repository.findWithFilter(filter);
  }

  async updateStatus(id: string, status: string) {
    await this.repository.update(id, { status });
    return this.findOne(id);
  }

  async addPayment(id: string, dto: AddPaymentDto) {
    const order = await this.repository.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.status === 'paid') {
      throw new BadRequestException('Order is already fully paid');
    }

    const dataSource = this.repository.getDataSource();
    return dataSource.transaction(async (manager) => {
      const totalPaid = await manager
        .createQueryBuilder(Payment, 'payment')
        .select('COALESCE(SUM(payment.amountPaid), 0)', 'total')
        .where('payment.orderId = :orderId', { orderId: id })
        .getRawOne<{ total: string }>();

      const previousPaid = parseFloat(totalPaid?.total || '0');
      const remainingDue = order.totalAmount - previousPaid;
      const amountPaid = Math.min(dto.amountTaken, remainingDue);
      const amountReturn = Math.max(0, dto.amountTaken - amountPaid);
      const newTotalPaid = previousPaid + amountPaid;

      const paymentStatus = this.calculatePaymentStatus(newTotalPaid, order.totalAmount);

      const payment = manager.create(Payment, {
        orderId: id,
        method: dto.method,
        amountTaken: dto.amountTaken,
        amountPaid,
        amountReturn,
        amountDue: Math.max(0, order.totalAmount - newTotalPaid),
        status: paymentStatus,
      });
      await manager.save(payment);

      if (paymentStatus === 'paid') {
        await manager.update(Order, id, { status: 'paid' });
      }

      const items = await manager.find(OrderItem, {
        where: { orderId: id },
      });

      const payments = await manager.find(Payment, {
        where: { orderId: id },
        order: { createdAt: 'DESC' },
      });

      const updatedOrder: Order = paymentStatus === 'paid'
        ? (await manager.findOne(Order, { where: { id } }))!
        : order;

      return this.sanitizeOrderResponse({
        order: updatedOrder,
        items,
        payments,
      });
    });
  }

  async findOne(id: string) {
    const result = await this.repository.findOneWithDetails(id);
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return this.sanitizeOrderResponse(result);
  }

  private sanitizeOrderResponse(result: {
    order: Order;
    items: OrderItem[];
    payments: Payment[];
  }) {
    return {
      order: result.order,
      items: result.items.map(({ orderId, ...item }) => item),
      payments: result.payments.map(({ orderId, ...payment }) => payment),
    };
  }

  async createOrder(dto: CreateOrderDto): Promise<OrderResponse> {
    const vatRate = this.configService.get<number>('app.vatRate') || 0.05;

    const medicineIds = dto.items.map((i) => i.medicineId);
    const medicines = await this.medicinesRepository.findByIds(medicineIds);

    if (medicines.length !== medicineIds.length) {
      throw new NotFoundException('One or more medicines not found');
    }

    for (const item of dto.items) {
      const med = medicines.find((m) => m.id === item.medicineId)!;
      if (med.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${med.name}: available ${med.stock}, requested ${item.quantity}`,
        );
      }
    }

    const { lineItems, subtotal } = this.calculateLineItems(
      dto.items,
      medicines,
    );
    const vatAmount = this.roundCurrency(subtotal * vatRate);
    const totalAmount = this.roundCurrency(
      subtotal + vatAmount - (dto.discountAmount || 0) + (dto.adjustment || 0),
    );

    const amountPaid = Math.min(dto.payment.amountTaken, totalAmount);
    const amountReturn = this.roundCurrency(
      Math.max(0, dto.payment.amountTaken - totalAmount),
    );
    const amountDue = this.roundCurrency(Math.max(0, totalAmount - amountPaid));
    const paymentStatus =
      amountDue > 0 ? (amountPaid > 0 ? 'partial' : 'due') : 'paid';

    const dataSource = this.repository.getDataSource();

    return dataSource.transaction(async (manager) => {
      const orderNumber = await this.generateOrderNumber(manager);

      const order = manager.create(Order, {
        orderNumber,
        customerId: dto.customerId || null,
        subtotal,
        discountAmount: dto.discountAmount || 0,
        vatAmount,
        adjustment: dto.adjustment || 0,
        totalAmount,
        status: paymentStatus === 'paid' ? 'paid' : 'due',
        note: dto.note || null,
      });
      await manager.save(order);

      const items = lineItems.map((li) =>
        manager.create(OrderItem, {
          orderId: order.id,
          ...li,
        }),
      );
      await manager.save(items);

      for (const item of dto.items) {
        await manager.increment(
          'medicines',
          { id: item.medicineId },
          'stock',
          -item.quantity,
        );
      }

      const payment = manager.create(Payment, {
        orderId: order.id,
        method: dto.payment.method,
        amountTaken: dto.payment.amountTaken,
        amountPaid,
        amountReturn,
        amountDue,
        status: paymentStatus,
      });
      await manager.save(payment);

      return this.formatOrderResponse(order, payment);
    });
  }

  private calculateLineItems(items: OrderItemDto[], medicines: Medicine[]) {
    const medMap = new Map(medicines.map((m) => [m.id, m]));
    let subtotal = 0;
    const lineItems: LineItem[] = items.map((item) => {
      const med = medMap.get(item.medicineId)!;
      const effectiveDiscount = item.discountPct ?? Number(med.discountPct);
      const lineSub = this.roundCurrency(
        Number(med.price) * item.quantity * (1 - effectiveDiscount / 100),
      );
      subtotal += lineSub;
      return {
        medicineId: med.id,
        medicineName: med.name,
        unit: item.unit || 'Pcs',
        unitPrice: Number(med.price),
        discountPct: effectiveDiscount,
        quantity: item.quantity,
        subtotal: lineSub,
      };
    });
    return { lineItems, subtotal: this.roundCurrency(subtotal) };
  }

  private async generateOrderNumber(manager: EntityManager): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const countResult = await manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(Order, 'order')
      .where('DATE(order.createdAt) = :date', {
        date: today.toISOString().slice(0, 10),
      })
      .getRawOne<{ count: string }>();
    const seq = parseInt(countResult?.count || '0', 10) + 1;
    return `ORD-${dateStr}-${seq.toString().padStart(4, '0')}`;
  }

  private roundCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private calculatePaymentStatus(totalPaid: number, totalAmount: number): string {
    if (totalPaid >= totalAmount) return 'paid';
    if (totalPaid > 0) return 'partial';
    return 'due';
  }

  private formatOrderResponse(order: Order, payment: Payment): OrderResponse {
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount),
      vatAmount: Number(order.vatAmount),
      adjustment: Number(order.adjustment),
      totalAmount: Number(order.totalAmount),
      payment: {
        method: payment.method,
        amountTaken: Number(payment.amountTaken),
        amountPaid: Number(payment.amountPaid),
        amountReturn: Number(payment.amountReturn),
        amountDue: Number(payment.amountDue),
        status: payment.status,
      },
      status: order.status,
      createdAt: order.createdAt.toString(),
    };
  }
}
