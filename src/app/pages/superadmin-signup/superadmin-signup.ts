import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { TempPasswordService } from '../../services/temppassword.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-superadmin-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './superadmin-signup.html',
  styleUrls: ['./superadmin-signup.css']
})
export class SuperadminSignup implements OnInit {

  form!: any;
  loading = false;
  companyHasAdmin: boolean = false;
  generatedCode: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private tempPasswordService: TempPasswordService,
    private http: HttpClient // required for company code sequence check
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // Auto-generate company code whenever company name changes
    this.form.get('companyName')?.valueChanges.subscribe((name: string) => {
      if (!name) return;
      this.generateCompanyCode(name);
    });
  }

  // 🔹 Generate company code: first 3 letters + year + optional sequence if duplicates exist
  generateCompanyCode(name: string) {
    const prefix = name.trim().substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();

    // Call backend to get existing codes starting with this prefix + year
    this.http.get<string[]>(`http://localhost:5229/api/companies/codes?prefix=${prefix}&year=${year}`)
      .pipe(
        map(existing => existing || [])
      )
      .subscribe(existing => {
        let seq = 1;
        if (existing.length > 0) {
          seq = existing.length + 1;
        }

        this.generatedCode = seq > 1 ? `${prefix}-${year}-${seq.toString().padStart(3, '0')}` : `${prefix}-${year}`;
        this.form.get('companyCode')?.setValue(this.generatedCode);
      });
  }

  // Check if this company already has a super admin
  checkCompany() {
    const code = this.form.get('companyCode')?.value;
    if (!code) return;

    this.auth.hasSuperAdmin(code).subscribe((exists: boolean) => {
      this.companyHasAdmin = exists;
    });
  }

  // Submit super admin creation
  submit() {
    if (this.form.invalid || this.companyHasAdmin) return;

    this.loading = true;

    this.auth.superAdminSignup(this.form.value).subscribe({
      next: (res: any) => {
        this.tempPasswordService.setPassword(res.tempPassword);
        this.toastr.success('Super Admin created. You must change your password.');
        this.router.navigate(['/change-password', res.userId]);
      },
      error: err => {
        this.toastr.error(err.error || 'Failed to create Super Admin');
      },
      complete: () => this.loading = false
    });
  }
}
