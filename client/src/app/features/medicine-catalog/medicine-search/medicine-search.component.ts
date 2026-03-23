import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-medicine-search',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative w-full">
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4">
        <app-icon name="barcode" />
      </div>
      <input
        type="text"
        placeholder="Search by Product name, Generic, Barcode no"
        (input)="onInput($event)"
        [value]="value"
        class="w-full h-11 pl-10 pr-4 border border-borderLight rounded-lg text-sm text-textPrimary 
               placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 
               focus:ring-emerald-200 bg-inputBg transition-all"
      />
      <button *ngIf="value" (click)="clear()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        ✕
      </button>
    </div>
  `
})
export class MedicineSearchComponent {
  @Output() search = new EventEmitter<string>();
  value = '';
  
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(val => {
      this.search.emit(val);
    });
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.searchSubject.next(this.value);
  }

  clear() {
    this.value = '';
    this.searchSubject.next('');
    this.search.emit('');
  }
}
