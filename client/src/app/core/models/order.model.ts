// src/app/core/models/order.model.ts

export interface OrderItemDto {
  medicineId: string;
  quantity: number;
  unit?: string;
  discountPct?: number;
}

export interface PaymentDto {
  method: 'cash' | 'bank_card' | 'mfs';
  amountTaken: number;
}

export interface CreateOrderDto {
  customerId?: string;
  items: OrderItemDto[];
  discountAmount?: number;
  adjustment?: number;
  payment: PaymentDto;
  note?: string;
}

export interface CreateOrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
}
