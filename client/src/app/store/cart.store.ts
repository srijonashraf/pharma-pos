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

export interface DraftCart {
  id: string;
  savedAt: string;
  items: CartItem[];
  customer: CustomerDto | null;
  discount: number;
  adjustment: number;
  note: string;
}

const DRAFTS_KEY = 'pharma_pos_drafts';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly VAT_RATE = 0.10;

  items = signal<CartItem[]>([]);
  selectedCustomer = signal<CustomerDto | null>(null);
  cartDiscount = signal<number>(0);
  adjustment = signal<number>(0);
  note = signal<string>('');
  activeTab = signal<'order' | 'cart'>('order');

  drafts = signal<DraftCart[]>(this.loadDraftsFromStorage());

  draftCount = computed(() => this.drafts().length);

  subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.subtotal, 0)
  );
  lineItemDiscount = computed(() =>
    Math.round(this.items().reduce((sum, i) => sum + (i.unitPrice * i.quantity - i.subtotal), 0) * 100) / 100
  );
  totalDiscount = computed(() =>
    Math.round((this.lineItemDiscount() + this.cartDiscount()) * 100) / 100
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

  saveDraft() {
    const draft: DraftCart = {
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      items: [...this.items()],
      customer: this.selectedCustomer(),
      discount: this.cartDiscount(),
      adjustment: this.adjustment(),
      note: this.note(),
    };
    this.drafts.update(d => [draft, ...d]);
    this.persistDrafts();
    this.reset();
  }

  loadDraft(draftId: string) {
    const draft = this.drafts().find(d => d.id === draftId);
    if (!draft) return;

    this.items.set([...draft.items]);
    this.selectedCustomer.set(draft.customer);
    this.cartDiscount.set(draft.discount);
    this.adjustment.set(draft.adjustment);
    this.note.set(draft.note || '');

    this.deleteDraft(draftId);
  }

  deleteDraft(draftId: string) {
    this.drafts.update(d => d.filter(item => item.id !== draftId));
    this.persistDrafts();
  }

  reset() {
    this.items.set([]);
    this.selectedCustomer.set(null);
    this.cartDiscount.set(0);
    this.adjustment.set(0);
    this.note.set('');
  }

  private calcSubtotal(price: number, qty: number, disc: number): number {
    return Math.round(price * qty * (1 - disc / 100) * 100) / 100;
  }

  private persistDrafts() {
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(this.drafts()));
    } catch { /* storage full — silently fail */ }
  }

  private loadDraftsFromStorage(): DraftCart[] {
    try {
      const raw = localStorage.getItem(DRAFTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
