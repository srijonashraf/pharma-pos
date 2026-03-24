export interface InvoiceItem {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  subtotal: number;
}

export interface InvoiceData {
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  vat: number;
  adjustment: number;
  total: number;
  paymentMethod: string;
  paymentReference: string;
  amountPaid: number;
  amountDue: number;
  paymentStatus: string;
}
