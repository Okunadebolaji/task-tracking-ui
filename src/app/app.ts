import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-tracking-ui');

  currentUrl: string = '';

  constructor(private router: Router, private auth: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
  }




   ngOnInit() {
    this.auth.currentUser$.subscribe(user => {

      if (!user) return;

      if (user.mustChangePassword === true &&
          !this.router.url.startsWith('/change-password')) {

        this.router.navigate(['/change-password', user.id]);
      }
    });
  }
}
