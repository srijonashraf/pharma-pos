import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName = 'barcode' | 'medicine' | 'cross' | 'trash' | 'calculator';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="name">
      <svg *ngSwitchCase="'barcode'" viewBox="0 0 24 24" fill="none" class="w-full h-full" stroke="currentColor" stroke-width="1.5">
        <path d="M4 5v14M7 5v14M11 5v14M14 5v14M17 5v14M20 5v14" stroke-linecap="round"/>
      </svg>

      <svg *ngSwitchCase="'trash'" viewBox="0 0 24 24" fill="none" class="w-full h-full" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>

      <svg *ngSwitchCase="'medicine'" viewBox="0 0 48 48" fill="none" class="w-full h-full" stroke="currentColor" stroke-width="2">
        <rect x="8" y="14" width="32" height="24" rx="4"/>
        <path d="M16 14V11a4 4 0 018 0v3" stroke-linecap="round"/>
        <path d="M20 24h8M24 20v8" stroke-linecap="round"/>
      </svg>

      <svg *ngSwitchCase="'calculator'" viewBox="0 0 24 24" fill="none" class="w-full h-full" stroke="currentColor" stroke-width="1.8">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <path d="M8 6h8M8 10h2m4 0h2M8 14h2m4 0h2M8 18h2m4 0h2" stroke-linecap="round"/>
      </svg>

      <span *ngSwitchDefault class="text-inherit text-xs">{{ name }}</span>
    </ng-container>
  `
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
}
