import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './features/navbar/navbar.component';
import { MobileTabsComponent } from './features/mobile-tabs/mobile-tabs.component';
import { MedicineCatalogComponent } from './features/medicine-catalog/medicine-catalog.component';
import { OrderCartComponent } from './features/order-cart/order-cart.component';
import { CartStore } from './store/cart.store';
import { UiStore } from './store/ui.store';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MobileTabsComponent, MedicineCatalogComponent, OrderCartComponent, ConfirmDialogComponent],
  template: `
    <!--
      ROOT LAYOUT CONTRACT
      ┌──────────────────────────────────────────────┐  ← h-screen, flex-col, overflow-hidden
      │  Navbar  (flex-shrink-0)                     │
      ├──────────────────────────────────────────────┤
      │  ┌─────────────────┐ ┌──────────────────────┐│  ← flex-1 min-h-0 (fills remaining height)
      │  │  Left 60%       │ │  Right 40%           ││
      │  │  MedicineCatalog│ │  OrderCart           ││  both panels: h-full, flex-col, min-h-0
      │  │  (scrolls inside│ │  (scrolls inside)    ││
      │  └─────────────────┘ └──────────────────────┘│
      └──────────────────────────────────────────────┘
    -->
    <div class="pharmacy-app h-screen flex flex-col bg-[#F5F6FA] text-[#111827] text-[13px] overflow-hidden">

      <!-- TOP NAVBAR — pinned -->
      <app-navbar />

      <!-- MAIN AREA — takes all remaining height, never overflows root -->
      <div class="flex flex-1 min-h-0 overflow-hidden">

        <!-- DESKTOP: side-by-side panels -->
        <div class="hidden lg:flex flex-1 min-h-0 overflow-hidden">

          <!-- Left panel: 60% -->
          <div class="flex flex-col min-h-0 border-r border-gray-200 overflow-hidden" style="width:60%">
            <app-medicine-catalog />
          </div>

          <!-- Right panel: 40% -->
          <div class="flex flex-col min-h-0 overflow-hidden bg-white" style="width:40%">
            <app-order-cart />
          </div>

        </div>

        <!-- MOBILE: tab-based -->
        <div class="flex flex-col flex-1 min-h-0 lg:hidden overflow-hidden">
          <app-mobile-tabs />

          <ng-container [ngSwitch]="cartStore.activeTab()">
            <div *ngSwitchCase="'order'" class="flex flex-col flex-1 min-h-0 overflow-hidden">
              <app-medicine-catalog />
            </div>
            <div *ngSwitchCase="'cart'" class="flex flex-col flex-1 min-h-0 overflow-hidden bg-white">
              <app-order-cart />
            </div>
          </ng-container>
        </div>

      </div>

      <!-- Toast Notification -->
      <div *ngIf="uiStore.toast()"
           class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-3 rounded-xl shadow-xl
                  text-white text-[13px] font-semibold flex items-center gap-2 pointer-events-none"
           [class.bg-[#10B981]]="uiStore.toast()?.type === 'success'"
           [class.bg-[#FC686F]]="uiStore.toast()?.type === 'error'"
           [class.bg-[#FBB018]]="uiStore.toast()?.type === 'info'">
        <svg *ngIf="uiStore.toast()?.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <svg *ngIf="uiStore.toast()?.type === 'error'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        {{ uiStore.toast()?.message }}
      </div>

      <!-- Confirm Dialog -->
      <app-confirm-dialog *ngIf="uiStore.confirm()" />
    </div>
  `
})
export class App {
  cartStore = inject(CartStore);
  uiStore   = inject(UiStore);
}
