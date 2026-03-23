import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="type">
      <!-- Out of Stock - top-left red text -->
      <span *ngSwitchCase="'outOfStock'"
            class="absolute top-[6px] left-[6px] text-[11px] font-semibold text-red-500 leading-tight">
        Out of stock
      </span>

      <!-- In Stock - top-right small text -->
      <div *ngSwitchCase="'inStock'"
           class="absolute top-[6px] right-[6px] text-[11px] leading-tight text-right">
        <div class="text-gray-400 font-medium">In stock:</div>
        <div class="font-bold text-gray-700">{{ value }}</div>
      </div>

      <!-- Discount text - bottom-right green -->
      <span *ngSwitchCase="'discount'"
            class="absolute bottom-[6px] right-[6px] text-[11px] font-bold text-[#10B981] leading-tight">
        {{ value }}
      </span>

      <!-- Qty circle badge - bottom-right red circle -->
      <span *ngSwitchCase="'qty'"
            class="absolute -bottom-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px]
                   font-bold rounded-full flex items-center justify-center z-10 px-1">
        {{ value }}
      </span>
    </ng-container>
  `
})
export class BadgeComponent {
  @Input({ required: true }) type!: 'outOfStock' | 'inStock' | 'discount' | 'qty';
  @Input() value?: string | number;
}
