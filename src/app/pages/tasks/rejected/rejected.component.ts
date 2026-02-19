import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-rejected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rejected.component.html'
})
export class Rejected implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService, private auth: AuthService) {}

  ngOnInit() {
    this.loadRejected();
  }

  loadRejected() {
    const user = this.auth.getCurrentUserSafe();
    if (!user) return;
    this.taskService.getRejected().subscribe(res => this.tasks = res);
  }
}
