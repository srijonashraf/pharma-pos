import { Injectable, signal, computed } from '@angular/core';
import { MedicineDto } from '../core/models/medicine.model';
import { CustomerDto } from '../core/models/customer.model';

export interface CartItem {
  medicineId: string;
  medicineName: string;
  unit: string;
  unitPrice: number;
  discountPct: number;
  quantity: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly VAT_RATE = 0.10;  // 10% from config

  // Core state
  items = signal<CartItem[]>([]);
  selectedCustomer = signal<CustomerDto | null>(null);
  cartDiscount = signal<number>(0);
  adjustment = signal<number>(0);
  draftCount = signal<number>(0);
  activeTab = signal<'order' | 'cart'>('order');  // mobile only

  // Derived
  subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.subtotal, 0)
  );
  vatAmount = computed(() =>
    Math.round(this.subtotal() * this.VAT_RATE * 100) / 100
  );
  total = computed(() =>
    Math.round((this.subtotal() + this.vatAmount() - this.cartDiscount() + this.adjustment()) * 100) / 100
  );
  cartCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  addItem(medicine: MedicineDto) {
    const existing = this.items().find(i => i.medicineId === medicine.id);
    if (existing) {
      this.items.update(items =>
        items.map(i => i.medicineId === medicine.id
          ? { ...i, quantity: i.quantity + 1, subtotal: this.calcSubtotal(i.unitPrice, i.quantity + 1, i.discountPct) }
          : i
        )
      );
    } else {
      this.items.update(items => [...items, {
        medicineId: medicine.id,
        medicineName: medicine.name,
        unit: medicine.unit,
        unitPrice: medicine.price,
        discountPct: Number(medicine.discountPct) || 0,
        quantity: 1,
        subtotal: this.calcSubtotal(medicine.price, 1, Number(medicine.discountPct) || 0),
      }]);
    }
  }

  getQty(medicineId: string): number {
    return this.items().find(i => i.medicineId === medicineId)?.quantity ?? 0;
  }

  private calcSubtotal(price: number, qty: number, disc: number): number {
    return Math.round(price * qty * (1 - disc / 100) * 100) / 100;
  }

  reset() {
    this.items.set([]);
    this.selectedCustomer.set(null);
    this.cartDiscount.set(0);
    this.adjustment.set(0);
  }
}
