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

export interface OrderListItem {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customer: { id: string; name: string; displayName?: string } | null;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  adjustment: number;
  totalAmount: number;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDetail {
  id: string;
  medicineId: string;
  medicineName: string;
  unit: string;
  unitPrice: number;
  discountPct: number;
  quantity: number;
  subtotal: number;
}

export interface PaymentDetail {
  id: string;
  method: string;
  amountTaken: number;
  amountPaid: number;
  amountReturn: number;
  amountDue: number;
  status: string;
  createdAt: string;
}

export interface OrderDetail {
  order: OrderListItem;
  items: OrderItemDetail[];
  payments: PaymentDetail[];
}

export interface AddPaymentDto {
  method: 'cash' | 'bank_card' | 'mfs';
  amountTaken: number;
}
