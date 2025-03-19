import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthenticationService } from "../api-client/services/authentication.service";

/**
 * Intercepts and handles API errors / error related HTTP status codes
 *
 * @export
 * @class ErrorInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class Error401Interceptor implements HttpInterceptor {
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor(
        private router: Router,
        private authService: AuthenticationService,
        public http: HttpClient
    ) {}

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error instanceof HttpErrorResponse && error.status === 401) {
              
                    return this.handle401Errors(error, request, handler);
                }
                return throwError(error);
            })
        );
    }

    handle401Errors(error: HttpErrorResponse, request: HttpRequest<any>, handler: HttpHandler) {
        if (error.status == 401) {
            const refreshToken: string  = localStorage.getItem('token:refreshToken');
            const accessToken: string  = localStorage.getItem('token:jwt');
            if (refreshToken == null || !accessToken == null) {
                this.authService.logout().then(() => this.router.navigate(['auth/login']));
            }
                const tokenModel = { refreshToken: refreshToken,token:accessToken };
                console.log({tokenModel})
                if(!this.isRefreshing){
                    this.isRefreshing = true;
                    return this.authService.RefreshToken(tokenModel).pipe(
                    switchMap((res: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(res.token);
                    //set tokens in localstorge
                    localStorage.setItem('token:jwt', res.token);
                    localStorage.setItem('token:refreshToken', res.refreshToken);
                    return handler.handle(this.addTokenHeader(request, res.accsesToken));
                        }),
                        catchError((err) => {
                            this.isRefreshing = false;
                            this.authService.logout().then(() => this.router.navigate(['auth/login']));
                            return throwError(err);
                        })
                    );
                }
                else 
                {
                    return this.refreshTokenSubject.pipe(
                      filter((token) => token != null),
                      take(1),
                      switchMap((jwt) => {
                        return handler.handle(this.addTokenHeader(request, jwt));
                      })
                    );
                }
        }
        return throwError(error);
    }
    
    private addTokenHeader(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
    }
}
export const Error401InterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: Error401Interceptor, multi: true },
];