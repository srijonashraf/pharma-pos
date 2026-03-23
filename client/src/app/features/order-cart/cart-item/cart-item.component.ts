import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../store/cart.store';
import { CurrencyBdtPipe } from '../../../shared/pipes/currency-bdt.pipe';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, CurrencyBdtPipe, IconComponent],
  template: `
    <!-- DESKTOP LAYOUT (Table Row equivalent) -->
    <div class="hidden lg:grid grid-cols-[1fr_60px_60px_90px_60px_70px_30px] 
                gap-2 items-center px-4 py-2 border-b border-gray-100 text-[13px] bg-white hover:bg-gray-50">
      
      <span class="text-gray-800 font-medium truncate">{{ item.medicineName }}</span>
      
      <select [value]="item.unit" class="h-7 border border-gray-200 rounded px-1 text-gray-600 focus:outline-none focus:border-emerald-400">
        <option value="Pcs">Pcs</option>
        <option value="Box">Box</option>
      </select>
      
      <span class="text-gray-600 text-right">{{ item.unitPrice | currencyBdt }}</span>
      
      <div class="flex items-center gap-2 justify-center">
        <button (click)="decrement.emit(item)" class="w-6 h-6 rounded-full bg-red-400 hover:bg-red-500 text-white flex items-center justify-center font-bold pb-0.5">−</button>
        <span class="w-6 text-center font-medium">{{ item.quantity }}</span>
        <button (click)="increment.emit(item)" class="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center font-bold pb-0.5">+</button>
      </div>
      
      <input type="number" [value]="item.discountPct" (change)="onDiscountChange($event)"
             class="w-full h-7 border border-gray-200 rounded px-1 text-center text-gray-600 focus:outline-none focus:border-emerald-400" />
      
      <span class="text-gray-800 text-right font-medium">{{ item.subtotal | currencyBdt }}</span>
      
      <button (click)="remove.emit(item)" class="text-gray-400 hover:text-red-500 w-full flex justify-center">
        <div class="w-4 h-4"><app-icon name="trash" /></div>
      </button>
    </div>

    <!-- MOBILE LAYOUT (Stacked) -->
    <div class="lg:hidden p-3 border-b border-gray-100 bg-white">
      <div class="flex items-start justify-between mb-2">
        <span class="text-sm font-medium text-gray-800">{{ item.medicineName }}</span>
        <span class="text-sm font-medium text-gray-800">{{ item.subtotal | currencyBdt }}</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-3 flex-1">
          <button (click)="decrement.emit(item)" class="w-7 h-7 rounded-full bg-red-400 hover:bg-red-500 text-white text-lg font-bold flex items-center justify-center pb-1">−</button>
          <span class="w-6 text-center text-sm font-medium">{{ item.quantity }}</span>
          <button (click)="increment.emit(item)" class="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold flex items-center justify-center pb-1">+</button>
        </div>
        <span class="text-[13px] text-gray-500">{{ item.unitPrice | currencyBdt }}</span>
        <select [value]="item.unit" class="h-8 border border-gray-200 rounded px-2 text-[13px] text-gray-600">
          <option value="Pcs">Pcs</option>
        </select>
        <div class="w-6 h-6 text-gray-400 hover:text-red-500 flex items-center justify-center" (click)="remove.emit(item)">
          <app-icon name="trash" />
        </div>
      </div>
    </div>
  `
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() increment = new EventEmitter<CartItem>();
  @Output() decrement = new EventEmitter<CartItem>();
  @Output() updateDiscount = new EventEmitter<{ item: CartItem, discount: number }>();
  @Output() remove = new EventEmitter<CartItem>();

  onDiscountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.updateDiscount.emit({ item: this.item, discount: Number(target.value) });
  }
}
