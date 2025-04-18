import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
   constructor() { }
   intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
      // Get the current selected application language
      let appLanguage =localStorage.getItem('lang');
      // localStorage.getItem('language');
         appLanguage = appLanguage === 'en' ? 'en-US' : 'ar-SA';
         request = request.clone({
            setHeaders: {
               'Content-Language': appLanguage,
               'Accept-Language': appLanguage
            }
         });
      // Handle the request and move into next interceptors if available
      return handler.handle(request);

   }
}
export const LanguageInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
];