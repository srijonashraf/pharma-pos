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
    <div
      class="hidden lg:grid items-stretch border-b border-gray-100 text-[13px] bg-white hover:bg-gray-50 transition-colors last:border-b-0"
      style="grid-template-columns: minmax(150px, 1fr) 65px 65px 105px 60px 75px 44px;"
    >
      <!-- Item name -->
      <div class="px-3 py-2 border-r border-gray-100 flex items-center">
        <span class="text-gray-800 font-medium truncate">{{ item.medicineName }}</span>
      </div>

      <!-- Unit dropdown -->
      <div
        class="px-1 py-2 border-r border-gray-100 flex justify-center items-center gap-1 cursor-pointer"
      >
        <span class="text-[12px] text-gray-700 font-medium">{{ item.unit }}</span>
        <svg
          class="w-3 h-3 text-[#10B981] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <!-- Price -->
      <div class="px-1 py-2 border-r border-gray-100 flex justify-center items-center">
        <span class="text-gray-700 font-medium">{{ item.unitPrice }}</span>
      </div>

      <!-- Qty Controls -->
      <div class="py-2 border-r border-gray-100 flex justify-center items-center gap-1.5 px-[2px]">
        <button
          (click)="decrement.emit(item)"
          class="w-[26px] h-[26px] rounded-full bg-[#EF4444] hover:bg-red-600 text-white flex items-center justify-center font-bold text-lg leading-none flex-shrink-0 transition-colors"
        >
          −
        </button>
        <input
          type="number"
          [value]="item.quantity"
          (change)="onQuantityChange($event)"
          min="1"
          step="1"
          class="flex-1 w-full min-w-0 text-center text-[13px] text-gray-800 font-semibold bg-transparent border border-transparent
                      rounded focus:border-[#10B981] focus:outline-none focus:bg-white hover:border-gray-200
                      transition-colors h-[26px] [appearance:textfield]
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none p-0"
        />
        <button
          (click)="increment.emit(item)"
          class="w-[26px] h-[26px] rounded-full bg-[#10B981] hover:bg-emerald-600 text-white flex items-center justify-center font-bold text-lg leading-none flex-shrink-0 transition-colors"
        >
          +
        </button>
      </div>

      <!-- Discount % -->
      <div class="px-1 py-2 border-r border-gray-100 flex justify-center items-center">
        <input
          type="number"
          [value]="item.discountPct"
          (change)="onDiscountChange($event)"
          min="0"
          max="100"
          step="1"
          class="w-full text-center text-[13px] text-gray-800 font-bold bg-transparent border border-transparent
                      rounded focus:border-[#10B981] focus:outline-none focus:bg-white hover:border-gray-200
                      transition-colors h-[26px] [appearance:textfield]
                      [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none p-0"
        />
      </div>

      <!-- Subtotal -->
      <div class="px-1 py-2 border-r border-gray-100 flex justify-center items-center">
        <span class="text-gray-800 font-semibold">{{ item.subtotal }}</span>
      </div>

      <!-- Delete button -->
      <div class="px-1 py-2 flex justify-center items-center">
        <button
          (click)="remove.emit(item)"
          class="w-[28px] h-[28px] flex justify-center items-center rounded border border-red-300 text-[#EF4444] hover:bg-red-50 hover:border-red-400 transition-colors"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- MOBILE LAYOUT -->
    <div class="lg:hidden px-3 py-3 border-b border-gray-100 bg-white">
      <div class="flex items-start justify-between mb-2">
        <div>
          <div class="text-[13px] font-semibold text-gray-800">{{ item.medicineName }}</div>
          <div class="text-[12px] text-gray-400 mt-0.5">
            {{ item.unitPrice | currencyBdt }} / {{ item.unit }}
          </div>
        </div>
        <span class="text-[13px] font-bold text-gray-800">{{ item.subtotal | currencyBdt }}</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 flex-1">
          <button
            (click)="decrement.emit(item)"
            class="w-7 h-7 rounded-full bg-[#FC686F] text-white flex items-center justify-center font-bold text-lg leading-none"
          >
            −
          </button>
          <input
            type="number"
            [value]="item.quantity"
            (change)="onQuantityChange($event)"
            min="1"
            step="1"
            class="w-10 text-center text-[12px] text-gray-800 font-semibold border border-gray-200 rounded h-7
                        focus:border-[#10B981] focus:outline-none [appearance:textfield]
                        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            (click)="increment.emit(item)"
            class="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-lg leading-none"
          >
            +
          </button>
        </div>
        <div class="flex items-center gap-1">
          <input
            type="number"
            [value]="item.discountPct"
            (change)="onDiscountChange($event)"
            min="0"
            max="100"
            step="1"
            class="w-12 text-center text-[12px] text-gray-600 border border-gray-200 rounded h-7
                        focus:border-[#10B981] focus:outline-none [appearance:textfield]
                        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span class="text-[11px] text-gray-400">%</span>
        </div>
        <span class="text-[12px] text-gray-500">{{ item.unit }}</span>
        <svg
          (click)="remove.emit(item)"
          class="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
    </div>
  `,
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() increment = new EventEmitter<CartItem>();
  @Output() decrement = new EventEmitter<CartItem>();
  @Output() updateDiscount = new EventEmitter<{ item: CartItem; discount: number }>();
  @Output() updateQuantity = new EventEmitter<{ item: CartItem; quantity: number }>();
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
