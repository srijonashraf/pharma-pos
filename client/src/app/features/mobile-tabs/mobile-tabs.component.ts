import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-mobile-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 px-3 h-[50px] border-b border-gray-200 bg-white lg:hidden flex-shrink-0">
      <!-- Hamburger -->
      <button class="w-9 h-9 flex items-center justify-center text-gray-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Order Tab -->
      <button (click)="cartStore.activeTab.set('order')"
              class="flex items-center gap-1.5 h-[34px] px-4 rounded-full text-[13px] font-semibold transition-colors"
              [class.bg-[#10B981]]="cartStore.activeTab() === 'order'"
              [class.text-white]="cartStore.activeTab() === 'order'"
              [class.text-gray-500]="cartStore.activeTab() !== 'order'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        Order
      </button>

      <!-- Cart Tab -->
      <button (click)="cartStore.activeTab.set('cart')"
              class="flex items-center gap-1.5 h-[34px] px-4 rounded-full text-[13px] font-semibold transition-colors"
              [class.bg-[#10B981]]="cartStore.activeTab() === 'cart'"
              [class.text-white]="cartStore.activeTab() === 'cart'"
              [class.text-gray-500]="cartStore.activeTab() !== 'cart'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        Cart
      </button>

      <!-- Draft badge -->
      <button class="flex items-center h-[34px] px-2 text-[13px] text-[#FBB018] font-semibold">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        ({{ cartStore.draftCount() }})
      </button>

      <!-- 3-dot menu -->
      <button class="ml-auto w-9 h-9 flex items-center justify-center text-gray-400">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
        </svg>
      </button>
    </div>
  `
})
export class MobileTabsComponent {
  cartStore = inject(CartStore);
}
