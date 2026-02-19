import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable()
export class UserHeadersInterceptor implements HttpInterceptor {

  private skipUrls = [
    '/auth/login',
    '/auth/superadmin-signup',
    '/auth/change-password'
  ];

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // Skip auth endpoints
    if (this.skipUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    const user = this.auth.getCurrentUserSafe();

    // If user not ready yet, pass request as-is
    if (!user) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        'x-user-id': String(user.id),
        'x-company-id': String(user.companyId),

      }

    });
 console.log('INTERCEPTED REQ HEADERS:', cloned.headers);
    return next.handle(cloned);
  }
}
