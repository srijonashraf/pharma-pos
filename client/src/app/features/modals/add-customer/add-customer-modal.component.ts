import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerDto } from '../../../core/models/customer.model';

@Component({
//... (template remains same)
  selector: 'app-add-customer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-[480px] max-h-[90vh] flex flex-col shadow-xl">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-base font-semibold text-gray-800">Add customer</h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <!-- Form body -->
        <form [formGroup]="form" (ngSubmit)="submit()" class="p-4 space-y-4 overflow-y-auto">
          
          <!-- Customer type -->
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-2">
              Customer type <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" formControlName="type" value="business" class="w-4 h-4 text-emerald-500 focus:ring-emerald-500" />
                <span class="text-[13px] text-gray-700">Business</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" formControlName="type" value="individual" class="w-4 h-4 text-emerald-500 focus:ring-emerald-500" />
                <span class="text-[13px] text-gray-700">Individual</span>
              </label>
            </div>
          </div>

          <!-- Customer name -->
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-1">
              Customer name <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <select formControlName="prefix" class="w-20 h-10 px-2 border border-emerald-500 rounded-lg text-[13px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
              </select>
              <input type="text" formControlName="name" placeholder="Enter customer name"
                     class="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-400"
                     [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched" />
            </div>
          </div>

          <!-- Display name -->
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-1">
              Customer display name <span class="text-red-500">*</span>
            </label>
            <input type="text" formControlName="displayName" placeholder="Enter display name"
                   class="w-full h-10 px-3 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-400"
                   [class.border-red-400]="form.get('displayName')?.invalid && form.get('displayName')?.touched" />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-1">
              Phone <span class="text-red-500">*</span>
            </label>
            <div class="flex gap-2">
              <button type="button" class="flex items-center gap-1 h-10 px-3 border border-gray-200 rounded-lg text-[13px] text-gray-700 min-w-[90px] bg-gray-50">
                🇧🇩 +880 ▾
              </button>
              <input type="tel" formControlName="phone" placeholder="Enter phone number"
                     class="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-400"
                     [class.border-red-400]="form.get('phone')?.invalid && form.get('phone')?.touched" />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-1">Email</label>
            <input type="email" formControlName="email" placeholder="Enter email address"
                   class="w-full h-10 px-3 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-400"
                   [class.border-red-400]="form.get('email')?.invalid && form.get('email')?.touched" />
          </div>

          <!-- Billing address -->
          <div>
            <label class="block text-[13px] font-medium text-gray-700 mb-1">Billing address</label>
            <textarea formControlName="address" placeholder="E.g., Road no 1, Abc Building, Floor 2" rows="3"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] resize-none focus:outline-none focus:border-emerald-400"></textarea>
          </div>

          <!-- Footer buttons -->
          <div class="flex gap-3 pt-4 mt-2 border-t border-gray-200">
            <button type="button" (click)="close.emit()"
                    class="flex-1 h-10 border border-gray-300 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" [disabled]="form.invalid || submitting"
                    class="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-medium rounded-lg disabled:opacity-50 transition-colors">
              {{ submitting ? 'Adding...' : 'Add customer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddCustomerModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() customerAdded = new EventEmitter<CustomerDto>();

  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);

  submitting = false;

  form = this.fb.group({
    type: ['individual', Validators.required],
    prefix: ['Mr.', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2)]],
    displayName: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
    email: ['', [Validators.email]],
    address: ['']
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    const { prefix, name, ...rest } = this.form.value;
    const fullName = `${prefix} ${name}`;

    this.customerService.addCustomer({ name: fullName, ...rest } as any).subscribe({
      next: (customer: CustomerDto) => {
        this.submitting = false;
        this.customerAdded.emit(customer);
      },
      error: (err: unknown) => {
        this.submitting = false;
        // error handling via interceptors
      }
    });
  }
}
