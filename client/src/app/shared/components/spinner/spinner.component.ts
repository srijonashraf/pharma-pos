import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center w-full h-full py-8">
      <div class="w-8 h-8 border-2 border-gray-200 border-t-[#10B981] rounded-full animate-spin"></div>
    </div>
  `
})
export class SpinnerComponent {}
