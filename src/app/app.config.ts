import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // 1. Added helper
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // 2. Added token
import { UserHeadersInterceptor } from './Interceptors/user-headers.interceptors'; // 3. Point to your file

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 4. Update HttpClient to look for DI-based interceptors
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    // 5. Register your specific interceptor class
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserHeadersInterceptor,
      multi: true
    }
  ]
};
