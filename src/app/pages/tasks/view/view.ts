import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { TaskStatusService } from '../../../services/taskstatus.service';
import { TeamService } from '../../../services/team.services';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view.html'
})
export class View implements OnInit {

  tasks: any[] = [];
  projects: any[] = [];
  teams: any[] = [];
  teamUsers: any[] = [];
  statuses: any[] = [];

  selectedProjectId?: number;
  selectedStatusId?: number;

  showModal = false;
  loading = false;

  editForm: any = {};

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private statusService: TaskStatusService,
    private teamService: TeamService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.projectService.getAll().subscribe(r => this.projects = r ?? []);
    this.statusService.getStatuses().subscribe(r => this.statuses = r ?? []);
  }

  loadTasks() {
    this.taskService
      .getTasks(1, 10, this.selectedProjectId, this.selectedStatusId)
      .subscribe(res => {
        this.tasks = res?.data ?? res ?? [];
      });
  }

  /* ================= EDIT MODAL ================= */

  openEditModal(taskId: number) {
    this.taskService.getTaskById(taskId).subscribe(task => {
      this.editForm = {
        id: task.id,
        projectId: task.project?.id ?? null,
        teamId: task.team?.id ?? null,
        statusId: task.status?.id ?? null,
        description: task.description ?? '',
        userStory: task.userStory ?? '',
        assignedUserIds: task.assignedUsers?.map((u: any) => u.id) ?? []
      };

      if (this.editForm.projectId) {
        this.onProjectChange(this.editForm.projectId);
      }

      if (this.editForm.teamId) {
        this.onTeamChange(this.editForm.teamId);
      }
       console.log('OPEN MODAL CLICKED', task);
      this.showModal = true;
    });
  }

  closeModal() {
    this.showModal = false;
    this.editForm = {};
    this.teamUsers = [];
    this.teams = [];
  }

  onProjectChange(projectId: number) {
    if (!projectId) return;

    this.teamService
      .getByProject(projectId)
      .subscribe(r => this.teams = r ?? []);
  }

  onTeamChange(teamId: number) {
    if (!teamId) return;

    this.teamService
      .getUsers(teamId)
      .subscribe(r => this.teamUsers = r ?? []);
  }

  saveEdit() {
    if (!this.editForm?.id) return;

    this.loading = true;

    this.taskService.updateTask(this.editForm).subscribe({
      next: () => {
        this.toastr.success('Task updated successfully');
        this.loading = false;
        this.closeModal();
        this.loadTasks();
      },
      error: err => {
        this.loading = false;
        this.toastr.error(err?.error ?? 'Update failed');
      }
    });
  }

  /* ================= DELETE ================= */

  delete(id: number) {
    if (!confirm('Delete task?')) return;

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.toastr.success('Task deleted');
        this.loadTasks();
      },
      error: err => {
        this.toastr.error(err?.error ?? 'Delete failed');
      }
    });
  }

  statusClass(status: any) {
    switch (status?.name) {
      case 'Pending': return 'bg-secondary';
      case 'In Progress': return 'bg-info text-dark';
      case 'Completed': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-light text-dark';
    }
  }
}
