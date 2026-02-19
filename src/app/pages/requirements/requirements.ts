import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../../services/requirement.service';
import { Requirement } from '../../Models/requirement.model';
import { CommonModule } from '@angular/common';
import { ProjectService} from '../../services/project.service';


@Component({
  selector: 'app-requirements',
  standalone: true,
  imports : [CommonModule],
  templateUrl: './requirements.html',
  styleUrls: ['./requirements.css']
})
export class RequirementsComponent implements OnInit {
  requirements: Requirement[] = [];
  projects: any[] = [];
  selectedProjectId: number | null = null;
  loading = true;

  constructor(
    private requirementsService: RequirementsService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // 1️⃣ Load projects first
    this.projectService.getAll().subscribe(projects => {
      this.projects = projects;

      // 2️⃣ Auto-select first project (optional but practical)
      if (projects.length > 0) {
        this.selectedProjectId = projects[0].id;
        this.loadRequirements();
      } else {
        this.loading = false;
      }
    });
  }

  loadRequirements() {
    if (!this.selectedProjectId) return;

    this.loading = true;

    this.requirementsService
      .getByProject(this.selectedProjectId)
      .subscribe({
        next: data => {
          this.requirements = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  onProjectChange(projectId: number) {
    this.selectedProjectId = projectId;
    this.loadRequirements();
  }
}
