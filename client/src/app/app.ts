import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './features/navbar/navbar.component';
import { MobileTabsComponent } from './features/mobile-tabs/mobile-tabs.component';
import { MedicineCatalogComponent } from './features/medicine-catalog/medicine-catalog.component';
import { OrderCartComponent } from './features/order-cart/order-cart.component';
import { CartStore } from './store/cart.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MobileTabsComponent, MedicineCatalogComponent, OrderCartComponent],
  template: `
    <div class="pharmacy-app h-screen flex flex-col bg-pageBg text-textPrimary text-[13px]">
      <!-- TOP NAVBAR -->
      <app-navbar />

      <!-- MAIN CONTENT AREA -->
      <div class="flex flex-1 overflow-hidden">

        <!-- DESKTOP: Two-panel layout -->
        <div class="hidden lg:flex flex-1 overflow-hidden">
          <!-- LEFT PANEL: Medicine Catalog (60% width) -->
          <div class="flex flex-col w-[60%] border-r border-gray-200 overflow-hidden">
            <app-medicine-catalog />
          </div>

          <!-- RIGHT PANEL: Order Cart (40% width) -->
          <div class="flex flex-col w-[40%] overflow-hidden bg-white">
            <app-order-cart />
          </div>
        </div>

        <!-- MOBILE: Tab-based navigation -->
        <div class="flex flex-col flex-1 lg:hidden overflow-hidden">
          <app-mobile-tabs />
          
          <ng-container [ngSwitch]="cartStore.activeTab()">
            <!-- Order View -->
            <div *ngSwitchCase="'order'" class="flex flex-col flex-1 overflow-hidden">
              <app-medicine-catalog />
            </div>
            
            <!-- Cart View -->
            <div *ngSwitchCase="'cart'" class="flex flex-col flex-1 overflow-hidden bg-white">
              <app-order-cart />
            </div>
          </ng-container>
        </div>

      </div>
    </div>
  `
})
export class App {
  cartStore = inject(CartStore);
}
