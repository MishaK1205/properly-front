import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL } from '../api/api.config';
import { AuthService } from '../services/auth.service';

/** Attaches the admin JWT to backend requests and logs out on 401 responses. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const isApiRequest = req.url.startsWith(API_BASE_URL);
  const isLoginRequest = req.url.endsWith('/auth/login');

  const request =
    isApiRequest && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApiRequest &&
        !isLoginRequest
      ) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
