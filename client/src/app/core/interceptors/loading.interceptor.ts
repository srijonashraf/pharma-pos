import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { UiStore } from '../../store/ui.store';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStore = inject(UiStore);
  
  // Don't show global loader for background polling if any
  if (!req.headers.has('X-Skip-Loading')) {
    uiStore.setLoading(true);
  }

  return next(req).pipe(
    finalize(() => {
      uiStore.setLoading(false);
    })
  );
};
