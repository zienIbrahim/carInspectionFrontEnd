import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/Interceptor/authInterceptor';
import { provideTranslation } from './core/Helper/translate.helper';
import { Error401InterceptorProviders } from './core/Interceptor/Error401Interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),withInterceptorsFromDi()),
    Error401InterceptorProviders, 
    importProvidersFrom([
      TranslateModule.forRoot(provideTranslation())
    ]),
     provideRouter(routes),
     provideAnimationsAsync(),
     providePrimeNG({
      theme: {
        preset: Aura,
      },
    })]
};


