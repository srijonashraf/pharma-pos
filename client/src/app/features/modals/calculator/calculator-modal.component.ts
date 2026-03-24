import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculator-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-2xl w-full max-w-[320px] shadow-2xl overflow-hidden flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-extrabold text-gray-800">Calculator</h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Calculator Body -->
        <div class="p-5 flex flex-col gap-4">
          <!-- Display -->
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-end justify-center min-h-[80px] break-all">
            <div class="text-gray-400 text-[13px] font-bold min-h-[20px]">{{ equation }}</div>
            <div class="text-gray-900 text-[28px] font-extrabold leading-none tracking-tight">{{ displayValue }}</div>
          </div>

          <!-- Keypad -->
          <div class="grid grid-cols-4 gap-2">
            <!-- Row 1 -->
            <button (click)="clearAll()" class="col-span-2 h-12 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 font-extrabold text-[15px] transition-colors">AC</button>
            <button (click)="deleteLast()" class="h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[15px] flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"/>
              </svg>
            </button>
            <button (click)="appendOperator('/')" class="h-12 rounded-xl bg-[#F5F6FA] hover:bg-gray-200 text-[#10B981] font-extrabold text-[18px] transition-colors">÷</button>

            <!-- Row 2 -->
            <button (click)="appendNumber('7')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">7</button>
            <button (click)="appendNumber('8')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">8</button>
            <button (click)="appendNumber('9')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">9</button>
            <button (click)="appendOperator('*')" class="h-12 rounded-xl bg-[#F5F6FA] hover:bg-gray-200 text-[#10B981] font-extrabold text-[18px] transition-colors">×</button>

            <!-- Row 3 -->
            <button (click)="appendNumber('4')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">4</button>
            <button (click)="appendNumber('5')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">5</button>
            <button (click)="appendNumber('6')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">6</button>
            <button (click)="appendOperator('-')" class="h-12 rounded-xl bg-[#F5F6FA] hover:bg-gray-200 text-[#10B981] font-extrabold text-[22px] transition-colors">−</button>

            <!-- Row 4 -->
            <button (click)="appendNumber('1')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">1</button>
            <button (click)="appendNumber('2')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">2</button>
            <button (click)="appendNumber('3')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">3</button>
            <button (click)="appendOperator('+')" class="h-12 rounded-xl bg-[#F5F6FA] hover:bg-gray-200 text-[#10B981] font-extrabold text-[20px] transition-colors">+</button>

            <!-- Row 5 -->
            <button (click)="appendNumber('0')" class="col-span-2 h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-bold text-[18px] transition-colors">0</button>
            <button (click)="appendNumber('.')" class="h-12 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-800 font-extrabold text-[20px] transition-colors">.</button>
            <button (click)="calculate()" class="h-12 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white shadow-sm font-extrabold text-[20px] transition-colors">=</button>

          </div>
        </div>

      </div>
    </div>
  `
})
export class CalculatorModalComponent {
  @Output() close = new EventEmitter<void>();

  displayValue: string = '0';
  equation: string = '';
  private operator: string | null = null;
  private previousValue: string | null = null;
  private waitingForNewValue = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (/[0-9\.]/.test(key)) {
      this.appendNumber(key);
      event.preventDefault();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      this.appendOperator(key);
      event.preventDefault();
    } else if (key === 'Enter' || key === '=') {
      this.calculate();
      event.preventDefault();
    } else if (key === 'Backspace') {
      this.deleteLast();
      event.preventDefault();
    } else if (key === 'Delete' || key.toLowerCase() === 'c') {
      this.clearAll();
      event.preventDefault();
    } else if (key === 'Escape') {
      this.close.emit();
      event.preventDefault();
    }
  }

  appendNumber(num: string) {
    if (this.waitingForNewValue) {
      this.displayValue = num;
      this.waitingForNewValue = false;
    } else {
      if (num === '.' && this.displayValue.includes('.')) return;
      this.displayValue = this.displayValue === '0' && num !== '.' ? num : this.displayValue + num;
    }
  }

  appendOperator(op: string) {
    if (this.operator && !this.waitingForNewValue) {
      this.calculate();
    }
    
    this.previousValue = this.displayValue;
    this.operator = op;
    this.waitingForNewValue = true;
    this.equation = `${this.previousValue} ${this.getOperatorSymbol(op)}`;
  }

  calculate() {
    if (!this.operator || !this.previousValue || this.waitingForNewValue) return;

    const prev = parseFloat(this.previousValue);
    const curr = parseFloat(this.displayValue);
    let result = 0;

    switch (this.operator) {
      case '+': result = prev + curr; break;
      case '-': result = prev - curr; break;
      case '*': result = prev * curr; break;
      case '/': result = curr !== 0 ? prev / curr : 0; break;
    }

    // Handle floating point precision safely
    result = Math.round(result * 100000000) / 100000000;
    
    this.equation = `${this.previousValue} ${this.getOperatorSymbol(this.operator)} ${this.displayValue} =`;
    this.displayValue = result.toString();
    this.operator = null;
    this.previousValue = null;
    this.waitingForNewValue = true;
  }

  clearAll() {
    this.displayValue = '0';
    this.equation = '';
    this.operator = null;
    this.previousValue = null;
    this.waitingForNewValue = false;
  }

  deleteLast() {
    if (this.waitingForNewValue) return;
    this.displayValue = this.displayValue.length > 1 ? this.displayValue.slice(0, -1) : '0';
  }

  private getOperatorSymbol(op: string): string {
    switch (op) {
      case '*': return '×';
      case '/': return '÷';
      case '-': return '−';
      default: return op;
    }
  }
}
