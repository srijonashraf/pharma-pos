import { Component, EventEmitter, Output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { OrderListItem, OrderDetail, PaymentDetail } from '../../../core/models/order.model';

@Component({
  selector: 'app-recent-list-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div class="bg-white rounded-2xl w-full max-w-[520px] shadow-2xl flex flex-col overflow-hidden max-h-[85vh]"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center gap-2">
            <button *ngIf="selectedOrder()"
                    (click)="selectedOrder.set(null)"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2 class="text-[15px] font-extrabold text-gray-800">
              {{ selectedOrder() ? 'Order Details' : 'Recent Orders' }}
              <span *ngIf="!selectedOrder()" class="text-[13px] font-semibold text-gray-400 ml-1">({{ orders().length }})</span>
            </h2>
          </div>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="py-12 flex justify-center">
          <svg class="animate-spin w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>

        <!-- Order List View -->
        <div *ngIf="!loading() && !selectedOrder()" class="flex-1 overflow-y-auto">

          <div *ngIf="orders().length === 0"
               class="py-12 text-center text-gray-300">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-[13px]">No orders today</p>
          </div>

          <div *ngFor="let order of orders()"
               (click)="loadOrderDetail(order)"
               class="px-5 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[13px] font-bold text-gray-800">{{ order.orderNumber }}</span>
                  <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        [class]="getStatusClass(order.status)">
                    {{ order.status | uppercase }}
                  </span>
                </div>
                <div class="text-[12px] text-gray-500">
                  {{ formatTime(order.createdAt) }}
                  · Tk. {{ order.totalAmount | number:'1.2-2' }}
                  <span *ngIf="order.customer" class="ml-1">· {{ order.customer.displayName || order.customer.name }}</span>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="text-[14px] font-extrabold text-gray-800">Tk. {{ order.totalAmount | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Detail View -->
        <div *ngIf="!loading() && selectedOrder()" class="flex-1 overflow-y-auto">

          <!-- Order summary -->
          <div class="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[13px] font-bold text-gray-800">{{ selectedOrder()!.order.orderNumber }}</span>
              <span class="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                    [class]="getStatusClass(selectedOrder()!.order.status)">
                {{ selectedOrder()!.order.status | uppercase }}
              </span>
            </div>
            <div class="text-[12px] text-gray-500 mb-3">
              {{ formatDateTime(selectedOrder()!.order.createdAt) }}
              <span *ngIf="selectedOrder()!.order.customer"> · {{ selectedOrder()!.order.customer!.displayName || selectedOrder()!.order.customer!.name }}</span>
            </div>

            <!-- Summary grid -->
            <div class="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden text-[12px] bg-white">
              <div class="border-r border-gray-200">
                <div class="flex justify-between px-3 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">Subtotal</span>
                  <span class="font-semibold text-gray-700">Tk. {{ selectedOrder()!.order.subtotal | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between px-3 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">VAT</span>
                  <span class="font-semibold text-gray-700">Tk. {{ selectedOrder()!.order.vatAmount | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between px-3 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">Discount</span>
                  <span class="font-semibold text-gray-700">Tk. {{ selectedOrder()!.order.discountAmount | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between px-3 py-1.5 bg-[#10B981] text-white font-bold">
                  <span>Total</span>
                  <span>Tk. {{ selectedOrder()!.order.totalAmount | number:'1.2-2' }}</span>
                </div>
              </div>
              <div *ngIf="selectedOrder()!.payments.length > 0">
                <div class="flex justify-between px-3 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">Paid</span>
                  <span class="font-semibold text-gray-700">Tk. {{ selectedOrder()!.payments[0].amountPaid | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between px-3 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">Method</span>
                  <span class="font-semibold text-gray-700">{{ formatMethod(selectedOrder()!.payments[0].method) }}</span>
                </div>
                <div class="flex justify-between px-3 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">Due</span>
                  <span class="font-semibold text-gray-700">Tk. {{ selectedOrder()!.payments[0].amountDue | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between px-3 py-1.5 bg-gray-50">
                  <span class="text-gray-400">Status</span>
                  <span class="font-bold"
                        [class]="getPaymentStatusClass(selectedOrder()!.payments[0].status)">
                    {{ selectedOrder()!.payments[0].status | uppercase }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="px-5 py-3">
            <p class="text-[12px] font-bold text-gray-500 uppercase mb-2">Items ({{ selectedOrder()!.items.length }})</p>
            <table class="w-full text-[12px]">
              <thead>
                <tr class="text-gray-400 border-b border-gray-100">
                  <th class="text-left py-1.5 font-medium">Name</th>
                  <th class="text-center py-1.5 font-medium">Qty</th>
                  <th class="text-right py-1.5 font-medium">Price</th>
                  <th class="text-right py-1.5 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of selectedOrder()!.items" class="border-b border-gray-50">
                  <td class="py-2 text-gray-800">
                    <div class="font-semibold">{{ item.medicineName }}</div>
                    <div class="text-[10px] text-gray-400">{{ item.unit }} · {{ item.discountPct }}% disc</div>
                  </td>
                  <td class="py-2 text-center text-gray-600">{{ item.quantity }}</td>
                  <td class="py-2 text-right text-gray-600">{{ item.unitPrice | number:'1.2-2' }}</td>
                  <td class="py-2 text-right font-semibold text-gray-800">{{ item.subtotal | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Payments -->
          <div *ngIf="selectedOrder()!.payments.length > 1" class="px-5 py-3 border-t border-gray-100">
            <p class="text-[12px] font-bold text-gray-500 uppercase mb-2">Payment History ({{ selectedOrder()!.payments.length }})</p>
            <table class="w-full text-[12px]">
              <thead>
                <tr class="text-gray-400 border-b border-gray-100">
                  <th class="text-left py-1.5 font-medium">Method</th>
                  <th class="text-right py-1.5 font-medium">Paid</th>
                  <th class="text-right py-1.5 font-medium">Due</th>
                  <th class="text-center py-1.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of selectedOrder()!.payments" class="border-b border-gray-50">
                  <td class="py-2 text-gray-800">{{ formatMethod(p.method) }}</td>
                  <td class="py-2 text-right text-gray-600">{{ p.amountPaid | number:'1.2-2' }}</td>
                  <td class="py-2 text-right text-gray-600">{{ p.amountDue | number:'1.2-2' }}</td>
                  <td class="py-2 text-center">
                    <span class="font-bold" [class]="getPaymentStatusClass(p.status)">{{ p.status | uppercase }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: contents; }`]
})
export class RecentListModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  private orderService = inject(OrderService);

  orders = signal<OrderListItem[]>([]);
  selectedOrder = signal<OrderDetail | null>(null);
  loading = signal(true);
  today = new Date().toISOString().slice(0, 10);

  ngOnInit() {
    this.fetchOrders();
  }

  private fetchOrders() {
    this.loading.set(true);
    this.orderService.getOrders(this.today).subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.orders.set([]);
        this.loading.set(false);
      }
    });
  }

  loadOrderDetail(order: OrderListItem) {
    this.loading.set(true);
    this.orderService.getOrderById(order.id).subscribe({
      next: (detail) => {
        this.selectedOrder.set(detail);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'due': return 'bg-red-100 text-red-600';
      case 'partial': return 'bg-amber-100 text-amber-700';
      case 'draft': return 'bg-gray-100 text-gray-500';
      case 'returned': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'text-[#10B981]';
      case 'due': return 'text-[#FC686F]';
      case 'partial': return 'text-[#FBB018]';
      default: return 'text-gray-500';
    }
  }

  formatMethod(method: string): string {
    switch (method) {
      case 'cash': return 'Cash';
      case 'bank_card': return 'Bank/Card';
      case 'mfs': return 'MFS';
      default: return method;
    }
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  formatDateTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: true,
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
