import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';
import { TeamService } from '../../services/team.services';
import { RequirementsService } from '../../services/requirement.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TaskStatusService } from '../../services/taskstatus.service';
import { filter, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  activeTab: 'view' | 'create' | 'pending' = 'view';
  tasks: any[] = [];
  projects: any[] = [];
  teams: any[] = [];
  requirements: any[] = [];
  teamUsers: any[] = [];

  page = 1;
  pageSize = 20;
  totalPages = 0;
  totalCount = 0;

  selectedProjectId?: number;
  statuses: { id: number; name: string }[] = [];
  selectedStatusId?: number;
  selectedTeamId?: number;

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
    statusId: undefined as number | undefined,
    source: 'Manual',
    projectId: null as number | null,
    teamId: null as number | null,
    requirementIds: [] as number[],
    assignedUserIds: [] as number[],
    userStory: ''
  };

  private companyId?: number;
  private currentUserId?: number;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private teamService: TeamService,
    private requirementsService: RequirementsService,
    private router: Router,
    private authService: AuthService,
    public taskStatusService: TaskStatusService,
     private toastr: ToastrService,
  ) {}

  ngOnInit() {
    // Wait for current user
    this.authService.currentUser$.pipe(filter(u => !!u), take(1)).subscribe(user => {
      this.companyId = user!.companyId;
      this.currentUserId = user!.id;

      // set role-based flags using auth.hasPermission where possible
      this.canCreate = this.authService.hasPermission('Tasks', 'create');
      this.canApprove = this.authService.hasPermission('Tasks', 'approve') || ['Admin', 'SuperAdmin'].includes(user!.roleName);
      this.canReject = this.authService.hasPermission('Tasks', 'reject') || this.canApprove;
      this.canDelete = this.authService.hasPermission('Tasks', 'delete') || this.canApprove;

      this.loadStatuses();
      this.loadProjects();
      this.loadTasks();
    });
  }

  loadTasks(page: number = 1) {
    this.taskService.getTasks(page, this.pageSize, this.selectedProjectId, this.selectedStatusId, this.selectedTeamId)
      .subscribe(res => {
        this.tasks = res.data ?? res;
        this.page = res.page ?? page;
        this.pageSize = res.pageSize ?? this.pageSize;
        this.totalPages = res.totalPages ?? 0;
        this.totalCount = res.totalCount ?? (this.tasks?.length ?? 0);
      });
  }

  createTask() {
    if (!this.currentUserId) return;

    const payload = { ...this.taskForm, createdByUserId: this.currentUserId };

    this.taskService.createTask(payload).subscribe({
      next: () => {
       this.toastr.success('Task created successfully');
        this.resetForm();
        this.loadTasks();
      },
        error: err => {
      this.toastr.error(err?.error ?? 'Failed to create task');
    }
    });
  }

  loadProjects() {
    this.projectService.getAll().subscribe(r => this.projects = r ?? []);
  }

  onProjectChange(projectId: number | null) {
    if (!projectId) return;

    this.taskForm.teamId = null;
    this.taskForm.requirementIds = [];

    this.teamService.getByProject(projectId).subscribe(teams => this.teams = teams ?? []);
    this.requirementsService.getByProject(projectId).subscribe(reqs => this.requirements = reqs ?? []);
  }

  resetForm() {
    this.taskForm = {
      module: '',
      description: '',
      references: '',
      comment: '',
      startDate: '',
      endDate: '',
      statusId: 0,
      source: 'Manual',
      projectId: null,
      teamId: null,
      requirementIds: [],
      assignedUserIds: [],
      userStory: ''
    };
    this.teams = [];
    this.requirements = [];
  }

  loadStatuses() {
    this.taskStatusService.getStatuses().subscribe(res => {
      this.statuses = res ?? [];
      const defaultStatus = res.find((s: any) => s.isDefault);
      if (defaultStatus) {
        this.taskForm.statusId = defaultStatus.id;
      }
    });
  }

  onTeamChange(teamId: number | null) {
    if (!teamId) return;
    this.teamService.getUsers(teamId).subscribe(users => this.teamUsers = users ?? []);
  }

  approve(id: number) { this.taskService.approveTask(id).subscribe(() => this.loadTasks()); }
  reject(id: number) { this.taskService.rejectTask(id).subscribe(() => this.loadTasks()); }
  delete(id: number) { if (!confirm('Delete task?')) return; this.taskService.deleteTask(id).subscribe(() => this.loadTasks()); }
}
