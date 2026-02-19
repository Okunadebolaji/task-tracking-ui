import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TaskService } from '../../../services/task.service';
import { TaskStatusService } from '../../../services/taskstatus.service';
import { ProjectService } from '../../../services/project.service';
import { TeamService } from '../../../services/team.services';
import { RequirementsService } from '../../../services/requirement.service';

@Component({
  selector: 'app-edit-task-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-status.component.html'
})
export class EditStatusComponent implements OnInit {
  taskForm: any = {
    id: null,
    module: '',
    description: '',
    references: '',
    comment: '',
    startDate: '',
    endDate: '',
    statusId: null,
    source: 'Manual',
    projectId: null,
    teamId: null,
    requirementIds: [] as number[],
    assignedUserIds: [] as number[]
  };

  projects: any[] = [];
  teams: any[] = [];
  requirements: any[] = [];
  teamUsers: any[] = [];
  statuses: any[] = [];

  loading = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private taskService: TaskService,
    private statusService: TaskStatusService,
    private projectService: ProjectService,
    private teamService: TeamService,
    private requirementsService: RequirementsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

if (!idParam || isNaN(+idParam)) {
  this.toastr.error('Invalid task id');
  this.router.navigate(['/tasks/view']);
  return;
}

const taskId = Number(idParam);

    this.loading = true;

    /* Load dropdown data */
    this.projectService.getAll().subscribe({
      next: res => (this.projects = res ?? []),
      error: () => (this.projects = [])
    });

    this.statusService.getStatuses().subscribe({
      next: res => (this.statuses = res ?? []),
      error: () => (this.statuses = [])
    });

    /* Load task */
    this.taskService.getTaskById(taskId).subscribe({
      next: task => {
        if (!task) {
          this.toastr.error('Task not found');
          this.router.navigate(['/tasks/view']);
          return;
        }

        this.taskForm = {
          id: task.id,
          module: task.module ?? '',
          description: task.description ?? '',
          references: task.references ?? '',
          comment: task.comment ?? '',
          startDate: task.startDate ?? '',
          endDate: task.endDate ?? '',
          source: task.source ?? 'Manual',

          statusId: task.status?.id ?? null,
          projectId: task.project?.id ?? null,
          teamId: task.team?.id ?? null,

          requirementIds:
            task.requirements?.map((r: any) => r.requirementId) ?? [],

          assignedUserIds:
            task.assignedUsers?.map((u: any) => u.id) ?? []
        };

        if (this.taskForm.projectId) {
          this.onProjectChange(this.taskForm.projectId);
        }

        if (this.taskForm.teamId) {
          this.onTeamChange(this.taskForm.teamId);
        }

        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.toastr.error(err?.error ?? 'Failed to load task');
        this.router.navigate(['/tasks/view']);
      }
    });
  }

  onProjectChange(projectId: number): void {
    if (!projectId) return;

    this.teamService.getByProject(projectId).subscribe({
      next: res => (this.teams = res ?? []),
      error: () => (this.teams = [])
    });

    this.requirementsService.getByProject(projectId).subscribe({
      next: res => (this.requirements = res ?? []),
      error: () => (this.requirements = [])
    });
  }

  onTeamChange(teamId: number): void {
    if (!teamId) return;

    this.teamService.getUsers(teamId).subscribe({
      next: res => (this.teamUsers = res ?? []),
      error: () => (this.teamUsers = [])
    });
  }

  save(): void {
    if (!this.taskForm.id) {
      this.toastr.error('Invalid task');
      return;
    }

    this.loading = true;

    this.taskService.updateTask(this.taskForm).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Task updated successfully');
        this.router.navigate(['/tasks/view']);
      },
      error: err => {
        this.loading = false;
        this.toastr.error(err?.error ?? 'Failed to update task');
      }
    });
  }
}
