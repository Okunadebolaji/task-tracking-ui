import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { TaskService } from '../../services/task.service';
import { UsersService } from '../../services/user.service';
import { TaskModalComponent } from './task-modal/task-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TaskModalComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  userName = '';
  roleName = '';
  companyName = '';

  counters = {
    pending: 0,
    wip: 0,
    completed: 0,
    overdue: 0
  };

  recentTasks: any[] = [];

  loadingCounters = false;
  loadingTasks = false;
  loadingRecent = false;

  showModal = false;
  modalTitle = '';
  modalTasks: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.fetchCounters();
    this.fetchRecentTasks();
  }

  private loadUserInfo() {
    const user = (this.usersService as any).getcurrentUser?.();

    if (!user) return;

    this.userName = user.fullName || user.username || 'User';
    this.companyName = user.companyName ?? '';
    this.roleName = user.role?.name ?? '';
  }

  fetchCounters() {
    this.loadingCounters = true;
    this.dashboardService.getCounters().subscribe({
      next: res => {
        this.counters = res;
        this.loadingCounters = false;
      },
      error: () => this.loadingCounters = false
    });
  }

  fetchRecentTasks() {
    this.loadingRecent = true;
this.taskService.getMyRecentTasks().subscribe({
  next: res => {
    this.recentTasks = res ?? [];
    this.loadingRecent = false;
  },
  error: () => {
    this.recentTasks = [];
    this.loadingRecent = false;
  }
});

  }

  openTasks(type: string) {
    this.showModal = true;
    this.loadingTasks = true;
    this.modalTitle = type.toUpperCase() + ' TASKS';

    let request$;

    switch (type) {
      case 'pending': request$ = this.taskService.getPending(); break;
      case 'wip': request$ = this.taskService.getWip(); break;
      case 'completed': request$ = this.taskService.getCompleted(); break;
      case 'overdue': request$ = this.taskService.getOverdue(); break;
      default: request$ = this.taskService.getAll();
    }

    request$.subscribe({
      next: tasks => {
        this.modalTasks = tasks ?? [];
        this.loadingTasks = false;
      },
      error: () => {
        this.modalTasks = [];
        this.loadingTasks = false;
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.modalTasks = [];
  }
}
