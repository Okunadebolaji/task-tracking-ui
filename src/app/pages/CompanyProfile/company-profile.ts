import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../services/Company.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css',
})
export class CompanyProfileComponent implements OnInit {

  company: any = {};
  loading = false;
  editing = false;
  newName = '';

  constructor(
    private companyService: CompanyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.companyService.getProfile().subscribe({
      next: (res) => {
        this.company = res;
        this.newName = res.name;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load company profile');
      }
    });
  }

  openEdit() {
    this.editing = true;
  }

  closeEdit() {
    this.editing = false;
    this.newName = this.company.name;
  }

  save() {
    if (!this.newName.trim()) {
      this.toastr.warning('Company name cannot be empty');
      return;
    }

    this.companyService.updateProfile(this.newName).subscribe({
      next: () => {
        this.company.name = this.newName;
        this.toastr.success('Company updated successfully');
        this.editing = false;
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Update failed');
      }
    });
  }
}
