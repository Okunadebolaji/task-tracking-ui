import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';

import { App } from './app/app';
import { UserHeadersInterceptor } from './app/Interceptors/user-headers.interceptors';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideAnimations(),

   importProvidersFrom(HttpClientModule), // register your interceptor globally
   { provide: HTTP_INTERCEPTORS, useClass: UserHeadersInterceptor, multi: true },
    provideRouter(routes),
    provideHttpClient(),
    provideToastr({      // sets up toastr globally
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      newestOnTop: true
    })
  ]
}).catch(err => console.error(err));
