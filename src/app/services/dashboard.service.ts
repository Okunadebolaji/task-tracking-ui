import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardCounters } from '../Models/dashboard-counter.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 private baseUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getCounters(): Observable<DashboardCounters> {
    return this.http.get<DashboardCounters>(`${this.baseUrl}/counters`);
  }
}
