import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../Models/permission.model';
import { Role } from '../Models/role.model';
import { RolePermission } from '../Models/role-permissions.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PermissionService {
 private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<Role[]>(`${this.baseUrl}/roles`);
  }

  getPermissions() {
    return this.http.get<Permission[]>(`${this.baseUrl}/permissions`);
  }

  getRolePermissions(roleId: number) {
    return this.http.get<RolePermission[]>(`${this.baseUrl}/role-permissions/${roleId}`);
  }

  saveRolePermissions(data: RolePermission[]) {
    return this.http.post(`${this.baseUrl}/role-permissions`, data);
  }

  mapPermissions(rawKeys: string[]): Permission[] {
    const grouped: { [entity: string]: string[] } = {};

    rawKeys.forEach(key => {
      if (!key || typeof key !== 'string') return;
      const parts = key.split('_');
      if (parts.length < 2) return;
      const entity = parts.slice(0, parts.length - 1).join('_');
      const action = parts[parts.length - 1];

      const entityName = entity.charAt(0) + entity.slice(1).toLowerCase();
      const actionName = action.toLowerCase();

      if (!grouped[entityName]) grouped[entityName] = [];
      if (!grouped[entityName].includes(actionName)) grouped[entityName].push(actionName);
    });

    return Object.entries(grouped).map(([name, actions], idx) => ({
      id: idx,
      name,
      actions
    }));
  }
}
