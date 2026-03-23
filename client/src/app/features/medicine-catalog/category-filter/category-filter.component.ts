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
        class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium transition-colors border-b border-[#F3F4F6]"
        [class.bg-[#10B981]]="activeValue === filter.value"
        [class.text-white]="activeValue === filter.value"
        [class.text-[#4B5563]]="activeValue !== filter.value"
        [class.hover:bg-gray-50]="activeValue !== filter.value"
      >
        {{ filter.label }}
      </button>
      
      <!-- Visual Placeholders to match Target POS Layout exactly -->
      <button class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium text-[#4B5563] border-b border-[#F3F4F6] bg-white hover:bg-gray-50">Antibiotics</button>
      <button class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium text-[#4B5563] border-b border-[#F3F4F6] bg-white hover:bg-gray-50">Painkillers</button>
      <button class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium text-[#4B5563] border-b border-[#F3F4F6] bg-white hover:bg-gray-50">Vitamins</button>
      <button class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium text-[#4B5563] border-b border-[#F3F4F6] bg-white hover:bg-gray-50">Syrups</button>
      <button class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium text-[#4B5563] border-b border-[#F3F4F6] bg-white hover:bg-gray-50">Injections</button>
      <button class="w-full text-left px-4 py-[14px] text-[13.5px] font-medium text-[#4B5563] border-b border-[#F3F4F6] bg-white hover:bg-gray-50">Ointments</button>
    </div>
  `
})
export class CategoryFilterComponent {
  @Input() activeValue: string = 'all';
  @Output() select = new EventEmitter<'all' | 'in_stock' | 'out_of_stock' | 'discounted'>();

  filters: FilterOption[] = [
    { label: 'All medicine', value: 'all' },
    { label: 'In stock', value: 'in_stock' },
    { label: 'Out of stock', value: 'out_of_stock' },
    { label: 'Discount', value: 'discounted' },
  ];
}
