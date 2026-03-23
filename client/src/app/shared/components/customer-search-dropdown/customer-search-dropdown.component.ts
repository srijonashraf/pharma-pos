import { Component, EventEmitter, Input, Output, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerDto } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-search-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full">
      <!-- Trigger Button -->
      <button (click)="toggleDropdown()"
              class="flex items-center gap-2 w-full h-[38px] px-3 border border-gray-200
                     rounded-lg text-[13px] text-gray-700 hover:border-gray-300 bg-white transition-colors">
        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <span class="flex-1 text-left truncate font-medium">
          {{ selectedCustomer?.displayName || selectedCustomer?.name || 'Walking Customer' }}
        </span>
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200"
             [class.rotate-180]="isOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Panel -->
      <div *ngIf="isOpen()"
           class="absolute top-[42px] left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-30
                  flex flex-col max-h-[280px] overflow-hidden">

        <!-- Search Input -->
        <div class="px-3 py-2 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center h-[34px] px-3 border border-gray-200 rounded-lg bg-gray-50
                      focus-within:border-[#10B981] focus-within:bg-white transition-colors">
            <svg class="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input #searchInput type="text" placeholder="Search customer..."
                   (input)="onSearchInput($event)"
                   class="flex-1 text-[13px] text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none" />
          </div>
        </div>

        <!-- Results -->
        <div class="overflow-y-auto flex-1 min-h-0">
          <!-- Walking Customer (default) -->
          <button (click)="selectWalking()"
                  class="w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-600
                         hover:bg-emerald-50 hover:text-[#10B981] transition-colors flex items-center gap-2 border-b border-gray-50">
            <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Walking Customer
          </button>

          <!-- Loading -->
          <div *ngIf="loading()" class="px-4 py-3 text-[12px] text-gray-400 text-center">Searching...</div>

          <!-- Results List -->
          <button *ngFor="let c of results()"
                  (click)="selectCustomer(c)"
                  class="w-full text-left px-4 py-2.5 text-[13px] text-gray-700
                         hover:bg-emerald-50 hover:text-[#10B981] transition-colors border-b border-gray-50 last:border-0">
            <div class="font-semibold">{{ c.displayName || c.name }}</div>
            <div *ngIf="c.phone" class="text-[11px] text-gray-400 mt-0.5">{{ c.phone }}</div>
          </button>

          <!-- No results -->
          <div *ngIf="!loading() && searchTerm() && results().length === 0"
               class="px-4 py-3 text-[12px] text-gray-400 text-center">
            No customers found
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class CustomerSearchDropdownComponent {
  @Input() selectedCustomer: CustomerDto | null = null;
  @Output() customerSelected = new EventEmitter<CustomerDto | null>();

  private el = inject(ElementRef);
  private customerService = inject(CustomerService);

  isOpen = signal(false);
  loading = signal(false);
  results = signal<CustomerDto[]>([]);
  searchTerm = signal('');

  private search$ = new Subject<string>();

  constructor() {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading.set(true);
        return this.customerService.getCustomers(term);
      })
    ).subscribe(res => {
      this.results.set(res.data || []);
      this.loading.set(false);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      this.searchTerm.set('');
      this.results.set([]);
    }
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim();
    this.searchTerm.set(term);
    this.search$.next(term);
  }

  selectCustomer(customer: CustomerDto) {
    this.customerSelected.emit(customer);
    this.isOpen.set(false);
  }

  selectWalking() {
    this.customerSelected.emit(null);
    this.isOpen.set(false);
  }
}
