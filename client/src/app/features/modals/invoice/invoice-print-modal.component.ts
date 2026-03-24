import { Component, EventEmitter, Output, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceData } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-print-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-2xl w-full max-w-[400px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-extrabold text-gray-800">Invoice Preview</h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Invoice Preview Content -->
        <div class="flex-1 overflow-y-auto p-5 bg-[#F5F6FA]">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">

            <!-- Shop Header -->
            <div class="text-center space-y-0.5">
              <p class="text-[15px] font-extrabold text-gray-800">Pharma POS</p>
              <p class="text-[11px] text-gray-400">Pharmacy &amp; Medicine Store</p>
            </div>

            <!-- Invoice Label -->
            <div class="text-center">
              <span class="inline-block text-[11px] font-bold text-gray-500 uppercase tracking-wider border border-gray-200 rounded-md px-3 py-0.5">
                {{ data.orderNumber === 'DRAFT' ? 'Draft Invoice' : 'Invoice' }}
              </span>
            </div>

            <!-- Order Details -->
            <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px] pb-3 border-b border-dashed border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-400">Order No</span>
                <span class="font-semibold text-gray-700">{{ data.orderNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Date</span>
                <span class="font-semibold text-gray-700">{{ data.date }}</span>
              </div>
              <div class="flex justify-between" *ngIf="data.customerName">
                <span class="text-gray-400">Customer</span>
                <span class="font-semibold text-gray-700 truncate">{{ data.customerName }}</span>
              </div>
              <div class="flex justify-between" *ngIf="data.customerPhone">
                <span class="text-gray-400">Phone</span>
                <span class="font-semibold text-gray-700">{{ data.customerPhone }}</span>
              </div>
              <div class="flex justify-between col-span-2">
                <span class="text-gray-400">Payment</span>
                <span class="font-semibold text-gray-700">{{ getMethodLabel() }}</span>
              </div>
              <div class="flex justify-between col-span-2" *ngIf="data.paymentReference">
                <span class="text-gray-400">Reference</span>
                <span class="font-semibold text-gray-700">{{ data.paymentReference }}</span>
              </div>
            </div>

            <!-- Items -->
            <table class="w-full text-[12px]">
              <thead>
                <tr class="border-b border-gray-200 text-gray-400 font-medium">
                  <th class="text-left py-1.5">Item</th>
                  <th class="text-center py-1.5">Qty</th>
                  <th class="text-right py-1.5">Price</th>
                  <th class="text-right py-1.5">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of data.items" class="border-b border-gray-100">
                  <td class="py-1.5 text-gray-700 font-medium">{{ item.name }}</td>
                  <td class="py-1.5 text-center text-gray-600">{{ item.quantity }} {{ item.unit }}</td>
                  <td class="py-1.5 text-right text-gray-600">{{ item.unitPrice | number:'1.2-2' }}</td>
                  <td class="py-1.5 text-right font-semibold text-gray-700">{{ item.subtotal | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Totals -->
            <div class="space-y-1 text-[12px] pt-2 border-t border-dashed border-gray-200">
              <div class="flex justify-between">
                <span class="text-gray-400">Subtotal</span>
                <span class="font-semibold text-gray-700">Tk. {{ data.subtotal | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between" *ngIf="data.discount > 0">
                <span class="text-gray-400">Discount</span>
                <span class="font-semibold text-gray-700">- Tk. {{ data.discount | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">VAT/Tax</span>
                <span class="font-semibold text-gray-700">Tk. {{ data.vat | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between" *ngIf="data.adjustment !== 0">
                <span class="text-gray-400">Adjustment</span>
                <span class="font-semibold text-gray-700">{{ data.adjustment | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between pt-1.5 border-t border-gray-200">
                <span class="text-[13px] font-extrabold text-gray-800">Total</span>
                <span class="text-[13px] font-extrabold text-[#10B981]">Tk. {{ data.total | number:'1.2-2' }}</span>
              </div>
            </div>

            <!-- Payment Summary -->
            <div class="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden text-[11px]">
              <div class="border-r border-gray-200">
                <div class="flex justify-between px-2.5 py-1.5 border-b border-gray-100">
                  <span class="text-gray-400">Paid</span>
                  <span class="font-bold text-gray-700">Tk. {{ data.amountPaid | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between px-2.5 py-1.5">
                  <span class="text-gray-400">Method</span>
                  <span class="font-bold text-gray-700">{{ getMethodLabel() }}</span>
                </div>
              </div>
              <div>
                <div class="flex justify-between px-2.5 py-1.5 border-b border-gray-100"
                     [class.bg-emerald-50]="data.paymentStatus === 'paid'"
                     [class.bg-red-50]="data.paymentStatus === 'due'"
                     [class.bg-amber-50]="data.paymentStatus === 'partial'">
                  <span class="text-gray-400">Status</span>
                  <span class="text-[10px] font-extrabold uppercase"
                        [class.text-[#10B981]]="data.paymentStatus === 'paid'"
                        [class.text-[#FC686F]]="data.paymentStatus === 'due'"
                        [class.text-[#FBB018]]="data.paymentStatus === 'partial'">
                    {{ data.paymentStatus }}
                  </span>
                </div>
                <div class="flex justify-between px-2.5 py-1.5">
                  <span class="text-gray-400">Due</span>
                  <span class="font-bold"
                        [class.text-gray-700]="data.amountDue === 0"
                        [class.text-[#FC686F]]="data.amountDue > 0">
                    Tk. {{ data.amountDue | number:'1.2-2' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="text-center text-[10px] text-gray-300 pt-2">
              Thank you for your purchase
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="flex gap-3 px-5 py-4 border-t border-gray-100 bg-white">
          <button (click)="close.emit()"
                  class="h-10 px-5 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Close
          </button>
          <button (click)="print()"
                  class="flex-1 h-10 bg-[#10B981] hover:bg-emerald-600 text-white text-[13px] font-extrabold rounded-xl transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  `
})
export class InvoicePrintModalComponent {
  @Input({ required: true }) data!: InvoiceData;
  @Output() close = new EventEmitter<void>();

  @HostListener('window:keydown.escape')
  onEscape() {
    this.close.emit();
  }

  getMethodLabel(): string {
    const labels: Record<string, string> = {
      cash: 'Cash',
      card: 'Card',
      mfs: 'MFS',
    };
    return labels[this.data.paymentMethod] || this.data.paymentMethod;
  }

  private buildHtml(): string {
    const d = this.data;
    const css = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; padding: 12px; }
      .inv { width: 320px; margin: 0 auto; }
      .hdr { text-align: center; margin-bottom: 12px; }
      .hdr h1 { font-size: 16px; font-weight: 800; color: #111827; margin: 0; }
      .hdr p { font-size: 11px; color: #9ca3af; margin: 2px 0 0; }
      .badge { text-align: center; margin-bottom: 12px; }
      .badge span { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #e5e7eb; border-radius: 4px; padding: 2px 10px; }
      .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; font-size: 11px; padding-bottom: 10px; border-bottom: 1px dashed #e5e7eb; margin-bottom: 10px; }
      .meta-row { display: flex; justify-content: space-between; }
      .meta-label { color: #9ca3af; }
      .meta-value { font-weight: 600; color: #374151; }
      .meta-full { grid-column: 1 / -1; }
      table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 10px; }
      th { text-align: left; color: #9ca3af; font-weight: 500; padding: 4px 0; border-bottom: 1px solid #e5e7eb; }
      th.r { text-align: right; }
      th.c { text-align: center; }
      td { padding: 4px 0; border-bottom: 1px solid #f3f4f6; color: #374151; }
      td.r { text-align: right; }
      td.c { text-align: center; }
      td.b { font-weight: 600; }
      .totals { font-size: 11px; padding-top: 8px; border-top: 1px dashed #e5e7eb; margin-bottom: 10px; }
      .total-row { display: flex; justify-content: space-between; padding: 2px 0; }
      .total-label { color: #9ca3af; }
      .total-value { font-weight: 600; color: #374151; }
      .total-final { border-top: 1px solid #e5e7eb; margin-top: 4px; padding-top: 6px; }
      .total-final .total-label { font-size: 13px; font-weight: 800; color: #111827; }
      .total-final .total-value { font-size: 13px; font-weight: 800; color: #10B981; }
      .disc { color: #374151; }
      .pay-grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden; font-size: 10px; margin-bottom: 12px; }
      .pay-cell { display: flex; justify-content: space-between; padding: 5px 8px; }
      .pay-left { border-right: 1px solid #e5e7eb; }
      .pay-cell + .pay-cell { border-top: 1px solid #f3f4f6; }
      .pay-label { color: #9ca3af; }
      .pay-value { font-weight: 700; color: #374151; }
      .st-paid { color: #10B981 !important; }
      .st-due { color: #FC686F !important; }
      .st-partial { color: #FBB018 !important; }
      .due-red { color: #FC686F !important; }
      .footer { text-align: center; font-size: 9px; color: #d1d5db; }
      @media print { body { padding: 0; } .inv { width: 100%; max-width: 320px; } }
      @page { margin: 8mm; }
    `;

    const statusClass = d.paymentStatus === 'paid' ? 'st-paid' : d.paymentStatus === 'due' ? 'st-due' : 'st-partial';

    const itemRows = d.items.map(i =>
      `<tr>
        <td>${this.esc(i.name)}</td>
        <td class="c">${i.quantity} ${this.esc(i.unit)}</td>
        <td class="r">${Number(i.unitPrice || 0).toFixed(2)}</td>
        <td class="r b">${Number(i.subtotal || 0).toFixed(2)}</td>
      </tr>`
    ).join('');

    const discountRow = d.discount > 0
      ? `<div class="total-row"><span class="total-label">Discount</span><span class="total-value disc">- Tk. ${Number(d.discount || 0).toFixed(2)}</span></div>`
      : '';

    const adjustmentRow = d.adjustment !== 0
      ? `<div class="total-row"><span class="total-label">Adjustment</span><span class="total-value">${Number(d.adjustment || 0).toFixed(2)}</span></div>`
      : '';

    const customerRow = d.customerName
      ? `<div class="meta-row"><span class="meta-label">Customer</span><span class="meta-value">${this.esc(d.customerName)}</span></div>`
      : '';

    const phoneRow = d.customerPhone
      ? `<div class="meta-row"><span class="meta-label">Phone</span><span class="meta-value">${this.esc(d.customerPhone)}</span></div>`
      : '';

    const referenceRow = d.paymentReference
      ? `<div class="meta-row meta-full"><span class="meta-label">Reference</span><span class="meta-value">${this.esc(d.paymentReference)}</span></div>`
      : '';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice ${d.orderNumber}</title>
<style>${css}</style>
</head>
<body>
<div class="inv">
  <div class="hdr">
    <h1>Pharma POS</h1>
    <p>Pharmacy &amp; Medicine Store</p>
  </div>
  <div class="badge"><span>${d.orderNumber === 'DRAFT' ? 'Draft Invoice' : 'Invoice'}</span></div>
  <div class="meta">
    <div class="meta-row"><span class="meta-label">Order No</span><span class="meta-value">${this.esc(d.orderNumber)}</span></div>
    <div class="meta-row"><span class="meta-label">Date</span><span class="meta-value">${this.esc(d.date)}</span></div>
    ${customerRow}${phoneRow}
    <div class="meta-row meta-full"><span class="meta-label">Payment</span><span class="meta-value">${this.getMethodLabel()}</span></div>
    ${referenceRow}
  </div>
  <table>
    <thead><tr><th>Item</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead>
    <tbody>${itemRows}</tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span class="total-label">Subtotal</span><span class="total-value">Tk. ${Number(d.subtotal || 0).toFixed(2)}</span></div>
    ${discountRow}
    <div class="total-row"><span class="total-label">VAT/Tax</span><span class="total-value">Tk. ${Number(d.vat || 0).toFixed(2)}</span></div>
    ${adjustmentRow}
    <div class="total-row total-final"><span class="total-label">Total</span><span class="total-value">Tk. ${Number(d.total || 0).toFixed(2)}</span></div>
  </div>
  <div class="pay-grid">
    <div class="pay-cell pay-left"><span class="pay-label">Paid</span><span class="pay-value">Tk. ${Number(d.amountPaid || 0).toFixed(2)}</span></div>
    <div class="pay-cell"><span class="pay-label">Status</span><span class="pay-value ${statusClass}">${d.paymentStatus.toUpperCase()}</span></div>
    <div class="pay-cell pay-left"><span class="pay-label">Method</span><span class="pay-value">${this.getMethodLabel()}</span></div>
    <div class="pay-cell"><span class="pay-label">Due</span><span class="pay-value${d.amountDue > 0 ? ' due-red' : ''}">Tk. ${Number(d.amountDue || 0).toFixed(2)}</span></div>
  </div>
  <div class="footer">Thank you for your purchase</div>
</div>
</body>
</html>`;
  }

  print(): void {
    const html = this.buildHtml();

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '-10000px';
    iframe.style.bottom = '-10000px';
    iframe.style.width = '100px';
    iframe.style.height = '100px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      // Use standard DOM parsing to skip deprecated doc.write() warnings
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');
      
      doc.head.innerHTML = newDoc.head.innerHTML;
      doc.body.innerHTML = newDoc.body.innerHTML;
      
      // Print synchronously to preserve browser click-event trust
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }

    // Cleanup iframe after printing dialog is handled
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 5000);
  }

  private esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
