import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MedicineService } from '../../core/services/medicine.service';
import { MedicineSearchComponent } from './medicine-search/medicine-search.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { MedicineCardComponent } from './medicine-card/medicine-card.component';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-medicine-catalog',
  standalone: true,
  imports: [CommonModule, MedicineSearchComponent, CategoryFilterComponent, MedicineCardComponent],
  template: `
    <!--
      KEY LAYOUT CONTRACT:
      • This component fills the left panel (h-full, flex-col).
      • Search bar   → flex-shrink-0  (never squishes)
      • Middle row   → flex-1 min-h-0  (takes all remaining space between search & bottom bar)
        - Sidebar    → overflow-y-auto  (independent scroll)
        - Grid area  → flex-col, flex-1 min-h-0
          - Grid header → flex-shrink-0
          - Grid scroll → flex-1 min-h-0 overflow-y-auto
      • Bottom bar   → flex-shrink-0  (always visible, pinned to bottom)
    -->
    <div class="flex flex-col h-full bg-white">

      <!-- ── Search Bar (pinned top) ── -->
      <div class="px-3 pt-3 pb-2 border-b border-gray-100 flex-shrink-0">
        <app-medicine-search (search)="searchQuery.set($event)" />
      </div>

      <!-- ── Middle: Sidebar + Grid (fills remaining space) ── -->
      <div class="flex flex-1 min-h-0 overflow-hidden">

        <!-- Left sidebar – independent scroll -->
        <div class="hidden lg:flex flex-col w-[140px] flex-shrink-0 border-r border-gray-100 overflow-y-auto bg-white">
          <app-category-filter [activeValue]="activeFilter()" (select)="activeFilter.set($event)" />
        </div>

        <!-- Right: header + scrollable grid -->
        <div class="flex flex-col flex-1 min-h-0 overflow-hidden">

          <!-- Grid header (pinned) -->
          <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white flex-shrink-0">
            <span class="text-[13px] font-semibold text-gray-600">
              Total Medicine
              <span class="font-bold text-gray-800">({{ medicines()?.meta?.total || 0 }})</span>
            </span>
            <button class="flex items-center gap-1 text-[13px] font-semibold text-[#10B981] hover:text-emerald-700">
              Select brand
              <svg class="w-3.5 h-3.5 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          <!-- Scrollable medicine grid -->
          <div class="flex-1 min-h-0 overflow-y-auto p-3 bg-[#F5F6FA]">

            <!-- Loading skeletons -->
            <div *ngIf="!medicines()" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div *ngFor="let _ of [1,2,3,4,5,6]"
                   class="border border-gray-200 rounded-lg overflow-hidden animate-pulse bg-white"
                   style="height:185px">
                <div class="bg-gray-100" style="height:115px"></div>
                <div class="p-2 space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>

            <!-- Medicine Cards -->
            <div *ngIf="medicines()" class="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
              <app-medicine-card *ngFor="let med of medicines()?.data" [medicine]="med" />
              <div *ngIf="medicines()?.data?.length === 0"
                   class="col-span-full py-12 text-center text-gray-400 text-[13px]">
                No medicines found.
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ── Bottom Action Bar (pinned bottom, always visible) ── -->
      <div class="flex gap-3 px-3 py-3 border-t border-gray-200 bg-white flex-shrink-0" style="height:68px">
        <button (click)="resetCart()"
                class="flex-1 rounded-lg font-bold text-[14px] text-white bg-[#FC686F] hover:brightness-95 transition-all shadow-sm">
          Reset
        </button>
        <button class="flex-1 rounded-lg font-bold text-[14px] text-white bg-[#5D87FF] hover:brightness-95 transition-all shadow-sm">
          Add. info
        </button>
        <button class="flex-1 rounded-lg font-bold text-[14px] text-white bg-[#F863A2] hover:brightness-95 transition-all shadow-sm">
          Discount
        </button>
      </div>

    </div>
  `,
  styles: [`:host { display: flex; flex-direction: column; height: 100%; min-height: 0; overflow: hidden; }`]
})
export class MedicineCatalogComponent {
  medicineService = inject(MedicineService);
  cartStore       = inject(CartStore);

  searchQuery  = signal('');
  activeFilter = signal<'all' | 'in_stock' | 'out_of_stock' | 'discounted'>('all');
  selectedBrand = signal<string>('');
  currentPage  = signal(1);

  private filterState = computed(() => ({
    search:  this.searchQuery(),
    status:  this.activeFilter(),
    brand:   this.selectedBrand(),
    page:    this.currentPage(),
    limit:   20,
  }));

  medicines = toSignal(
    toObservable(this.filterState).pipe(
      debounceTime(50),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(f => this.medicineService.getMedicines(f))
    )
  );

  resetCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartStore.reset();
    }
  }
}
