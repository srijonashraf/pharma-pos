import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="type">
      <!-- Out of Stock -->
      <span *ngSwitchCase="'outOfStock'" class="absolute top-1 left-1 text-xs font-medium text-red-500">
        Out of stock
      </span>
      
      <!-- In Stock -->
      <div *ngSwitchCase="'inStock'" class="absolute top-1 left-1 text-xs text-gray-500 leading-tight">
        <span class="text-gray-400">In stock: </span>
        <span class="font-medium text-gray-700">{{ value }}</span>
      </div>

      <!-- Discount Amount -->
      <span *ngSwitchCase="'discount'" class="absolute bottom-1 left-1 text-xs font-semibold text-emerald-600">
        {{ value }}
      </span>

      <!-- Qty Circle -->
      <span *ngSwitchCase="'qty'" 
            class="absolute -bottom-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs 
             font-bold rounded-full flex items-center justify-center z-10">
        {{ value }}
      </span>
    </ng-container>
  `
})
export class BadgeComponent {
  @Input({ required: true }) type!: 'outOfStock' | 'inStock' | 'discount' | 'qty';
  @Input() value?: string | number;
}
