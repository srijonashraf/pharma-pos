import { Injectable, signal } from '@angular/core';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class UiStore {
  toast = signal<Toast | null>(null);
  loading = signal(false);
  private _timer?: any;

  showToast(message: string, type: Toast['type'] = 'info') {
    if (this._timer) clearTimeout(this._timer);
    this.toast.set({ message, type });
    this._timer = setTimeout(() => this.toast.set(null), 3000);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }
}
