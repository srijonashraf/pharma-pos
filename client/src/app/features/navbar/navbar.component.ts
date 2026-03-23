import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[60px] bg-white border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0">
      
      <!-- Left: Logo + Keyboard + Time -->
      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <!-- Colorful 4-square logo placeholder -->
          <div class="grid grid-cols-2 gap-[2px] w-[22px] h-[22px]">
            <div class="bg-red-500 rounded-tl-sm"></div>
            <div class="bg-emerald-500 rounded-tr-sm"></div>
            <div class="bg-blue-500 rounded-bl-sm"></div>
            <div class="bg-amber-500 rounded-br-sm"></div>
          </div>
          <span class="font-bold text-[#0D2441] text-[19px]">Invoice 360</span>
        </div>
        
        <!-- Keyboard Icon -->
        <button class="hidden sm:flex w-10 h-8 border border-gray-300 rounded-full items-center justify-center text-gray-600 hover:bg-gray-50">
          ⌨️
        </button>

        <div class="hidden md:block text-[13px] text-emerald-500 font-medium tracking-wide bg-emerald-50 px-3 py-1.5 rounded-full">
          {{ currentTime() }}
        </div>
      </div>

      <!-- Center: Actions (Desktop only) -->
      <div class="hidden xl:flex items-center gap-3">
        <button class="nav-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Report
        </button>
        <button class="nav-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
          Return
        </button>
        <button class="nav-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Recent
        </button>
        <button class="nav-btn-draft">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Draft ({{ cartStore.draftCount() }})
        </button>
      </div>

      <!-- Right: Screen + User Config -->
      <div class="flex items-center gap-3">
        <button class="hidden lg:flex nav-btn mr-4">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
          Screen
        </button>
        
        <div class="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[15px] font-bold">
          R
        </div>
        
        <button class="hidden lg:flex btn-exit">
          Exit 
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
        
        <button class="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
        </button>
      </div>
      
    </div>
  `,
  styles: [`
    .nav-btn {
      @apply h-[36px] px-4 border border-gray-300 rounded-full bg-white hover:bg-gray-50 
             text-[14px] font-medium text-[#4B5563] flex items-center gap-2 transition-colors;
    }
    .nav-btn-draft {
      @apply h-[36px] px-4 border border-[#F5A623] rounded-full bg-white hover:bg-amber-50 
             text-[14px] font-medium text-[#F5A623] flex items-center gap-2 transition-colors;
    }
    .btn-exit {
      @apply h-[36px] px-4 border border-red-300 rounded-full bg-white hover:bg-red-50 
             text-[14px] font-medium text-red-500 flex items-center gap-1 transition-colors;
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartStore = inject(CartStore);
  currentTime = signal<string>('');
  private timer?: any;

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private updateTime() {
    const now = new Date();
    this.currentTime.set(
      now.toLocaleTimeString('en-GB', { hour12: false }) +
      ' || ' +
      now.toLocaleDateString('en-GB')
    );
  }
}
