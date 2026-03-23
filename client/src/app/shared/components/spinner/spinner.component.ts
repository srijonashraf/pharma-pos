import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  `
})
export class SpinnerComponent {}
