import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerDto } from '../../../core/models/customer.model';

@Component({
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl w-full max-w-[480px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-[15px] font-extrabold text-gray-800">Add customer</h2>
          <button (click)="close.emit()"
                  class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="submit()" class="px-5 py-4 space-y-4 overflow-y-auto">

          <!-- Customer type -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 mb-2">
              Customer type <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-5">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" formControlName="type" value="business"
                       class="w-4 h-4 accent-[#10B981]"/>
                <span class="text-[13px] font-medium text-gray-700">Business</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" formControlName="type" value="individual"
                       class="w-4 h-4 accent-[#10B981]"/>
                <span class="text-[13px] font-medium text-gray-700">Individual</span>
              </label>
            </div>
          </div>

          <!-- Customer name -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 mb-1">
              Customer name <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <select formControlName="prefix"
                      class="w-[76px] h-10 px-2 border-2 border-[#10B981] rounded-lg text-[13px]
                             text-gray-700 focus:outline-none bg-white font-medium">
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
              <input type="text" formControlName="name" placeholder="Enter customer name"
                     class="flex-1 h-10 px-3 border-2 border-gray-200 rounded-lg text-[13px]
                            focus:outline-none focus:border-[#10B981] transition-colors"
                     [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched"/>
            </div>
          </div>

          <!-- Display name -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 mb-1">
              Customer display name <span class="text-red-500">*</span>
            </label>
            <input type="text" formControlName="displayName" placeholder="Enter display name"
                   class="w-full h-10 px-3 border-2 border-gray-200 rounded-lg text-[13px]
                          focus:outline-none focus:border-[#10B981] transition-colors"
                   [class.border-red-400]="form.get('displayName')?.invalid && form.get('displayName')?.touched"/>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 mb-1">
              Phone <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <button type="button"
                      class="flex items-center gap-1 h-10 px-3 border-2 border-gray-200 rounded-lg
                             text-[13px] text-gray-700 min-w-[88px] bg-gray-50 font-medium">
                🇧🇩 +880 ▾
              </button>
              <input type="tel" formControlName="phone" placeholder="Enter phone number"
                     class="flex-1 h-10 px-3 border-2 border-gray-200 rounded-lg text-[13px]
                            focus:outline-none focus:border-[#10B981] transition-colors"
                     [class.border-red-400]="form.get('phone')?.invalid && form.get('phone')?.touched"/>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 mb-1">Email</label>
            <input type="email" formControlName="email" placeholder="Enter email address"
                   class="w-full h-10 px-3 border-2 border-gray-200 rounded-lg text-[13px]
                          focus:outline-none focus:border-[#10B981] transition-colors"
                   [class.border-red-400]="form.get('email')?.invalid && form.get('email')?.touched"/>
          </div>

          <!-- Billing address -->
          <div>
            <label class="block text-[13px] font-bold text-gray-700 mb-1">Billing address</label>
            <textarea formControlName="address" placeholder="E.g., Road no 1, Abc Building, Floor 2"
                      rows="3"
                      class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-[13px]
                             resize-none focus:outline-none focus:border-[#10B981] transition-colors"></textarea>
          </div>

          <!-- Footer buttons -->
          <div class="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" (click)="close.emit()"
                    class="flex-1 h-10 border-2 border-gray-200 rounded-xl text-[13px] font-bold
                           text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" [disabled]="form.invalid || submitting"
                    class="flex-1 h-10 bg-[#10B981] hover:bg-emerald-600 text-white text-[13px] font-extrabold
                           rounded-xl disabled:opacity-50 transition-colors">
              {{ submitting ? 'Adding...' : 'Add customer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddCustomerModalComponent {
  @Output() close          = new EventEmitter<void>();
  @Output() customerAdded  = new EventEmitter<CustomerDto>();

  private fb              = inject(FormBuilder);
  private customerService = inject(CustomerService);

  submitting = false;

  form = this.fb.group({
    type:        ['individual', Validators.required],
    prefix:      ['Mr.',        Validators.required],
    name:        ['',           [Validators.required, Validators.minLength(2)]],
    displayName: ['',            Validators.required],
    phone:       ['',           [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
    email:       ['',           [Validators.email]],
    address:     ['']
  });

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    const { prefix, name, ...rest } = this.form.value;

    this.customerService.addCustomer({ name: `${prefix} ${name}`, ...rest } as any).subscribe({
      next: (customer: CustomerDto) => {
        this.submitting = false;
        this.customerAdded.emit(customer);
      },
      error: () => { this.submitting = false; }
    });
  }
}
