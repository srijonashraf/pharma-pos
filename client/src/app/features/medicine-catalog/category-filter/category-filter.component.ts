import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterOption {
  label: string;
  value: 'all' | 'in_stock' | 'out_of_stock' | 'discounted';
}

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full bg-white h-full border-r border-[#E5E7EB]">
      <button
        *ngFor="let filter of filters"
        (click)="select.emit(filter.value)"
        class="w-full text-left px-4 py-[13px] text-[13px] font-semibold transition-colors border-b border-[#F3F4F6]"
        [class.bg-[#10B981]]="activeValue === filter.value"
        [class.text-white]="activeValue === filter.value"
        [class.text-[#374151]]="activeValue !== filter.value"
        [class.hover:bg-gray-50]="activeValue !== filter.value"
      >
        {{ filter.label }}
      </button>
    </div>
  `,
  styles: [`:host { display: flex; flex-direction: column; height: 100%; min-height: 0; overflow-y: auto; }`]
})
export class CategoryFilterComponent {
  @Input() activeValue: string = 'all';
  @Output() select = new EventEmitter<'all' | 'in_stock' | 'out_of_stock' | 'discounted'>();

  filters: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'In Stock', value: 'in_stock' },
    { label: 'Out of Stock', value: 'out_of_stock' },
    { label: 'Discounted', value: 'discounted' },
  ];
}
