import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CookieModule, CookieService } from 'ngx-cookie';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    CookieService,
    { 
      provide: 'COOKIES_OPTIONS',
      useValue: {
        path: '/',
        secure: true,
        sameSite: 'strict'
      }
    }
  ]
};