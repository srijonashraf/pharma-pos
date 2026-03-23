import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { UiStore } from '../../store/ui.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const uiStore = inject(UiStore);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unknown error occurred';
      
      if (error.error instanceof ErrorEvent) {
        // Client side error
        errorMsg = error.error.message;
      } else {
        // Server side error
        errorMsg = error.error?.message || error.message || `Error Code: ${error.status}`;
      }

      uiStore.showToast(errorMsg, 'error');
      return throwError(() => new Error(errorMsg));
    })
  );
};
