import { Component, EventEmitter, Output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../../store/cart.store';
import { OrderService } from '../../../core/services/order.service';
import { CreateOrderDto } from '../../../core/models/order.model';
import { CurrencyBdtPipe } from '../../../shared/pipes/currency-bdt.pipe';
import { UiStore } from '../../../store/ui.store';

@Component({
//... template identical
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyBdtPipe],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-[520px] shadow-xl flex flex-col">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-800">Order payment</h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto bg-pageBg">
          
          <!-- Total Amount display -->
          <div class="flex items-center justify-between">
            <span class="text-[13px] text-gray-600">Total Amount</span>
            <span class="text-xl font-bold text-emerald-500">{{ cartStore.total() | currencyBdt }}</span>
          </div>

          <!-- Payment method selector -->
          <div>
            <p class="text-[13px] font-medium text-gray-700 mb-2">Payment method</p>
            <div class="grid grid-cols-3 gap-3">
              <!-- Cash -->
              <button (click)="method.set('cash')"
                      class="flex flex-col items-center gap-1 p-3 border rounded-lg transition-all"
                      [class.border-emerald-500]="method() === 'cash'"
                      [class.bg-emerald-50]="method() === 'cash'"
                      [class.border-gray-200]="method() !== 'cash'">
                <span class="text-2xl">💵</span>
                <span class="text-xs text-gray-700 font-medium">Cash</span>
              </button>
              <!-- Bank/Card -->
              <button (click)="method.set('bank_card')"
                      class="flex flex-col items-center gap-1 p-3 border rounded-lg transition-all"
                      [class.border-emerald-500]="method() === 'bank_card'"
                      [class.bg-emerald-50]="method() === 'bank_card'"
                      [class.border-gray-200]="method() !== 'bank_card'">
                <span class="text-2xl">💳</span>
                <span class="text-xs text-gray-700 font-medium">Bank/Card</span>
              </button>
              <!-- MFS -->
              <button (click)="method.set('mfs')"
                      class="flex flex-col items-center gap-1 p-3 border rounded-lg transition-all"
                      [class.border-emerald-500]="method() === 'mfs'"
                      [class.bg-emerald-50]="method() === 'mfs'"
                      [class.border-gray-200]="method() !== 'mfs'">
                <span class="text-2xl">📱</span>
                <span class="text-xs text-gray-700 font-medium">MFS</span>
              </button>
            </div>
          </div>

          <!-- Input amount -->
          <div>
            <p class="text-[13px] font-medium text-gray-700 mb-2">Input amount</p>
            <input type="number" [ngModel]="amountTaken()" (ngModelChange)="amountTaken.set($event)"
                   class="w-full h-12 px-4 border border-gray-200 rounded-lg text-lg text-right text-gray-800 font-medium 
                          focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 transition-all bg-white"
                   placeholder="0" />
          </div>

          <!-- Payment summary table -->
          <div class="grid grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden text-[13px] bg-white">
            
            <!-- Left: Order breakdown -->
            <div class="border-r border-gray-200">
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-500">Subtotal</span>
                <span class="text-gray-800">{{ cartStore.subtotal() | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-500">Vat/Tax</span>
                <span class="text-gray-800">{{ cartStore.vatAmount() | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-500">Discount</span>
                <span class="text-gray-800">{{ cartStore.cartDiscount() | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-500">Adjustment</span>
                <span class="text-gray-800">{{ cartStore.adjustment() }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 bg-emerald-500 text-white font-medium">
                <span>Total</span>
                <span>{{ cartStore.total() | currencyBdt }}</span>
              </div>
            </div>

            <!-- Right: Payment status -->
            <div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-500">Taken</span>
                <span class="text-gray-800">{{ amountTaken() || 0 | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-500">Return</span>
                <span class="text-gray-800">{{ amountReturn() | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100 bg-emerald-500 text-white font-medium">
                <span>Paid</span>
                <span>{{ amountPaid() | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100 bg-red-500 text-white font-medium">
                <span>Due</span>
                <span>{{ amountDue() | currencyBdt }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 bg-gray-50 font-semibold tracking-wide"
                   [class.text-emerald-500]="paymentStatus() === 'paid'"
                   [class.text-red-500]="paymentStatus() === 'due'"
                   [class.text-amber-500]="paymentStatus() === 'partial'">
                <span class="text-gray-500 font-normal">Status</span>
                <span class="uppercase text-[11px] mt-0.5">{{ paymentStatus() }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 p-4 border-t border-gray-200 bg-white">
          <button (click)="close.emit()"
                  class="px-5 h-10 border border-gray-300 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button class="px-4 h-10 border border-gray-300 rounded-lg text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors">
            🖨️
          </button>
          <button (click)="saveOrder()" [disabled]="submitting"
                  class="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-medium rounded-lg disabled:opacity-50 transition-colors">
            {{ submitting ? 'Processing...' : 'Save' }}
          </button>
        </div>

      </div>
    </div>
  `
})
export class PaymentModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() orderSaved = new EventEmitter<void>();

  cartStore = inject(CartStore);
  orderService = inject(OrderService);
  uiStore = inject(UiStore);

  method = signal<'cash' | 'bank_card' | 'mfs'>('cash');
  amountTaken = signal<number | null>(null);

  submitting = false;

  amountReturn = computed(() => {
    const taken = this.amountTaken() || 0;
    return Math.max(0, taken - this.cartStore.total());
  });

  amountPaid = computed(() => {
    const taken = this.amountTaken() || 0;
    return Math.min(taken, this.cartStore.total());
  });

  amountDue = computed(() => {
    return Math.max(0, this.cartStore.total() - this.amountPaid());
  });

  paymentStatus = computed(() => {
    if (this.amountDue() <= 0) return 'paid';
    if (this.amountPaid() > 0) return 'partial';
    return 'due';
  });

  saveOrder() {
    if (this.amountDue() > 0) {
      if (!confirm('Order is not fully paid. Do you want to process a due order?')) {
        return;
      }
    }

    this.submitting = true;
    
    let custId: string | undefined = undefined;
    const selectedObj = this.cartStore.selectedCustomer();
    if (selectedObj) {
      custId = selectedObj.id;
    }

    const orderDto: CreateOrderDto = {
      customerId: custId,
      items: this.cartStore.items().map((i: any) => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
        unit: i.unit,
        discountPct: i.discountPct
      })),
      discountAmount: this.cartStore.cartDiscount(),
      adjustment: this.cartStore.adjustment(),
      payment: {
        method: this.method(),
        amountTaken: this.amountTaken() || 0
      }
    };

    this.orderService.createOrder(orderDto).subscribe({
      next: () => {
        this.submitting = false;
        this.uiStore.showToast('Order saved successfully', 'success');
        this.cartStore.reset();
        this.orderSaved.emit();
      },
      error: (err: unknown) => {
        this.submitting = false;
        // Global interceptor handles toast error
      }
    });
  }
}
