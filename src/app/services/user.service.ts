import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user.model';
// Import environment
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  public roles: { id: number; name: string }[] = [];
  // Use environment variable
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  private getcurrentUser(): any | null {
    const rawUser = localStorage.getItem('currentUser');
    if (!rawUser || rawUser === 'undefined') return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users`);
  }

  loadRoles(): void {
    this.http.get<{ id: number; name: string }[]>(`${this.baseUrl}/roles`).subscribe(
      res => {
        this.roles = res ?? [];
      },
      () => { this.roles = []; }
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  getPermissionsByRole(roleId: number) {
    return this.http.get<any>(`${this.baseUrl}/roles/${roleId}/permissions`);
  }

  updateRolePermissions(roleId: number, permissions: any[]) {
    return this.http.put(`${this.baseUrl}/roles/${roleId}/permissions`, permissions);
  }

  getCompanyUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/by-company`);
  }
}
