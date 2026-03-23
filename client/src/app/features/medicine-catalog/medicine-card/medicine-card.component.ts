import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineDto } from '../../../core/models/medicine.model';
import { CartStore } from '../../../store/cart.store';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CurrencyBdtPipe } from '../../../shared/pipes/currency-bdt.pipe';

@Component({
  selector: 'app-medicine-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, IconComponent, CurrencyBdtPipe],
  template: `
    <div (click)="addToCart()"
         class="relative w-full border border-gray-200 rounded-lg bg-white overflow-visible cursor-pointer 
                hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col h-[200px] select-none">
      
      <!-- Top Image Area -->
      <div class="relative h-[120px] bg-gray-50 flex items-center justify-center rounded-t-lg border-b border-gray-100">
        
        <!-- Stock Badge (Top-Left) -->
        <app-badge *ngIf="medicine.stock === 0" [type]="'outOfStock'" />
        <app-badge *ngIf="medicine.stock > 0" [type]="'inStock'" [value]="medicine.stock" />
        
        <!-- Medicine Icon (Center) -->
        <div class="w-10 h-10 text-gray-400">
          <app-icon name="medicine" />
        </div>
        
        <!-- Discount Badge (Bottom-Left) -->
        <app-badge *ngIf="medicine.discountPct > 0" [type]="'discount'" [value]="medicine.discountPct + '% Off'" />
        
        <!-- Cart Qty Indicator (Bottom-Right, overlapping border) -->
        <app-badge *ngIf="cartQty() > 0" [type]="'qty'" [value]="cartQty()" />
      </div>
      
      <!-- Bottom Info Area -->
      <div class="p-2 flex flex-col justify-center flex-1">
        <h3 class="text-[13px] font-medium text-gray-800 line-clamp-2 leading-tight mb-1">
          {{ medicine.name }}
        </h3>
        <span class="text-[13px] text-gray-600 mt-auto">
          {{ medicine.price | currencyBdt }}
        </span>
      </div>
      
      <!-- Out of Stock Overlay -->
      <div *ngIf="medicine.stock === 0" class="absolute inset-0 bg-white/40 rounded-lg cursor-not-allowed"></div>
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
