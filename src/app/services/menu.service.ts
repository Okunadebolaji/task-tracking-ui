import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../Models/menu.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MenuService {
  public menus: Menu[] = [];
private baseUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  loadMenusByRole() {
    return this.http.get<Menu[]>(`${this.baseUrl}/menus/by-role`);
  }
}
