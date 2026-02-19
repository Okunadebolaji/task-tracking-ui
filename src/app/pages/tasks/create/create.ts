import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})
export class Create implements OnInit {

  tasks: any[] = [];
  projects: any[] = [];
  teams: any[] = [];
  requirements: any[] = [];

  page = 1;
  pageSize = 20;
  totalPages = 0;
  totalCount = 0;

  selectedProjectId?: number;
  selectedStatus?: string;
  selectedTeamId?: number;
  selectedStatusId?: number;
  statuses: { id: number; name: string }[] = [];

  canCreate = false;
  canApprove = false;
  canReject = false;
  canDelete = false;

  taskForm = {
    module: '',
    description: '',
    references: '',
    comment: '',
    startDate: '',
    endDate: '',
    status: 'Not completed',
    source: 'Manual',
    projectId: null as number | null,
    teamId: null as number | null,
    requirementIds: [] as number[]
  };

  constructor(
    private taskService: TaskService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUserSafe();
    if (!user) return;

    this.canCreate = true;
    this.canApprove = ['Admin', 'SuperAdmin'].includes(user.roleName);
    this.canReject = this.canApprove;
    this.canDelete = this.canApprove;

    this.loadTasks();
    this.loadProjects();
  }

  loadTasks(page: number = 1) {
    const user = this.authService.getCurrentUserSafe();
    if (!user) return;

    this.taskService.getTasks( page, this.pageSize, this.selectedProjectId, this.selectedStatusId, this.selectedTeamId)
      .subscribe(res => {
        this.tasks = res.data;
        this.page = res.page;
        this.pageSize = res.pageSize;
        this.totalPages = res.totalPages;
        this.totalCount = res.totalCount;
      });
  }

  createTask() {
    const user = this.authService.getCurrentUserSafe();
    if (!user) return;

    const payload = { ...this.taskForm, createdByUserId: user.id, companyId: user.companyId };

    this.taskService.createTask(payload).subscribe({
      next: () => {
        alert('Task created successfully');
        this.resetForm();
        this.loadTasks();
      },
      error: err => alert(err.error)
    });
  }

  approve(id: number) { this.taskService.approveTask(id).subscribe(() => this.loadTasks()); }
  reject(id: number) { this.taskService.rejectTask(id).subscribe(() => this.loadTasks()); }
  delete(id: number) {
    if (!confirm('Delete task?')) return;
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }

  loadProjects() {
    this.http.get<any[]>('http://localhost:5229/api/projects')
      .subscribe(res => this.projects = res);
  }

  onProjectChange(projectId: number) {
    this.taskForm.teamId = null;
    this.taskForm.requirementIds = [];

    this.http.get<any[]>(`http://localhost:5229/api/teams/by-project/${projectId}`)
      .subscribe(teams => this.teams = teams);

    this.http.get<any[]>(`http://localhost:5229/api/requirements/by-project/${projectId}`)
      .subscribe(reqs => this.requirements = reqs);
  }

  resetForm() {
    this.taskForm = {
      module: '',
      description: '',
      references: '',
      comment: '',
      startDate: '',
      endDate: '',
      status: 'Not completed',
      source: 'Manual',
      projectId: null,
      teamId: null,
      requirementIds: []
    };
    this.teams = [];
    this.requirements = [];
  }
}
