import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore, CartItem } from '../../store/cart.store';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CurrencyBdtPipe } from '../../shared/pipes/currency-bdt.pipe';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MedicineService } from '../../core/services/medicine.service';
import { UiStore } from '../../store/ui.store';
import { AddCustomerModalComponent } from '../modals/add-customer/add-customer-modal.component';
import { PaymentModalComponent } from '../modals/payment/payment-modal.component';
import { CustomerDto } from '../../core/models/customer.model';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent, CurrencyBdtPipe, IconComponent, AddCustomerModalComponent, PaymentModalComponent],
  template: `
    <!--
      KEY LAYOUT CONTRACT:
      • Customer row   → flex-shrink-0
      • Barcode row    → flex-shrink-0
      • Table header   → flex-shrink-0
      • Cart item list → flex-1 min-h-0 overflow-y-auto  (independent scroll)
      • Totals summary → flex-shrink-0
      • Bottom bar     → flex-shrink-0  (always visible)
    -->
    <div class="flex flex-col h-full bg-white relative">

      <!-- ── Customer Row ── -->
      <div class="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
        <button class="flex items-center gap-2 flex-1 h-[38px] px-3 border border-gray-200
                       rounded-lg text-[13px] text-gray-700 hover:border-gray-300 bg-white transition-colors">
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="flex-1 text-left truncate font-medium">
            {{ cartStore.selectedCustomer()?.displayName ?? 'Walking Customer' }}
          </span>
          <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <button (click)="isCustomerModalOpen.set(true)"
                class="flex items-center gap-1 h-[38px] px-3 bg-[#10B981] hover:bg-emerald-600
                       text-white text-[13px] font-bold rounded-lg whitespace-nowrap transition-colors shadow-sm">
          <span class="text-[18px] font-light leading-none">+</span>
          Add customer
        </button>
      </div>

      <!-- ── Barcode Scanner ── -->
      <div class="px-3 py-2 border-b border-gray-100 flex-shrink-0">
        <div class="flex items-center h-[36px] px-3 border border-dashed border-gray-300 rounded-lg
                    bg-gray-50 focus-within:border-[#10B981] focus-within:bg-white transition-colors">
          <svg class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6v12M7 6v12M11 6v12M14 6v12M17 6v12M20 6v12"/>
          </svg>
          <input #barcodeInput type="text" placeholder="Scan barcode, product code"
                 (keydown.enter)="handleBarcodeScan($event)"
                 class="flex-1 text-[13px] text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"/>
        </div>
      </div>

      <!-- ── Table Header (Desktop, pinned) ── -->
      <div class="hidden lg:grid gap-1 px-3 py-[7px] bg-gray-50 border-b border-gray-200
                  text-[11px] font-bold text-gray-500 uppercase tracking-wide flex-shrink-0"
           style="grid-template-columns: 1fr 80px 56px 90px 46px 64px 28px;">
        <span>Item</span>
        <span>Unit</span>
        <span class="text-right">Price</span>
        <span class="text-center">Qty</span>
        <span class="text-center">Disc%</span>
        <span class="text-right">Subtotal</span>
        <span></span>
      </div>

      <!-- ── Cart Items — SCROLLABLE ── -->
      <div class="flex-1 min-h-0 overflow-y-auto bg-[#F5F6FA]">
        <app-cart-item
          *ngFor="let item of cartStore.items()"
          [item]="item"
          (increment)="increment(item)"
          (decrement)="decrement(item)"
          (updateDiscount)="updateDiscount($event)"
          (remove)="removeItem(item)" />

        <div *ngIf="cartStore.items().length === 0"
             class="h-full flex flex-col items-center justify-center text-gray-300 py-10 gap-3">
          <svg class="w-14 h-14 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <p class="text-[13px]">No items added</p>
        </div>
      </div>

      <!-- ── Totals Summary (pinned) ── -->
      <div class="border-t border-gray-200 bg-white flex-shrink-0">
        <div class="grid grid-cols-2 px-4 py-2 gap-y-[5px] text-[13px]">
          <span class="text-gray-500 font-medium">Subtotal</span>
          <span class="text-right font-bold text-gray-800">Tk. {{ cartStore.subtotal() | number:'1.2-2' }}</span>

          <span class="text-gray-500 font-medium">Discount</span>
          <span class="text-right font-bold text-gray-800">Tk. {{ cartStore.cartDiscount() | number:'1.2-2' }}</span>

          <span class="text-gray-500 font-medium">Vat/Tax</span>
          <span class="text-right font-bold text-gray-800">Tk. {{ cartStore.vatAmount() | number:'1.2-2' }}</span>

          <span class="text-gray-500 font-medium">Ajustment</span>
          <span class="text-right font-bold text-gray-800">{{ cartStore.adjustment() }}</span>
        </div>
      </div>

      <!-- ── Desktop Bottom Action Bar (pinned) ── -->
      <div class="hidden lg:flex items-stretch gap-3 px-3 py-3 border-t border-gray-200 bg-white flex-shrink-0"
           style="height:68px">
        <button (click)="draftCart()"
                class="flex-1 rounded-lg font-bold text-[14px] text-white bg-[#FBB018] hover:brightness-95 transition-all shadow-sm">
          Draft
        </button>
        <div class="flex-1 rounded-lg bg-gray-100 flex flex-col items-center justify-center">
          <span class="text-[11px] font-bold text-gray-500 leading-tight">Total</span>
          <span class="text-[17px] font-extrabold text-gray-900 leading-tight">
            {{ cartStore.total() | number:'1.2-2' }}
          </span>
        </div>
        <button class="w-[50px] rounded-lg bg-[#8E8E93] hover:brightness-95 flex items-center justify-center text-white shadow-sm transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="2" width="16" height="20" rx="2" stroke-width="1.8"/>
            <path d="M8 6h8M8 10h2m4 0h2M8 14h2m4 0h2M8 18h2m4 0h2" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
        <button (click)="isPaymentModalOpen.set(true)"
                [disabled]="cartStore.items().length === 0"
                class="flex-1 flex items-center justify-between px-4 bg-[#10B981] hover:bg-emerald-600
                       text-white text-[15px] font-extrabold rounded-lg shadow-sm
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <span>Payment</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- ── Mobile Bottom Bar ── -->
      <div class="lg:hidden relative flex-shrink-0">
        <!-- Popover Menu -->
        <div *ngIf="isMobileMenuOpen()"
             class="absolute bottom-full left-0 mb-2 px-3 flex flex-col gap-2 w-[180px] z-20">
          <button (click)="draftCart()"
                  class="h-10 rounded-lg shadow-md font-bold text-[13px] text-white bg-[#FBB018] w-full">Draft</button>
          <button class="h-10 rounded-lg shadow-md font-bold text-[13px] text-white bg-[#8E8E93] w-full">Calculator</button>
          <button class="h-10 rounded-lg shadow-md font-bold text-[13px] text-white bg-[#F863A2] w-full">Discount</button>
          <button class="h-10 rounded-lg shadow-md font-bold text-[13px] text-white bg-[#5D87FF] w-full">Add. info (1)</button>
        </div>
        <!-- Sticky bar -->
        <div class="flex items-center bg-white border-t border-gray-200 h-[60px]">
          <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
                  class="h-full w-[56px] flex items-center justify-center border-r border-gray-200 text-[#10B981]">
            <svg class="w-5 h-5 transition-transform duration-200"
                 [class.rotate-180]="isMobileMenuOpen()"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
            </svg>
          </button>
          <div class="flex flex-col flex-1 px-4 justify-center">
            <span class="text-[11px] font-bold text-gray-400 leading-tight">Total</span>
            <span class="text-[17px] font-extrabold text-gray-900 leading-tight">
              {{ cartStore.total() | number:'1.2-2' }}
            </span>
          </div>
          <button (click)="isPaymentModalOpen.set(true)"
                  [disabled]="cartStore.items().length === 0"
                  class="h-full px-6 bg-[#10B981] text-white font-extrabold text-[14px]
                         disabled:opacity-50 flex items-center gap-2 min-w-[130px]">
            Payment
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ── Modals ── -->
      <app-add-customer-modal
        *ngIf="isCustomerModalOpen()"
        (close)="isCustomerModalOpen.set(false)"
        (customerAdded)="onCustomerAdded($event)" />
      <app-payment-modal
        *ngIf="isPaymentModalOpen()"
        (close)="isPaymentModalOpen.set(false)"
        (orderSaved)="onOrderSaved()" />
    </div>
  `,
  styles: [`:host { display: flex; flex-direction: column; height: 100%; min-height: 0; overflow: hidden; }`]
})
export class OrderCartComponent {
  cartStore       = inject(CartStore);
  medicineService = inject(MedicineService);
  uiStore         = inject(UiStore);

  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;

