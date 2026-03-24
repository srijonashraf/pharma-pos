import { Injectable, signal } from '@angular/core';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmState {
  message: string;
  action: () => void;
}

@Injectable({ providedIn: 'root' })
export class UiStore {
  toast = signal<Toast | null>(null);
  loading = signal(false);
  confirm = signal<ConfirmState | null>(null);
  private _timer?: any;

  showToast(message: string, type: Toast['type'] = 'info') {
    if (this._timer) clearTimeout(this._timer);
    this.toast.set({ message, type });
    this._timer = setTimeout(() => this.toast.set(null), 3000);
  }

  setLoading(value: boolean) {
    this.loading.set(value);
  }

  showConfirm(message: string, action: () => void) {
    this.confirm.set({ message, action });
  }

  resolveConfirm(confirmed: boolean) {
    const state = this.confirm();
    if (confirmed && state) state.action();
    this.confirm.set(null);
  }
}
