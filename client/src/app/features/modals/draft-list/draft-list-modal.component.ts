import { Component, EventEmitter, Output, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore, DraftCart } from '../../../store/cart.store';

@Component({
  selector: 'app-draft-list-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div class="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col overflow-hidden"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 class="text-[15px] font-extrabold text-gray-800">
            Saved Drafts
            <span class="text-[13px] font-semibold text-gray-400 ml-1">({{ cartStore.drafts().length }})</span>
          </h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Draft List -->
        <div class="max-h-[60vh] overflow-y-auto">

          <div *ngIf="cartStore.drafts().length === 0"
               class="py-12 text-center text-gray-300">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <p class="text-[13px]">No drafts saved</p>
          </div>

          <div *ngFor="let draft of cartStore.drafts(); let i = index"
               class="px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[13px] font-bold text-gray-800">Draft #{{ cartStore.drafts().length - i }}</span>
                  <span class="text-[11px] text-gray-400">{{ formatTime(draft.savedAt) }}</span>
                </div>
                <div class="text-[12px] text-gray-500">
                  {{ draft.items.length }} item{{ draft.items.length !== 1 ? 's' : '' }}
                  · Tk. {{ getDraftTotal(draft) | number:'1.2-2' }}
                  <span *ngIf="draft.customer" class="ml-1">· {{ draft.customer.displayName || draft.customer.name }}</span>
                </div>
                <div *ngIf="draft.note" class="text-[11px] text-amber-600 mt-0.5 truncate">
                  {{ draft.note }}
                </div>
              </div>

              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button (click)="loadDraft(draft)"
                        class="h-[30px] px-3 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-[12px] font-bold transition-colors">
                  Load
                </button>
                <button (click)="removeDraft(draft)"
                        class="h-[30px] w-[30px] rounded-lg border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-500
                               flex items-center justify-center transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`]
})
export class DraftListModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() draftLoaded = new EventEmitter<void>();

  @HostListener('window:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  cartStore = inject(CartStore);

  loadDraft(draft: DraftCart) {
    this.cartStore.loadDraft(draft.id);
    this.draftLoaded.emit();
  }

  removeDraft(draft: DraftCart) {
    this.cartStore.deleteDraft(draft.id);
  }

  getDraftTotal(draft: DraftCart): number {
    const subtotal = draft.items.reduce((sum, i) => sum + i.subtotal, 0);
    const vat = Math.round(subtotal * 0.10 * 100) / 100;
    return Math.round((subtotal + vat - draft.discount + draft.adjustment) * 100) / 100;
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' });
  }
}
