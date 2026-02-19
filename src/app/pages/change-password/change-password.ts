import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { TempPasswordService } from '../../services/temppassword.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent implements OnInit {

  userId!: number;
  oldPassword = '';
  newPassword = '';

  // optional: show info if temp password is provided
  tempPasswordInfo = '';
  tempPasswordHint = '';



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private tempPasswordService: TempPasswordService
  ){}

 ngOnInit() { this.route.paramMap.subscribe
  (params => { const id = params.get('id') ?? localStorage.getItem('pendingChangeUserId');
  if (!id) { this.toastr.error('Invalid user ID'); return; } this.userId = Number(id);

    const temp = this.tempPasswordService.getPassword();
    if (temp) {
      this.oldPassword = temp;
      this.tempPasswordInfo = `Use this temporary password: ${temp}`;
      this.toastr.info(this.tempPasswordInfo);

      // clear it so it’s not reused
      this.tempPasswordService.clear();
    }
  });
}
  submit() {
    if (!this.newPassword) {
      this.toastr.warning('Please enter a new password');
      return;
    }

    this.authService.changePassword({
      userId: this.userId,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe({
     next: () => {
  this.toastr.success('Password changed successfully');

  // update local user state
  this.authService.updateMustChangePassword(false);

  this.router.navigate(['/login']);
},
      error: (err:any) => {
        this.toastr.error(err.error?.message || 'Password change failed');
      }
    });
  }
}
