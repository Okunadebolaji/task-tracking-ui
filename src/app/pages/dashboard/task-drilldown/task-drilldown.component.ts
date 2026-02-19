import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-drilldown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-drilldown.component.html'
})
export class TaskDrilldownComponent implements OnInit {

  tasks: any[] = [];
  type!: string;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type')!;
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;

    let request$;

    switch (this.type) {
      case 'pending':
        request$ = this.taskService.getPending();
        break;

      case 'completed':
        request$ = this.taskService.getCompleted();
        break;

      case 'rejected':
        request$ = this.taskService.getRejected();
        break;

      default:
        request$ = this.taskService.getAll();
        break;
    }

request$.subscribe({
  next: res => {
    this.tasks = res ?? [];
    this.loading = false;
  },
  error: () => {
    this.toastr.error('Failed to load tasks');
    this.loading = false;
  }
});



  }
}
