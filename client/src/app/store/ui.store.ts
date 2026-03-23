import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class UiStore {
  isLoading = signal<boolean>(false);
  toasts = signal<ToastMessage[]>([]);
  private toastId = 0;

  setLoading(state: boolean) {
    this.isLoading.set(state);
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    const id = ++this.toastId;
    this.toasts.update(t => [...t, { id, message, type }]);
    
    // Auto dismiss after 3s as per spec
    setTimeout(() => {
      this.toasts.update(t => t.filter(toast => toast.id !== id));
    }, 3000);
  }
}
