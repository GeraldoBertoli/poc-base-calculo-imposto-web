import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from './toast.service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    toast.show(error.error?.message || `Erro ${error.status}: ${error.statusText || 'falha na API'}`);
    return throwError(() => error);
  }));
};
