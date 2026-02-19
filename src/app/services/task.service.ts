import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = `${environment.apiUrl}/api/tasks`;
  private dashboardUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getTasks(
    page = 1,
    pageSize = 20,
    projectId?: number,
    statusId?: number,
    teamId?: number
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (projectId) params = params.set('projectId', projectId);
    if (statusId) params = params.set('statusId', statusId);
    if (teamId) params = params.set('teamId', teamId);

    return this.http.get<any>(this.baseUrl, { params });
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getRejected() {
    return this.http.get<any[]>(`${this.baseUrl}/rejected`);
  }

  getPending() {
    return this.http.get<any[]>(`${this.dashboardUrl}/tasks/pending`);
  }

  getWip() {
    return this.http.get<any[]>(`${this.dashboardUrl}/tasks/wip`);
  }

  getCompleted() {
    return this.http.get<any[]>(`${this.dashboardUrl}/tasks/completed`);
  }

  getOverdue() {
    return this.http.get<any[]>(`${this.dashboardUrl}/tasks/overdue`);
  }

  createTask(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  approveTask(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/approve`, {});
  }

  rejectTask(id: number) {
    return this.http.put(`${this.baseUrl}/${id}/reject`, {});
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  assignTaskToTeam(taskId: number, teamId: number) {
    return this.http.post(`${this.baseUrl}/${taskId}/assign-team`, { teamId });
  }

  // getTaskById(taskId: number) {
  //   return this.http.get<any>(`${this.baseUrl}/${taskId}`);
  // }

  updateTask(task: any) {
    return this.http.put(`${this.baseUrl}/${task.id}`, task);
  }

  updateStatus(taskId: number, newStatusId: number) {
    return this.http.patch(`${this.baseUrl}/${taskId}/status`, {
      taskId,
      newStatusId
    });
  }

  getMyRecentTasks() {
  return this.http.get<any[]>(`${this.baseUrl}/my-recent`);
}
getTaskById(id: number) {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}


}
