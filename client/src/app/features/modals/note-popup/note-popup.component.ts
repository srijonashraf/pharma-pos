import { Component, EventEmitter, Output, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../../store/cart.store';

@Component({
  selector: 'app-note-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div class="bg-white rounded-2xl w-full max-w-[360px] shadow-2xl overflow-hidden"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-extrabold text-gray-800">Order Note</h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="p-5 space-y-4">
          <!-- Note textarea -->
          <div>
            <textarea [ngModel]="text()" (ngModelChange)="text.set($event)"
                      rows="4"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[13px] text-gray-800
                             placeholder-gray-400 focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                      placeholder="e.g. Prescription #123, pick up tomorrow..."></textarea>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button (click)="clearNote()"
                    class="h-10 px-4 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Clear
            </button>
            <button (click)="saveNote()"
                    class="flex-1 h-10 bg-[#10B981] hover:bg-emerald-600 text-white text-[13px] font-extrabold rounded-xl transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotePopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  @HostListener('window:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  cartStore = inject(CartStore);
  text = signal('');

  ngOnInit() {
    this.text.set(this.cartStore.note());
  }

  saveNote() {
    this.cartStore.note.set(this.text());
    this.close.emit();
  }

  clearNote() {
    this.text.set('');
    this.cartStore.note.set('');
    this.close.emit();
  }
}
