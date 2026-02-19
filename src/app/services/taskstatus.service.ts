import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class TaskStatusService {
 private apiUrl = `${environment.apiUrl}/api/taskstatuses;`

  constructor(private http: HttpClient) {}

  getStatuses() {
    return this.http.get<{ id: number; name: string; isDefault: boolean }[]>(`${this.apiUrl}`);
  }
}
