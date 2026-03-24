import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartItem } from '../../../store/cart.store';
import { CurrencyBdtPipe } from '../../../shared/pipes/currency-bdt.pipe';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, CurrencyBdtPipe],
  template: `
    <!-- DESKTOP TABLE ROW -->
    <div class="hidden lg:grid gap-1 items-center px-3 py-[7px] border-b border-gray-100 text-[13px] bg-white hover:bg-gray-50 transition-colors"
         style="grid-template-columns: 1fr 80px 56px 90px 46px 64px 28px;">

      <!-- Item name -->
      <span class="text-gray-800 font-semibold truncate pr-1">{{ item.medicineName }}</span>

      <!-- Unit dropdown -->
      <div class="flex items-center gap-0.5">
        <span class="text-[12px] text-gray-600">{{ item.unit }}</span>
        <svg class="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      <!-- Price -->
      <span class="text-gray-700 font-medium text-right">{{ item.unitPrice }}</span>

      <!-- Qty Controls -->
      <div class="flex items-center gap-[5px] justify-center">
        <button (click)="decrement.emit(item)"
                class="w-[22px] h-[22px] rounded-full bg-[#FC686F] hover:bg-red-500 text-white flex items-center justify-center font-bold text-base leading-none flex-shrink-0">
          −
        </button>
        <input type="number" [value]="item.quantity" (change)="onQuantityChange($event)"
               min="1" step="1"
               class="w-10 text-center text-[13px] text-gray-800 font-semibold bg-transparent border border-transparent
                      rounded focus:border-[#10B981] focus:outline-none focus:bg-white hover:border-gray-200
                      transition-colors h-[26px] [appearance:textfield]
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
        <button (click)="increment.emit(item)"
                class="w-[22px] h-[22px] rounded-full bg-[#10B981] hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-base leading-none flex-shrink-0">
          +
        </button>
      </div>

      <!-- Discount % -->
      <input type="number" [value]="item.discountPct" (change)="onDiscountChange($event)"
             min="0" max="100" step="1"
             class="w-full text-center text-[13px] text-gray-700 font-medium bg-transparent border border-transparent
                    rounded focus:border-[#10B981] focus:outline-none focus:bg-white hover:border-gray-200
                    transition-colors h-[26px] [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />

      <!-- Subtotal -->
      <span class="text-gray-800 text-right font-semibold">{{ item.subtotal }}</span>

      <!-- Delete button -->
      <button (click)="remove.emit(item)"
              class="flex justify-center items-center text-gray-300 hover:text-red-500 transition-colors">
        <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>

    <!-- MOBILE LAYOUT -->
    <div class="lg:hidden px-3 py-3 border-b border-gray-100 bg-white">
      <div class="flex items-start justify-between mb-2">
        <div>
          <div class="text-[13px] font-semibold text-gray-800">{{ item.medicineName }}</div>
          <div class="text-[12px] text-gray-400 mt-0.5">{{ item.unitPrice | currencyBdt }} / {{ item.unit }}</div>
        </div>
        <span class="text-[13px] font-bold text-gray-800">{{ item.subtotal | currencyBdt }}</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 flex-1">
          <button (click)="decrement.emit(item)"
                  class="w-7 h-7 rounded-full bg-[#FC686F] text-white flex items-center justify-center font-bold text-lg leading-none">−</button>
          <input type="number" [value]="item.quantity" (change)="onQuantityChange($event)"
                 min="1" step="1"
                 class="w-10 text-center text-[12px] text-gray-800 font-semibold border border-gray-200 rounded h-7
                        focus:border-[#10B981] focus:outline-none [appearance:textfield]
                        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          <button (click)="increment.emit(item)"
                  class="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-lg leading-none">+</button>
        </div>
        <div class="flex items-center gap-1">
          <input type="number" [value]="item.discountPct" (change)="onDiscountChange($event)"
                 min="0" max="100" step="1"
                 class="w-12 text-center text-[12px] text-gray-600 border border-gray-200 rounded h-7
                        focus:border-[#10B981] focus:outline-none [appearance:textfield]
                        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          <span class="text-[11px] text-gray-400">%</span>
        </div>
        <span class="text-[12px] text-gray-500">{{ item.unit }}</span>
        <svg (click)="remove.emit(item)" class="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </div>
    </div>
  `
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() increment = new EventEmitter<CartItem>();
  @Output() decrement = new EventEmitter<CartItem>();
  @Output() updateDiscount = new EventEmitter<{ item: CartItem, discount: number }>();
  @Output() updateQuantity = new EventEmitter<{ item: CartItem, quantity: number }>();
  @Output() remove = new EventEmitter<CartItem>();

  onQuantityChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    const clamped = Math.max(1, Math.round(Number(value) || 1));
    this.updateQuantity.emit({ item: this.item, quantity: clamped });
  }

  onDiscountChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    const clamped = Math.min(100, Math.max(0, Number(value) || 0));
    this.updateDiscount.emit({ item: this.item, discount: clamped });
  }
}
