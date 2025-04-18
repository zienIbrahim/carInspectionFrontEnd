import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthenticationService } from "../api-client/services/authentication.service";
import { GeneralAlertService } from "../Service/general-alert.service";

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
        private alert :GeneralAlertService,
        public http: HttpClient
    ) { }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        return handler.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error){
                    switch (error.status) {
                        case 401: 
                            return this.handle401Errors(error, request, handler);
                        case 400:
                            console.log(error)
                            // Handle bad request error
                            this.alert.show('Bad request - 400', error.error.ErrorMessage);
                            break;
                        case 404:
                            // Handle not found error
                            console.error('Not found - 404');
                            break;
                        case 500:
                            // Handle internal server error
                            console.error('Internal server error - 500');
                            break;
                        default:
                            // Handle other errors
                            console.error('An error occurred:', error.message);
                    }
                }
                return throwError(()=> error);
            })
        );
    }
    handle401Errors(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.RefreshToken().pipe(
                switchMap((user: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(user.accsesToken);
                    return next.handle(this.addTokenHeader(request, user.accsesToken));
                }),
                catchError((err) => {
                    this.isRefreshing = false;
                    this.authService.logout();
                    return throwError(() => err);
                })
            );
        }
        else {
            return this.refreshTokenSubject.pipe(
                filter(accsesToken => accsesToken != null),
                take(1),
                switchMap(accsesToken => {
                    return next.handle(this.addTokenHeader(request, accsesToken));
                })
            );
        }
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