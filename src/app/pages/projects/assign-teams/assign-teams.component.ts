import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { TeamService } from '../../../services/team.services'; 
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth'; 
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-assign-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-teams.component.html'
})
export class AssignTeamsComponent implements OnInit {
  projects: any[] = [];
  allTeams: any[] = [];
  projectTeams: any[] = [];

  maxMembers = 5;
  selectedProjectId: number | null = null;
  selectedTeamId: number | null = null;

  private companyId?: number;

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // wait for current user so we can scope projects/teams by company if needed
    this.auth.currentUser$.pipe(filter(u => !!u), take(1)).subscribe(u => {
      this.companyId = u!.companyId;
      this.loadProjects();
      this.loadAllTeams();
    });
  }

  loadProjects() {
    this.projectService.getAll().subscribe({
      next: res => this.projects = res ?? [],
      error: () => this.toastr.error('Failed to load projects')
    });
  }

  loadAllTeams() {
    // teamService.getAll returns company teams; interceptor provides headers
    this.teamService.getAll().subscribe({
      next: res => this.allTeams = res ?? [],
      error: () => this.toastr.error('Failed to load teams')
    });
  }

  onProjectChange(projectId: number) {
    this.selectedProjectId = projectId;
    this.selectedTeamId = null;

    // local filter for teams already loaded
    this.projectTeams = this.allTeams.filter(t => t.projectId === projectId);
  }

  loadProjectTeams() {
    if (!this.selectedProjectId) return;
    this.teamService.getByProject(this.selectedProjectId)
      .subscribe({
        next: res => this.projectTeams = res ?? [],
        error: () => this.toastr.error('Failed to load project teams')
      });
  }

  assignTeamToProject() {
    if (!this.selectedProjectId || !this.selectedTeamId) return;

    // teamService.assignProject(teamId, projectId)
    this.teamService.assignProject(this.selectedTeamId, this.selectedProjectId).subscribe({
      next: () => {
        this.toastr.success('Team assigned to project');
        this.loadProjectTeams();
      },
      error: () => this.toastr.error('Failed to assign team')
    });
  }
}
