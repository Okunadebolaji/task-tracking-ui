import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequirementsService } from '../../../services/requirement.service';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth';
import { filter, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view.html'
})
export class ViewRequirementsComponent implements OnInit {
  projects: any[] = [];
  requirements: any[] = [];
  selectedProjectId?: number;

  loading = false;
  noData = false;

  // modal
  showEditModal = false;
  editingRequirement: any = null;

  constructor(
    private reqService: RequirementsService,
    public projectService: ProjectService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.auth.currentUser$
      .pipe(filter(u => !!u), take(1))
      .subscribe(u => {
        this.projectService.getAll().subscribe({
          next: res => this.projects = res ?? [],
          error: () => this.toastr.error('Failed to load projects')
        });
      });
  }

  loadRequirements() {
    if (!this.selectedProjectId) return;

    this.loading = true;
    this.noData = false;
    this.requirements = [];

    this.reqService.getByProject(this.selectedProjectId).subscribe({
      next: res => {
        this.requirements = res ?? [];
        this.noData = this.requirements.length === 0;
        this.loading = false;

        if (this.noData) {
          this.toastr.info('No requirements available for this project');
        }
      },
      error: () => {
        this.loading = false;
        this.noData = true;
        this.toastr.error('Failed to load requirements');
      }
    });
  }

  openEditModal(req: any) {
    this.editingRequirement = { ...req };
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
    this.editingRequirement = null;
  }

  saveEdit() {
    if (!this.editingRequirement) return;

    this.editingRequirement.baseline =
      Number(this.editingRequirement.baseline ?? 0);

    this.reqService
      .update(this.editingRequirement.id, this.editingRequirement)
      .subscribe({
        next: () => {
          const index = this.requirements.findIndex(
            r => r.id === this.editingRequirement.id
          );
          if (index > -1) {
            this.requirements[index] = { ...this.editingRequirement };
          }

          this.toastr.success('Requirement updated successfully');
          this.closeModal();
        },
        error: () => this.toastr.error('Failed to update requirement')
      });
  }

  confirmDelete(req: any) {
  const ok = confirm(
    `Are you sure you want to delete this requirement?\n\n${req.requirement}`
  );

  if (!ok) return;

  this.reqService.delete(req.id).subscribe({
    next: () => {
      this.requirements =
        this.requirements.filter(r => r.id !== req.id);

      this.toastr.success('Requirement deleted successfully');

      if (this.requirements.length === 0) {
        this.noData = true;
      }
    },
    error: () => this.toastr.error('Failed to delete requirement')
  });
}

}
