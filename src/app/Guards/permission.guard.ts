import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Read required entity/action from route data
    const entity = route.data['entity'] as string;
    const action = route.data['action'] as string;

    // Check permission using AuthService
    if (this.auth.hasPermission(entity, action)) {
      return true;
    }

    // If not allowed, redirect to unauthorized page (or login)
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
