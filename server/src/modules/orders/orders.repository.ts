import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';
import { OrderFilterDto } from './dto/order-filter.dto';
import { PaginatedResult } from '../../common/types/pagination.type';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly dataSource: DataSource,
  ) {}

  async findWithFilter(
    filter: OrderFilterDto,
  ): Promise<PaginatedResult<Order>> {
    const { status, date, page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (date) {
      queryBuilder.andWhere('DATE(order.createdAt) = :date', { date });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
  }

  async findOneWithDetails(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!order) return null;

    const items = await this.orderItemRepository.find({
      where: { orderId: id },
    });

    const payments = await this.paymentRepository.find({
      where: { orderId: id },
      order: { createdAt: 'DESC' },
    });

    return { order, items, payments };
  }

  async create(data: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(data);
    return this.orderRepository.save(order);
  }

  async update(id: string, data: Partial<Order>): Promise<void> {
    await this.orderRepository.update(id, data);
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
