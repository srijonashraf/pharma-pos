import {
  Component,
  EventEmitter,
  Output,
  inject,
  computed,
  signal,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../../store/cart.store';
import { OrderService } from '../../../core/services/order.service';
import { CreateOrderDto, CreateOrderResponse } from '../../../core/models/order.model';
import { UiStore } from '../../../store/ui.store';
import { InvoiceData } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      (mousedown)="onBackdropMouseDown($event)"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-[520px] shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-extrabold text-gray-800">Order payment</h2>
          <button
            (click)="close.emit()"
            class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto bg-[#F5F6FA]">
          <!-- Total amount -->
          <div
            class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100"
          >
            <span class="text-[13px] text-gray-500 font-medium">Total Amount</span>
            <span class="text-[20px] font-extrabold text-[#10B981]"
              >Tk. {{ cartStore.total() | number: '1.2-2' }}</span
            >
          </div>

          <!-- Payment method -->
          <div>
            <p class="text-[13px] font-bold text-gray-700 mb-2">Payment method</p>
            <div class="grid grid-cols-3 gap-3">
              <button
                *ngFor="let m of methods"
                (click)="method.set(m.value)"
                class="flex flex-col items-center gap-1.5 py-3 border-2 rounded-xl transition-all"
                [class.border-[#10B981]]="method() === m.value"
                [class.bg-emerald-50]="method() === m.value"
                [class.border-gray-200]="method() !== m.value"
                [class.bg-white]="method() !== m.value"
              >
                <span class="text-2xl">{{ m.icon }}</span>
                <span class="text-[12px] font-semibold text-gray-700">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Payment reference (Card / MFS) -->
          <div *ngIf="method() !== 'cash'">
            <p class="text-[13px] font-bold text-gray-700 mb-2">{{ referenceLabel() }}</p>
            <input
              [type]="method() === 'mfs' ? 'tel' : 'text'"
              [ngModel]="reference()"
              (ngModelChange)="reference.set($event)"
              class="w-full h-10 px-4 border-2 rounded-xl text-[13px]
                          font-semibold text-gray-800 focus:outline-none focus:border-[#10B981]
                          transition-colors bg-white"
              [class.border-gray-200]="!referenceError()"
              [class.border-red-400]="referenceError()"
              [placeholder]="referencePlaceholder()"
            />
            <p *ngIf="referenceError()" class="text-[11px] text-red-500 font-medium mt-1 ml-1">
              {{ referenceError() }}
            </p>
          </div>

          <!-- Input amount -->
          <div>
            <p class="text-[13px] font-bold text-gray-700 mb-2">Input amount</p>
            <input
              type="number"
              [ngModel]="amountTaken()"
              (ngModelChange)="amountTaken.set($event)"
              class="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-[18px] text-right
                          font-bold text-gray-800 focus:outline-none focus:border-[#10B981]
                          transition-colors bg-white"
              placeholder="0"
            />
          </div>

          <!-- Payment summary table -->
          <div
            class="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden text-[13px] bg-white"
          >
            <!-- Left: Order breakdown -->
            <div class="border-r border-gray-200">
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-400">Subtotal</span>
                <span class="font-semibold text-gray-700"
                  >Tk. {{ cartStore.subtotal() | number: '1.2-2' }}</span
                >
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-400">Vat/Tax</span>
                <span class="font-semibold text-gray-700"
                  >Tk. {{ cartStore.vatAmount() | number: '1.2-2' }}</span
                >
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-400">Discount</span>
                <span class="font-semibold text-gray-700"
                  >Tk. {{ cartStore.totalDiscount() | number: '1.2-2' }}</span
                >
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-400">Adjustment</span>
                <span class="font-semibold text-gray-700">{{ cartStore.adjustment() }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 bg-[#10B981] text-white font-bold">
                <span>Total</span>
                <span>Tk. {{ cartStore.total() | number: '1.2-2' }}</span>
              </div>
            </div>
            <!-- Right: Payment status -->
            <div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-400">Taken</span>
                <span class="font-semibold text-gray-700"
                  >Tk. {{ (amountTaken() || 0) | number: '1.2-2' }}</span
                >
              </div>
              <div class="flex justify-between px-3 py-2 border-b border-gray-100">
                <span class="text-gray-400">Return</span>
                <span class="font-semibold text-gray-700"
                  >Tk. {{ amountReturn() | number: '1.2-2' }}</span
                >
              </div>
              <div
                class="flex justify-between px-3 py-2 border-b border-gray-100 bg-[#10B981] text-white font-bold"
              >
                <span>Paid</span>
                <span>Tk. {{ amountPaid() | number: '1.2-2' }}</span>
              </div>
              <div
                class="flex justify-between px-3 py-2 border-b border-gray-100 bg-[#FC686F] text-white font-bold"
              >
                <span>Due</span>
                <span>Tk. {{ amountDue() | number: '1.2-2' }}</span>
              </div>
              <div class="flex justify-between px-3 py-2 bg-gray-50">
                <span class="text-gray-400">Status</span>
                <span
                  class="text-[11px] font-extrabold uppercase mt-0.5"
                  [class.text-[#10B981]]="paymentStatus() === 'paid'"
                  [class.text-[#FC686F]]="paymentStatus() === 'due'"
                  [class.text-[#FBB018]]="paymentStatus() === 'partial'"
                >
                  {{ paymentStatus() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 px-5 py-4 border-t border-gray-100 bg-white">
          <button
            (click)="close.emit()"
            class="h-10 px-5 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            (click)="onPrintInvoice()"
            class="h-10 w-10 border border-gray-200 rounded-xl text-gray-500 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
          </button>
          <button
            (click)="saveOrder()"
            [disabled]="submitting || !!referenceError()"
            class="flex-1 h-10 bg-[#10B981] hover:bg-emerald-600 text-white text-[13px] font-extrabold
                         rounded-xl disabled:opacity-50 transition-colors"
          >
            {{ submitting ? 'Processing...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PaymentModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() orderSaved = new EventEmitter<CreateOrderResponse>();
  @Output() printInvoice = new EventEmitter<InvoiceData>();

  cartStore = inject(CartStore);
  orderService = inject(OrderService);
  uiStore = inject(UiStore);

  method = signal<'cash' | 'card' | 'mfs'>('cash');
  amountTaken = signal<number | null>(null);
  reference = signal<string>('');
  submitting = false;

  methods: { value: 'cash' | 'card' | 'mfs'; label: string; icon: string }[] = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Card', icon: '💳' },
    { value: 'mfs', label: 'MFS', icon: '📱' },
  ];

  amountReturn = computed(() => Math.max(0, (this.amountTaken() || 0) - this.cartStore.total()));
  amountPaid = computed(() => Math.min(this.amountTaken() || 0, this.cartStore.total()));
  amountDue = computed(() => Math.max(0, this.cartStore.total() - this.amountPaid()));
  paymentStatus = computed(() => {
    if (this.amountDue() <= 0) return 'paid';
    if (this.amountPaid() > 0) return 'partial';
    return 'due';
  });

  referenceLabel = computed(() =>
    this.method() === 'card' ? 'Card Reference' : 'MFS Phone Number',
  );

  referencePlaceholder = computed(() =>
    this.method() === 'card' ? 'Last 4 digits of card number' : 'e.g. 01712345678',
  );

  referenceError = computed(() => {
    const ref = this.reference().trim();
    if (!ref) return null;
    if (this.method() === 'mfs') {
      const bdPhone = /^(\+?880|0)1[3-9]\d{8}$/;
      if (!bdPhone.test(ref.replace(/\s/g, ''))) {
        return 'Enter a valid Bangladeshi phone number (e.g. 01712345678)';
      }
    }
    return null;
  });

  @HostListener('window:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  onBackdropMouseDown(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.preventEscape = true;
      this.close.emit();
    }
  }

  private preventEscape = false;

  onPrintInvoice() {
    this.printInvoice.emit(this.buildInvoiceData());
  }

  buildInvoiceData(orderResponse?: CreateOrderResponse): InvoiceData {
    const cart = this.cartStore;
    const customer = cart.selectedCustomer();

    return {
      orderNumber: orderResponse?.orderNumber || 'DRAFT',
      date: new Date().toLocaleString(),
      customerName: customer?.displayName || customer?.name || '',
      customerPhone: customer?.phone || '',
      items: cart.items().map((i) => ({
        name: i.medicineName,
        unit: i.unit,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountPct: i.discountPct,
        subtotal: i.subtotal,
      })),
      subtotal: cart.subtotal(),
      discount: cart.totalDiscount(),
      vat: cart.vatAmount(),
      adjustment: cart.adjustment(),
      total: cart.total(),
      paymentMethod: this.method(),
      paymentReference: this.reference(),
      amountPaid: this.amountPaid(),
      amountDue: this.amountDue(),
      paymentStatus: this.paymentStatus(),
    };
  }

  saveOrder() {
    if (this.referenceError()) {
      this.uiStore.showToast(this.referenceError()!, 'error');
      return;
    }
    if (this.amountDue() > 0) {
      this.uiStore.showConfirm('Order is not fully paid. Process as due order?', () =>
        this.processSave(),
      );
    } else {
      this.processSave();
    }
  }

  private processSave() {
    this.submitting = true;

    const paymentRef = this.method() !== 'cash' ? this.reference().trim() : undefined;

    const orderDto: CreateOrderDto = {
      customerId: this.cartStore.selectedCustomer()?.id,
      items: this.cartStore.items().map((i: any) => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
        unit: i.unit,
        discountPct: Number(i.discountPct) || 0,
      })),
      discountAmount: this.cartStore.cartDiscount(),
      adjustment: this.cartStore.adjustment(),
      payment: {
        method: this.method(),
        amountTaken: this.amountTaken() || 0,
        reference: paymentRef || undefined,
      },
      note: this.cartStore.note() || undefined,
    };

    this.orderService.createOrder(orderDto).subscribe({
      next: (res) => {
        this.submitting = false;
        this.uiStore.showToast('Order saved successfully', 'success');
        const invoiceData = this.buildInvoiceData(res);
        this.cartStore.reset();
        this.orderSaved.emit(res);
        this.printInvoice.emit(invoiceData);
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
