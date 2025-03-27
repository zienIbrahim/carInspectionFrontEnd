import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../api-client/services/authentication.service';
import { UserRoles } from '../data/UserRole';

export const authGuard: CanActivateFn = (route, state) => {
const  _authService = inject(AuthenticationService);
  
  const token = localStorage.getItem('token:jwt');
  if (!token || !_authService.getIsLoggedIn() || _authService.isTokenExpired()) {
    _authService.logout();
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];

  if (!_authService.checkUserInRoleInNav(requiredRoles)) {
    _authService.logout();
    return false;
  }
  return true;
};

