import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add.html'
})
export class Add {
  name = '';
  description = '';
  loading = false;
  projectId: number | null = null;
  private companyId?: number;

  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['id']) this.projectId = Number(params['id']);
    });
  }

  ngOnInit() {
    // get companyId from current user
    this.auth.currentUser$.pipe(filter(u => !!u), take(1)).subscribe(u => {
      this.companyId = u!.companyId;
      if (this.projectId) {
        this.loadProject(this.projectId);
      }
    });
  }

  loadProject(id: number) {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: res => {
        this.name = res.name;
        this.description = res.description;
        this.projectId = res.id;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load project');
        this.loading = false;
      }
    });
  }

  save() {
    if (!this.name.trim()) {
      this.toastr.warning('Project name is required');
      return;
    }

    this.loading = true;

    const payload = { name: this.name, description: this.description, companyId: this.companyId };

    const obs = this.projectId
      ? this.projectService.updateProject(this.projectId, payload)
      : this.projectService.addProject(payload);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(this.projectId ? 'Project updated' : 'Project created');
        this.router.navigate(['/projects']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to save project');
      }
    });
  }
}
