import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
// Import environment
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TeamService {
  // Use environment variables
  private baseUrl = `${environment.apiUrl}/api/teams`;
  private userTeamsBase = `${environment.apiUrl}/api/user-teams`;
  public teamListChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  create(dto: { name: string; maxMembers: number }) {
    return this.http.post<any>(this.baseUrl, dto).pipe(tap(() => this.teamListChanged.next()));
  }

  delete(teamId: number) {
    if (teamId == null) {
      throw new Error('teamId is required');
    }
    return this.http.delete(`${this.baseUrl}/${teamId}`).pipe(tap(() => this.teamListChanged.next()));
  }

  getTeamMembers(teamId: number) {
    return this.http.get<any[]>(`${this.userTeamsBase}/by-team/${teamId}`);
  }

  addUser(teamId: number, userId: number) {
    return this.http.post(this.userTeamsBase, { TeamId: teamId, UserId: userId }).pipe(tap(() => this.teamListChanged.next()));
  }

  removeUser(userTeamId: number) {
    return this.http.delete(`${this.userTeamsBase}/${userTeamId}`).pipe(tap(() => this.teamListChanged.next()));
  }

  getByProject(projectId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/by-project/${projectId}`);
  }

  getTeamsByProject(projectId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/by-project/${projectId}`);
  }

  getUsers(teamId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${teamId}/members`);
  }

  assignProject(teamId: number, projectId: number) {
    return this.http.put(`${this.baseUrl}/${teamId}/assign-project`, { projectId }).pipe(tap(() => this.teamListChanged.next()));
  }

  getAllCompanyTeams() {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  assignTeamsToProject(projectId: number, teamIds: number[]) {
    return this.http.post(`${this.baseUrl}/assign-to-project`, { projectId, teamIds }).pipe(tap(() => this.teamListChanged.next()));
  }

  update(team: { id: number; name: string; projectId: number | null; maxMembers: number; isActive?: boolean; }) {
    return this.http.put(`${this.baseUrl}/${team.id}`, team).pipe(tap(() => this.teamListChanged.next()));
  }
}
