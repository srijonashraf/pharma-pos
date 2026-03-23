import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineDto } from '../../../core/models/medicine.model';
import { CartStore } from '../../../store/cart.store';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { CurrencyBdtPipe } from '../../../shared/pipes/currency-bdt.pipe';

@Component({
  selector: 'app-medicine-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, CurrencyBdtPipe],
  template: `
    <div (click)="addToCart()"
         class="relative w-full border border-gray-200 rounded-lg bg-white overflow-visible cursor-pointer
                hover:border-[#10B981] hover:shadow-sm transition-all flex flex-col select-none"
         style="height: 185px;">

      <!-- Top Image Area -->
      <div class="relative flex-1 bg-[#F9FAFB] flex items-center justify-center rounded-t-lg border-b border-gray-100 overflow-visible"
           style="min-height: 115px;">

        <!-- Stock / OutOfStock Badge top-left or top-right -->
        <app-badge *ngIf="medicine.stock === 0" [type]="'outOfStock'" />
        <app-badge *ngIf="medicine.stock > 0" [type]="'inStock'" [value]="medicine.stock" />

        <!-- Medicine Image Placeholder -->
        <div class="flex items-center justify-center w-[52px] h-[52px]">
          <svg viewBox="0 0 48 48" fill="none" class="w-full h-full opacity-50">
            <rect x="8" y="14" width="32" height="24" rx="4" stroke="#9CA3AF" stroke-width="2"/>
            <path d="M16 14V11a4 4 0 018 0v3" stroke="#9CA3AF" stroke-width="2"/>
            <path d="M20 24h8M24 20v8" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- Discount Badge bottom-right -->
        <app-badge *ngIf="medicine.discountPct > 0" [type]="'discount'" [value]="medicine.discountPct + '% Off'" />

        <!-- Cart Qty Indicator -->
        <app-badge *ngIf="cartQty() > 0" [type]="'qty'" [value]="cartQty()" />
      </div>

      <!-- Bottom Info Area -->
      <div class="px-2 pt-2 pb-2 flex flex-col gap-[2px]">
        <h3 class="text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2">
          {{ medicine.name }}
        </h3>
        <span class="text-[13px] font-bold text-gray-700">
          {{ medicine.price | currencyBdt }}
        </span>
      </div>

      <!-- Out of Stock overlay -->
      <div *ngIf="medicine.stock === 0"
           class="absolute inset-0 bg-white/50 rounded-lg cursor-not-allowed pointer-events-none"></div>
    </div>
  `
})
export class MedicineCardComponent {
  @Input({ required: true }) medicine!: MedicineDto;

  cartStore = inject(CartStore);
  cartQty = computed(() => this.cartStore.getQty(this.medicine.id));

  addToCart() {
    if (this.medicine.stock === 0) return;
    this.cartStore.addItem(this.medicine);
  }
}
