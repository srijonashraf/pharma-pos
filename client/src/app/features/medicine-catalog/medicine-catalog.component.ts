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
    <div class="flex flex-col h-full bg-white">
      
      <!-- Top Search Bar -->
      <div class="p-3 border-b border-gray-200">
        <app-medicine-search (search)="searchQuery.set($event)" />
      </div>

      <!-- Main Layout -->
      <div class="flex flex-1 overflow-hidden">
        
        <!-- Left Sidebar (Desktop Filters) -->
        <div class="hidden lg:block w-[160px] overflow-y-auto bg-white">
          <app-category-filter [activeValue]="activeFilter()" (select)="activeFilter.set($event)" />
        </div>

        <!-- Right Content Area -->
        <div class="flex flex-col flex-1 overflow-hidden">
          
          <!-- Grid Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <span class="text-[13px] text-textSecondary">
              Total Medicine <span class="font-medium text-textPrimary">({{ medicines()?.meta?.total || 0 }})</span>
            </span>
            <select class="text-[13px] text-primary border-none bg-transparent cursor-pointer font-medium focus:outline-none"
                    (change)="onBrandChange($event)">
              <option value="">Select brand ▾</option>
              <option value="Square">Square</option>
              <option value="Beximco">Beximco</option>
              <option value="Incepta">Incepta</option>
            </select>
          </div>

          <!-- Scrollable Grid -->
          <div class="flex-1 overflow-y-auto p-3 bg-pageBg">
            
            <!-- Loading Skeletons -->
            <div *ngIf="!medicines()" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
               <div *ngFor="let _ of [1,2,3,4,5,6]" class="border border-gray-200 rounded-lg overflow-hidden animate-pulse bg-white h-[200px]">
                 <div class="h-[120px] bg-gray-100"></div>
                 <div class="p-2 space-y-2 mt-2">
                   <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                   <div class="h-3 bg-gray-200 rounded w-1/3"></div>
                 </div>
               </div>
            </div>

            <!-- Medicine Cards Grid -->
            <div *ngIf="medicines()" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pb-[100px]">
              <app-medicine-card *ngFor="let med of medicines()?.data" [medicine]="med" />
              
              <!-- Empty state -->
              <div *ngIf="medicines()?.data?.length === 0" class="col-span-full py-10 text-center text-textSecondary text-[13px]">
                No medicines found matching criteria.
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
      
      <!-- Bottom Action Bar (Fixed at bottom of left panel) -->
      <div class="flex gap-[12px] p-[12px] border-t border-gray-200 bg-white flex-shrink-0 h-[72px]">
        <button (click)="resetCart()" class="flex-1 rounded-md font-semibold text-[15px] text-white bg-[#FC686F] hover:brightness-95 transition-all shadow-sm">
          Reset
        </button>
        <button class="flex-1 rounded-md font-semibold text-[15px] text-white bg-[#5D87FF] hover:brightness-95 transition-all shadow-sm">
          Add. info
        </button>
        <button class="flex-1 rounded-md font-semibold text-[15px] text-white bg-[#F863A2] hover:brightness-95 transition-all shadow-sm">
          Discount
        </button>
      </div>
      
    </div>
  `
})
export class MedicineCatalogComponent {
  medicineService = inject(MedicineService);
  cartStore = inject(CartStore);

  searchQuery = signal('');
  activeFilter = signal<'all' | 'in_stock' | 'out_of_stock' | 'discounted'>('all');
  selectedBrand = signal<string>('');
  currentPage = signal(1);

  // Derived state that automatically triggers HTTP when filter signals change
  private filterState = computed(() => ({
    search: this.searchQuery(),
    status: this.activeFilter(),
    brand: this.selectedBrand(),
    page: this.currentPage(),
    limit: 20,
  }));

  // Fetch medicines seamlessly with RxJS
  medicines = toSignal(
    toObservable(this.filterState).pipe(
      debounceTime(50), 
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(filter => this.medicineService.getMedicines(filter))
    )
  );

  onBrandChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedBrand.set(target.value);
  }

  resetCart() {
    if (confirm('Are you sure you want to completely clear the cart?')) {
      this.cartStore.reset();
    }
  }

  draftCart() {
    if (this.cartStore.items().length > 0) {
      this.cartStore.draftCount.update(c => c + 1);
      this.cartStore.reset();
      // In real scenario, would POST /drafts
    }
  }
}
