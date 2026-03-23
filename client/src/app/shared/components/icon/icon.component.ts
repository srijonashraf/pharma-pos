import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName = 'barcode' | 'medicine' | 'cross' | 'trash' | 'calculator';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Temporary fallback to emojis/simple SVGs to match PDF intent -->
    <ng-container [ngSwitch]="name">
      <svg *ngSwitchCase="'barcode'" viewBox="0 0 24 24" fill="none" class="w-full h-full stroke-current stroke-2">
        <path d="M4 6V18M8 6V18M12 6V18M16 6V18M20 6V18" />
        <path d="M4 12H20" class="opacity-50" />
      </svg>
      <svg *ngSwitchCase="'trash'" viewBox="0 0 24 24" fill="none" class="w-full h-full stroke-current stroke-2">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
      <!-- Generic box for medicine -->
      <svg *ngSwitchCase="'medicine'" viewBox="0 0 24 24" fill="none" class="w-full h-full stroke-current stroke-2">
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
      <span *ngSwitchDefault class="text-inherit">{{ name }}</span>
    </ng-container>
  `
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
}
