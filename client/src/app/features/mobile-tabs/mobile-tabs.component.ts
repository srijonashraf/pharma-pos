import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-mobile-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 px-3 h-[52px] border-b border-gray-200 bg-white lg:hidden flex-shrink-0">
      <!-- Hamburger -->
      <button class="w-9 h-9 flex items-center justify-center text-gray-500 text-lg">
        ☰
      </button>

      <!-- Order Tab -->
      <button (click)="cartStore.activeTab.set('order')"
              class="flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-colors"
              [class.bg-emerald-500]="cartStore.activeTab() === 'order'"
              [class.text-white]="cartStore.activeTab() === 'order'"
              [class.text-gray-500]="cartStore.activeTab() !== 'order'">
        <span>≡</span> Order
      </button>

      <!-- Cart Tab -->
      <button (click)="cartStore.activeTab.set('cart')"
              class="flex items-center gap-1.5 h-8 px-3 rounded-full text-sm font-medium transition-colors"
              [class.bg-emerald-500]="cartStore.activeTab() === 'cart'"
              [class.text-white]="cartStore.activeTab() === 'cart'"
              [class.text-gray-500]="cartStore.activeTab() !== 'cart'">
        <span>🛒</span> Cart
      </button>

      <!-- Draft counter -->
      <button class="flex items-center h-8 px-2 text-sm text-amber-500 font-medium">
        ✏️ ({{ cartStore.draftCount() }})
      </button>

      <!-- 3-dot menu -->
      <button class="ml-auto w-9 h-9 flex items-center justify-center text-gray-500 text-lg">
        ⋮
      </button>
    </div>
  `
})
export class MobileTabsComponent {
  cartStore = inject(CartStore);
}
