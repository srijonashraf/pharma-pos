import { Component, EventEmitter, Output, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../../store/cart.store';
import { UiStore } from '../../../store/ui.store';

@Component({
  selector: 'app-discount-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div class="bg-white rounded-2xl w-full max-w-[320px] shadow-2xl overflow-hidden"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-extrabold text-gray-800">Cart Discount</h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Amount input -->
          <div>
            <p class="text-[11px] font-bold text-gray-500 uppercase mb-1.5">Discount Amount (Tk)</p>
            <input type="number" [ngModel]="amount()" (ngModelChange)="amount.set($event)"
                   class="w-full h-11 px-4 border-2 border-gray-200 rounded-xl text-[16px] text-right
                          font-bold text-gray-800 focus:outline-none focus:border-[#10B981] transition-colors"
                   placeholder="0" />
          </div>

          <!-- Current vs new -->
          <div *ngIf="cartStore.cartDiscount() > 0"
               class="text-[12px] text-gray-500 flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
            <span>Current discount</span>
            <span class="font-semibold">Tk. {{ cartStore.cartDiscount() | number:'1.2-2' }}</span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button (click)="clearDiscount()"
                    class="h-10 px-4 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Clear
            </button>
            <button (click)="applyDiscount()"
                    class="flex-1 h-10 bg-[#FBB018] hover:brightness-95 text-white text-[13px] font-extrabold rounded-xl transition-all">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DiscountPopupComponent {
  @Output() close = new EventEmitter<void>();

  @HostListener('window:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  cartStore = inject(CartStore);
  uiStore = inject(UiStore);
  amount = signal<number | null>(null);

  applyDiscount() {
    const value = this.amount();
    if (value && value > 0) {
      if (value > this.cartStore.subtotal()) {
        this.uiStore.showToast('Discount cannot be greater than the total price', 'error');
        return;
      }
      this.cartStore.cartDiscount.set(value);
    }
    this.close.emit();
  }

  clearDiscount() {
    this.cartStore.cartDiscount.set(0);
    this.close.emit();
  }
}
