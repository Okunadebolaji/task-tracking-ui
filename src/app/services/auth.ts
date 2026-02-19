import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { PermissionService } from './permission.service';
import { Permission } from '../Models/permission.model';
import { environment } from '../../environments/environment';

export interface UserPermissions {
  canApprove: boolean;
  canReject: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasGlobalView: boolean;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  companyId: number;
  companyName: string;
  mustChangePassword: boolean;
  permissions: UserPermissions;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any = null;
 private baseUrl = `${environment.apiUrl}/api`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private permissions: Permission[] = [];
  private permissionsByRoute = new Map<string, any>();

  constructor(private http: HttpClient, private permissionService: PermissionService) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          if (res.requiresPasswordChange === true) {
            localStorage.setItem('pendingChangeUserId', res.userId?.toString() ?? '');
            return;
          }

          const user: User = {
            ...res.user,
            mustChangePassword: false,
            permissions: userPermissionsFallback()
          };

          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('roleId', user.roleId.toString());

          this.currentUserSubject.next(user);
this.setLoginData(res); // 🔥 THIS WAS MISSING

            console.debug('AuthService currentUser set', this.currentUser);
console.debug('AuthService permissions', this.permissions);
         console.log('AuthService permissionsByRoute', this.permissionsByRoute);
         console.log('AuthService response menus', res.menus);
         console.log('AuthService response permissions', res.permissions);
          if (res.permissions && Array.isArray(res.permissions)) {
            this.setPermissions(res.permissions);
          } else if (res.permissionKeys && Array.isArray(res.permissionKeys)) {
            const mapped = this.permissionService.mapPermissions(res.permissionKeys);
            this.setPermissions(mapped);
          }
        })

      );

  }

  setLoginData(response: any) {
    this.user = response.user;
    if (response.menus && Array.isArray(response.menus)) {
      response.menus.forEach((m: any) => {
        if (m.route && m.permissions) {
          this.permissionsByRoute.set(m.route, m.permissions);
        }
      });
    }
    if (response.permissions && Array.isArray(response.permissions)) {
      this.setPermissions(response.permissions);
    } else if (response.permissionKeys && Array.isArray(response.permissionKeys)) {
      this.setPermissions(this.permissionService.mapPermissions(response.permissionKeys));
    }
  }

  getPermissionsForRoute(route: string) {
    return this.permissionsByRoute.get(route);
  }

  hasViewPermission(route: string): boolean {
    return this.permissionsByRoute.get(route)?.canView === true;
  }

  getCurrentUserSafe(): User | null {
    const rawUser = localStorage.getItem('currentUser');
    if (!rawUser || rawUser === 'undefined') return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  getCompanyCodes(prefix: string, year: number) {
    return this.http.get<string[]>(`${this.baseUrl}/companies/codes?prefix=${prefix}&year=${year}`);
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.permissions = [];
    this.permissionsByRoute.clear();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setUser(user: User) {
   this.currentUserSubject.next(user);


    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  hasSuperAdmin(companyCode: string) {
    return this.http.get<boolean>(`${this.baseUrl}/auth/has-superadmin/${companyCode}`);
  }

  superAdminSignup(data: any) {
    return this.http.post(`${this.baseUrl}/auth/superadmin-signup`, data);
  }

  changePassword(data: { userId: number; oldPassword: string; newPassword: string; }) {
    return this.http.post(`${this.baseUrl}/Auth/change-password`, data);
  }

  updateMustChangePassword(value: boolean) {
    const user = this.currentUser;
    if (!user) return;
    user.mustChangePassword = value;
    localStorage.setItem('currentUser', JSON.stringify(user));
   this.currentUserSubject.next(user);


  }

  setPermissions(perms: Permission[]) {
    this.permissions = perms ?? [];
  }

  hasPermission(entity: string, action: string): boolean {
    if (!entity || !action) return false;
    const perm = this.permissions.find(p => p.name.toLowerCase() === entity.toLowerCase());
    return perm?.actions?.includes(action.toLowerCase()) ?? false;
  }
}

function userPermissionsFallback(): UserPermissions {
  return {
    canApprove: false,
    canReject: false,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    hasGlobalView: false
  };
}
