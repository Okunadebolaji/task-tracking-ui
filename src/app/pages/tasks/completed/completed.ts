import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { UsersService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { TaskStatusService } from '../../../services/taskstatus.service';

@Component({
  selector: 'app-completed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './completed.html',
  styleUrls: ['./completed.css'],
})
export class Completed implements OnInit {
  tasks: any[] = [];
  page = 1;
  pageSize = 20;
  totalPages = 0;
  totalCount = 0;

  selectedProjectId?: number;

selectedStatusId?: number;

statuses: { id: number; name: string }[] = [];

  selectedTeamId?: number;

  constructor(
    private taskService: TaskService,
    public usersService: UsersService,
    private router: Router,
    private authService: AuthService,
    public taskStatusService: TaskStatusService
  ) {}

  ngOnInit() {
  this.taskStatusService.getStatuses().subscribe(s => {
    const completed = s.find(x => x.name === 'Completed');
    this.selectedStatusId = completed?.id;
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

}