  isCustomerModalOpen = signal(false);
  isPaymentModalOpen  = signal(false);
  isMobileMenuOpen    = signal(false);

  draftCart() {
    if (this.cartStore.items().length > 0) {
      this.cartStore.draftCount.update(c => c + 1);
      this.cartStore.reset();
      this.uiStore.showToast('Order saved to draft', 'success');
      this.isMobileMenuOpen.set(false);
    }
  }

  increment(item: CartItem) {
    this.cartStore.items.update(items =>
      items.map(i => i.medicineId === item.medicineId
        ? { ...i, quantity: i.quantity + 1, subtotal: this.recalc(i.unitPrice, i.quantity + 1, i.discountPct) }
        : i)
    );
  }

  decrement(item: CartItem) {
    if (item.quantity <= 1) return;
    this.cartStore.items.update(items =>
      items.map(i => i.medicineId === item.medicineId
        ? { ...i, quantity: i.quantity - 1, subtotal: this.recalc(i.unitPrice, i.quantity - 1, i.discountPct) }
        : i)
    );
  }

  updateDiscount(event: { item: CartItem; discount: number }) {
    this.cartStore.items.update(items =>
      items.map(i => i.medicineId === event.item.medicineId
        ? { ...i, discountPct: event.discount, subtotal: this.recalc(i.unitPrice, i.quantity, event.discount) }
        : i)
    );
  }

  removeItem(item: CartItem) {
    this.cartStore.items.update(items => items.filter(i => i.medicineId !== item.medicineId));
  }

  handleBarcodeScan(event: Event) {
    const input = event.target as HTMLInputElement;
    const code  = input.value.trim();
    if (!code) return;
    this.medicineService.getMedicines({ search: code }).subscribe(res => {
      const match = (res.data || [])[0];
      if (match) {
        match.stock > 0
          ? this.cartStore.addItem(match)
          : this.uiStore.showToast('Item out of stock', 'error');
      } else {
        this.uiStore.showToast('Product not found: ' + code, 'error');
      }
      input.value = '';
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 10);
    });
  }

  onCustomerAdded(customer: CustomerDto) {
    this.cartStore.selectedCustomer.set(customer);
    this.isCustomerModalOpen.set(false);
    this.uiStore.showToast('Customer added successfully', 'success');
  }

  onOrderSaved() { this.isPaymentModalOpen.set(false); }

  private recalc(price: number, qty: number, disc: number): number {
    return Math.round(price * qty * (1 - disc / 100) * 100) / 100;
  }
}
