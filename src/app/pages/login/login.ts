import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private menuService: MenuService
  ) {}

  login(form: any) {
  this.loading = true;

  this.authService.login(this.email, this.password).subscribe({
    next: (res: any) => {

      // 🔐 ALWAYS handle password change FIRST
   // LoginComponent (inside login success handler)
if (res.requiresPasswordChange === true) {
  this.toastr.info('You must change your password first');
  // use the top-level userId the backend returns
  this.router.navigate(['/change-password', res.userId]);
  return;
}

      // ✅ normal login flow
      this.authService.setLoginData(res);
      this.menuService.loadMenusByRole().subscribe(); // Preload menus
      this.loading = false;

      this.router.navigate(['/dashboard']);
    },

    error: (err: any) => {
      this.loading = false;
      this.toastr.error(err.error || 'Login failed');
    }
  });
}

}
