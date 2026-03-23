import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicine-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center h-10 px-3 border border-gray-200 rounded-lg bg-white focus-within:border-[#10B981] focus-within:shadow-sm transition-all">
      <svg class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        type="text"
        placeholder="Search by  Product name, Generic, Barcode no"
        (input)="search.emit($any($event.target).value)"
        class="flex-1 text-[13px] text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
      />
    </div>
  `
})
export class MedicineSearchComponent {
  @Output() search = new EventEmitter<string>();
}
