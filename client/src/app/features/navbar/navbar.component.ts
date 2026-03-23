import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../../store/cart.store';
import { DraftListModalComponent } from '../modals/draft-list/draft-list-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, DraftListModalComponent],
  template: `
    <div
      class="h-[56px] bg-white border-b border-gray-200 px-4 flex items-center justify-between flex-shrink-0 shadow-sm"
    >
      <!-- Left: Logo + Keyboard + Time -->
      <div class="flex items-center gap-4">
        <!-- Pharma POS Logo -->
        <div class="flex items-center gap-2">
          <div class="grid grid-cols-2 gap-[2px] w-[26px] h-[26px]">
            <div class="bg-[#FF5A5F] rounded-tl-[3px]"></div>
            <div class="bg-[#00C48C] rounded-tr-[3px]"></div>
            <div class="bg-[#0081F1] rounded-bl-[3px]"></div>
            <div class="bg-[#FFBE00] rounded-br-[3px]"></div>
          </div>
          <span class="font-bold text-[#0D2441] text-[18px] tracking-tight leading-none"
            >Pharma <span class="text-[#10B981]">POS</span></span
          >
        </div>

        <!-- Keyboard Icon Button -->
        <button
          class="hidden sm:flex w-9 h-9 border border-gray-200 rounded-full items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke-width="1.5" />
            <path
              d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7.5 14h9"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- Time Badge -->
        <div
          class="hidden md:flex items-center gap-1 text-[13px] text-[#10B981] font-semibold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full"
        >
          {{ currentTime() }}
        </div>
      </div>

      <!-- Center: Nav Actions (Desktop) -->
      <div class="hidden xl:flex items-center gap-2">
        <button class="nav-btn">
          <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Report
        </button>
        <button class="nav-btn">
          <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          Return
        </button>
        <button class="nav-btn">
          <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Recent
        </button>
        <button (click)="isDraftModalOpen.set(true)" class="nav-btn-draft">
          <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Draft ({{ cartStore.draftCount() }})
        </button>
      </div>

      <!-- Right: Screen + Avatar + Exit + Menu -->
      <div class="flex items-center gap-2">
        <button class="hidden lg:flex nav-btn">
          <svg class="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          Screen
        </button>

        <!-- User Avatar -->
        <div
          class="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[14px] font-bold select-none"
        >
          R
        </div>

        <button class="hidden lg:flex btn-exit">
          Exit
          <svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>

        <!-- 3-dot -->
        <button class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Draft List Modal -->
    <app-draft-list-modal
      *ngIf="isDraftModalOpen()"
      (close)="isDraftModalOpen.set(false)"
      (draftLoaded)="isDraftModalOpen.set(false)" />
  `,
  styles: [
    `
      :host {
        display: block;
        flex-shrink: 0;
      }
      .nav-btn {
        @apply h-[34px] px-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50
             text-[13px] font-semibold text-gray-600 flex items-center gap-1.5 transition-colors whitespace-nowrap;
      }
      .nav-btn-draft {
        @apply h-[34px] px-3 border border-[#FBB018] rounded-full bg-white hover:bg-amber-50
             text-[13px] font-semibold text-[#FBB018] flex items-center gap-1.5 transition-colors whitespace-nowrap;
      }
      .btn-exit {
        @apply h-[34px] px-3 border border-red-300 rounded-full bg-white hover:bg-red-50
             text-[13px] font-semibold text-red-500 flex items-center gap-1.5 transition-colors;
      }
    `,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  cartStore = inject(CartStore);
  currentTime = signal<string>('');
  isDraftModalOpen = signal(false);
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
    const time = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const date = now.toLocaleDateString('en-GB').replace(/\//g, '/');
    this.currentTime.set(`${time} || ${date}`);
  }
}
