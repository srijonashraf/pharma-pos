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
    <div class="flex flex-col h-full bg-white relative">
      
      <!-- Customer Row -->
      <div class="flex items-center gap-2 p-3 border-b border-gray-200 flex-shrink-0">
        <div class="flex-1">
          <button class="flex items-center gap-2 w-full h-10 px-3 border border-gray-200 
                         rounded-lg text-[13px] text-gray-700 hover:border-gray-300 bg-white">
            <span class="text-gray-400 text-base">👤</span>
            <span class="flex-1 text-left line-clamp-1">
              {{ cartStore.selectedCustomer()?.displayName ?? 'Walking Customer' }}
            </span>
            <span class="text-gray-400 text-xs">▾</span>
          </button>
        </div>
        <button (click)="isCustomerModalOpen.set(true)" 
                class="flex items-center gap-1 h-10 px-3 bg-emerald-500 hover:bg-emerald-600 
                       text-white text-[13px] font-medium rounded-lg whitespace-nowrap transition-colors">
          <span class="text-lg font-light leading-none">+</span> Add customer
        </button>
      </div>

      <!-- Barcode Scanner Input -->
      <div class="p-2 px-3 border-b border-gray-200 flex-shrink-0 bg-white">
        <div class="flex items-center h-9 px-3 border border-dashed border-gray-400 rounded-lg bg-gray-50 focus-within:border-emerald-500 focus-within:bg-white transition-colors">
          <div class="w-4 h-4 text-gray-400 mr-2"><app-icon name="barcode" /></div>
          <input #barcodeInput type="text" placeholder="Scan barcode, product code"
                 (keydown.enter)="handleBarcodeScan($event)"
                 class="flex-1 text-[13px] text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none" />
        </div>
      </div>

      <!-- Desktop Table Header -->
      <div class="hidden lg:grid grid-cols-[1fr_60px_60px_90px_60px_70px_30px] 
                  gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 flex-shrink-0">
        <span>Item</span>
        <span>Unit</span>
        <span class="text-right">Price</span>
        <span class="text-center">Qty</span>
        <span class="text-center">Disc%</span>
        <span class="text-right">Subtotal</span>
        <span></span>
      </div>

      <!-- Cart Items Scrollable List -->
      <div class="flex-1 overflow-y-auto bg-pageBg">
        <app-cart-item *ngFor="let item of cartStore.items()" 
                       [item]="item"
                       (increment)="increment(item)"
                       (decrement)="decrement(item)"
                       (updateDiscount)="updateDiscount($event)"
                       (remove)="removeItem(item)" />
                       
        <div *ngIf="cartStore.items().length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 p-6 opacity-60">
          <div class="w-16 h-16"><app-icon name="medicine" /></div>
          <p class="text-[13px]">No items added</p>
        </div>
      </div>

      <!-- Cart Summary Totals -->
      <div class="border-t border-gray-200 px-4 py-3 text-[13px] bg-white flex-shrink-0 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Subtotal</span>
          <span class="text-gray-800 font-medium">{{ cartStore.subtotal() | currencyBdt }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Discount</span>
          <span class="text-gray-800 font-medium text-emerald-600">- {{ cartStore.cartDiscount() | currencyBdt }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Vat/Tax</span>
          <span class="text-gray-800 font-medium">{{ cartStore.vatAmount() | currencyBdt }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-500">Adjustment</span>
          <span class="text-gray-800 font-medium">{{ cartStore.adjustment() }}</span>
        </div>
      </div>

      <!-- Desktop Toolbar Row -->
      <div class="hidden lg:flex items-stretch gap-[12px] p-[12px] border-t border-gray-200 bg-white flex-shrink-0 h-[72px]">
        <button (click)="draftCart()" class="flex-1 rounded-md font-semibold text-[15px] text-white bg-[#FBB018] hover:brightness-95 transition-all shadow-sm">
          Draft
        </button>

        <div class="flex-1 rounded-md bg-[#F3F4F6] flex flex-col justify-center items-center px-4">
          <div class="text-[12px] font-semibold text-[#6B7280] leading-tight">Total</div>
          <div class="text-[18px] font-bold text-[#111827] leading-tight">{{ cartStore.total() | currencyBdt:'' }}</div>
        </div>

        <button class="w-[55px] rounded-md bg-[#8E8E93] flex items-center justify-center text-white hover:brightness-95 transition-colors shadow-sm">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H7zm2 4h6v2H9V6zm0 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"></path></svg>
        </button>

        <button (click)="isPaymentModalOpen.set(true)" [disabled]="cartStore.items().length === 0"
                class="flex-1 flex items-center justify-between px-6 bg-[#10B981] hover:bg-emerald-600 
                       text-white text-[16px] font-semibold rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <span>Payment</span>
          <span class="text-xl leading-none">›</span>
        </button>
      </div>

      <!-- Mobile Checkout Floating Menu & Bottom Row -->
      <div class="lg:hidden relative">
        
        <!-- Popover Menu -->
        <div *ngIf="isMobileMenuOpen()" class="absolute bottom-full left-0 mb-3 px-4 flex flex-col gap-2 w-[180px]">
           <button (click)="draftCart()" class="h-10 rounded shadow-md font-medium text-white bg-[#FBB018] w-full">Draft</button>
           <button class="h-10 rounded shadow-md font-medium text-white bg-[#8E8E93] w-full">Calculator</button>
           <button class="h-10 rounded shadow-md font-medium text-white bg-[#F863A2] w-full">Discount</button>
           <button class="h-10 rounded shadow-md font-medium text-white bg-[#5D87FF] w-full">Add. info (1)</button>
        </div>

        <!-- Sticky Bar -->
        <div class="flex items-center bg-white border-t border-gray-200 h-[60px]">
          <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" class="h-full w-[60px] flex items-center justify-center border-r border-gray-200 text-emerald-500">
            <svg class="w-6 h-6 transform transition-transform" [class.rotate-180]="isMobileMenuOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
          
          <div class="flex flex-col flex-1 px-4 justify-center">
            <div class="text-[11px] font-semibold text-gray-500">Total</div>
            <div class="text-[17px] font-bold text-gray-900 leading-tight">{{ cartStore.total() | currencyBdt:'' }}</div>
          </div>
          
          <button (click)="isPaymentModalOpen.set(true)" [disabled]="cartStore.items().length === 0"
                  class="h-full px-6 bg-[#10B981] text-white font-semibold disabled:opacity-50 flex items-center justify-between gap-3 min-w-[130px]">
            Payment <span class="text-xl">›</span>
          </button>
        </div>
      </div>
      
      <!-- Modals -->
      <app-add-customer-modal *ngIf="isCustomerModalOpen()" 
                              (close)="isCustomerModalOpen.set(false)"
                              (customerAdded)="onCustomerAdded($event)" />
      <app-payment-modal *ngIf="isPaymentModalOpen()"
                         (close)="isPaymentModalOpen.set(false)"
                         (orderSaved)="onOrderSaved()" />
    </div>
  `
})
export class OrderCartComponent {
  cartStore = inject(CartStore);
  medicineService = inject(MedicineService);
  uiStore = inject(UiStore);

  @ViewChild('barcodeInput') barcodeInput!: ElementRef<HTMLInputElement>;
  
  isCustomerModalOpen = signal(false);
  isPaymentModalOpen = signal(false);
  isMobileMenuOpen = signal(false);

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
        : i
      )
    );
  }

  decrement(item: CartItem) {
    if (item.quantity <= 1) return;
    this.cartStore.items.update(items =>
      items.map(i => i.medicineId === item.medicineId
        ? { ...i, quantity: i.quantity - 1, subtotal: this.recalc(i.unitPrice, i.quantity - 1, i.discountPct) }
        : i
      )
    );
  }

  updateDiscount(event: { item: CartItem, discount: number }) {
    this.cartStore.items.update(items =>
      items.map(i => i.medicineId === event.item.medicineId
        ? { ...i, discountPct: event.discount, subtotal: this.recalc(i.unitPrice, i.quantity, event.discount) }
        : i
      )
    );
  }

  removeItem(item: CartItem) {
    this.cartStore.items.update(items => items.filter(i => i.medicineId !== item.medicineId));
  }

  handleBarcodeScan(event: Event) {
    const input = event.target as HTMLInputElement;
    const code = input.value.trim();
    if (!code) return;

    this.medicineService.getMedicines({ search: code }).subscribe(res => {
      // Safely access data (it defaults to empty array on failure via interceptor, though normally success)
      const dataItems = res.data || [];
      const match = dataItems[0];
      if (match) {
        if (match.stock > 0) {
          this.cartStore.addItem(match);
        } else {
          this.uiStore.showToast('Item out of stock', 'error');
        }
      } else {
        this.uiStore.showToast('Product not found for barcode: ' + code, 'error');
      }
      input.value = '';
      setTimeout(() => this.barcodeInput.nativeElement.focus(), 10);
    });
  }

  onCustomerAdded(customer: CustomerDto) {
    this.cartStore.selectedCustomer.set(customer);
    this.isCustomerModalOpen.set(false);
    this.uiStore.showToast('Customer added & selected successfully', 'success');
  }

  onOrderSaved() {
    this.isPaymentModalOpen.set(false);
  }

  private recalc(price: number, qty: number, disc: number): number {
    return Math.round(price * qty * (1 - disc / 100) * 100) / 100;
  }
}
