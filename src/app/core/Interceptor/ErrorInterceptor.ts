import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { GeneralAlertService } from "../Service/general-alert.service";




export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const alert = inject(GeneralAlertService);
        if(error){
            switch (error.status) {
                case 400:
                    // Handle bad request error
                    alert.show('Bad request - 400', 'Error');
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
