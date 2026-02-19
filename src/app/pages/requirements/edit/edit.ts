import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequirementsService } from '../../../services/requirement.service'; 
import { ProjectService } from '../../../services/project.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit.html'
})
export class EditRequirementComponent implements OnInit {
  id!: number;
  form: {
    module: string;
    menu: string;
    requirement: string;
    category: string;
    baseline: number | null;
    status: string;
    projectId: number | null;
  } = {
    module: '',
    menu: '',
    requirement: '',
    category: '',
    baseline: null,
    status: '',
    projectId: null
  };

  projects: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reqService: RequirementsService,
    public projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.reqService.getById(this.id).subscribe({
      next: (res: any) => {
        this.form = {
          module: res.module,
          menu: res.menu,
          requirement: res.requirement,
          category: res.category,
          baseline: res.baseline,
          status: res.status,
          projectId: res.projectId
        };
      },
      error: err => console.error(err)
    });

    this.projectService.getAll().subscribe(res => {
      this.projects = res ?? [];
    });
  }

  save() {
    if (!this.form.projectId) {
      alert('Project is required');
      return;
    }

    this.form.baseline = Number(this.form.baseline ?? 0);

    this.reqService.update(this.id, this.form).subscribe(() => {
      alert('Updated');
      this.router.navigate(['/requirements/view']);
    });
  }
}
