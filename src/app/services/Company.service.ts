import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class CompanyService {
 private baseUrl = `${environment.apiUrl}/api/companies`;
  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<any>(`${this.baseUrl}/profile`);
  }

  updateProfile(name: string) {
    return this.http.put<any>(`${this.baseUrl}/profile`, { name });
  }
}
