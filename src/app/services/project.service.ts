import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getProject(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addProject(dto: { name: string; description?: string }) {
    return this.http.post<any>(this.baseUrl, dto);
  }

  updateProject(id: number, dto: { name: string; description?: string }) {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  deleteProject(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
