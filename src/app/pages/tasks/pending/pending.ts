import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { TaskStatusService } from '../../../services/taskstatus.service';
@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pending.html'
})
export class Pending implements OnInit {

  tasks: any[] = [];
  page = 1;
  pageSize = 20;
  totalPages = 0;
  totalCount = 0;

  selectedProjectId?: number;
 selectedStatusId?: number;


statuses: { id: number; name: string }[] = [];

  selectedTeamId?: number;

  constructor(private taskService: TaskService, private authService: AuthService, public taskStatusService: TaskStatusService) {}

  ngOnInit() {
  this.taskStatusService.getStatuses().subscribe(s => {
    const pending = s.find(x => x.name === 'Pending');
    this.selectedStatusId = pending?.id;
    this.loadTasks();
  });
}


  loadTasks(page = 1) {
  const user = this.authService.getCurrentUserSafe();
  if (!user) return;

  this.taskService.getTasks(
    page,
    this.pageSize,
    this.selectedProjectId,
    this.selectedStatusId,   // from status dropdown
    this.selectedTeamId
  ).subscribe(res => {
    this.tasks = res.data;
    this.page = res.page;
    this.totalPages = res.totalPages;
    this.totalCount = res.totalCount;
  });
}


  approve(id: number) { this.taskService.approveTask(id).subscribe(() => this.loadTasks()); }
  reject(id: number) { this.taskService.rejectTask(id).subscribe(() => this.loadTasks()); }
}
