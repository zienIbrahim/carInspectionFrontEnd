import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthenticationService } from "../api-client/services/authentication.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthenticationService).getAuthToken;
  return next(authToken?req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
   }
  }):req);

}