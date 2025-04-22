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
import { LanguageInterceptorProviders } from './core/Interceptor/LanguageInterceptor';
import { LoadingInterceptorProviders } from './core/Interceptor/LoadingInterceptor';
import { definePreset } from '@primeng/themes';

const Noir = definePreset(Aura, {
  semantic: {
      primary: {
          50: '{red.50}',
          100: '{red.100}',
          200: '{red.200}',
          300: '{red.300}',
          400: '{red.400}',
          500: '{red.500}',
          600: '{red.600}',
          700: '{red.700}',
          800: '{red.800}',
          900: '{red.900}',
          950: '{red.950}'
      },
      colorScheme: {
          light: {
              primary: {
                  color: '{red.950}',
                  inverseColor: '#ffffff',
                  hoverColor: '{red.900}',
                  activeColor: '{red.800}'
              },
              highlight: {
                  background: '{red.950}',
                  focusBackground: '{red.700}',
                  color: '#ffffff',
                  focusColor: '#ffffff'
              }
          },
          dark: {
              primary: {
                  color: '{zinc.50}',
                  inverseColor: '{zinc.950}',
                  hoverColor: '{zinc.100}',
                  activeColor: '{zinc.200}'
              },
              highlight: {
                  background: 'rgba(250, 250, 250, .16)',
                  focusBackground: 'rgba(250, 250, 250, .24)',
                  color: 'rgba(255,255,255,.87)',
                  focusColor: 'rgba(255,255,255,.87)'
              }
          }
      }
  }
});
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),withInterceptorsFromDi()),
    Error401InterceptorProviders, 
    LanguageInterceptorProviders,
    LoadingInterceptorProviders,
    importProvidersFrom([
      TranslateModule.forRoot(provideTranslation())
    ]),
     provideRouter(routes),
     provideAnimationsAsync(),
     providePrimeNG({
      theme: {
        preset: Noir,
      },
    })]
};


