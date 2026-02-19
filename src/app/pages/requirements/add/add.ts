import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequirementsService } from '../../../services/requirement.service';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth';
import { filter, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add.html'
})
export class AddRequirementComponent implements OnInit {
  projects: any[] = [];

  model = {
    module: '',
    menu: '',
    requirement: '',
    category: '',
    baseline: null as number | null,
    status: '',
    projectId: null as number | null
  };

  constructor(
    private reqService: RequirementsService,
    public projectService: ProjectService,
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.auth.currentUser$
      .pipe(filter(u => !!u), take(1))
      .subscribe(() => {
        this.projectService.getAll().subscribe({
          next: res => this.projects = res ?? [],
          error: () => this.toastr.error('Failed to load projects')
        });
      });
  }

  submit() {
    if (!this.model.projectId) {
      this.toastr.warning('Project is required');
      return;
    }

    this.model.baseline = this.model.baseline ?? 0;

    this.reqService.create(this.model).subscribe({
      next: () => {
        this.toastr.success('Requirement created successfully');
        this.router.navigate(['/requirements/view']);
      },
      error: () => this.toastr.error('Failed to create requirement')
    });
  }
}
