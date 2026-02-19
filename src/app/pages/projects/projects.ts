import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
})
export class Projects implements OnInit {
  projects: any[] = [];
  loading = false;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (res) => {
        this.projects = res ?? [];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load projects');
        this.loading = false;
      }
    });
  }

  addProject() {
    this.router.navigate(['/projects/add']);
  }

  editProject(id: number) {
    this.router.navigate(['/projects/add'], { queryParams: { id } });
  }

  deleteProject(id: number) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.toastr.success('Project deleted');
        this.loadProjects();
      },
      error: () => this.toastr.error('Delete failed')
    });
  }
}
