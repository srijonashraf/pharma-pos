import { Component, inject } from '@angular/core';
import { UiStore } from '../../../store/ui.store';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[998] p-4"
         (click)="uiStore.resolveConfirm(false)">
      <div class="bg-white rounded-2xl w-full max-w-[360px] shadow-2xl overflow-hidden"
           (click)="$event.stopPropagation()">
        <div class="px-5 pt-5 pb-3">
          <p class="text-[14px] font-semibold text-gray-800 text-center">{{ uiStore.confirm()!.message }}</p>
        </div>
        <div class="flex border-t border-gray-100">
          <button (click)="uiStore.resolveConfirm(false)"
                  class="flex-1 h-11 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100">
            Cancel
          </button>
          <button (click)="uiStore.resolveConfirm(true)"
                  class="flex-1 h-11 text-[13px] font-bold text-[#FC686F] hover:bg-red-50 transition-colors">
            Confirm
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  uiStore = inject(UiStore);
}
