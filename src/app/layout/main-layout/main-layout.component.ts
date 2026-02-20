import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isSidebarOpen = false;
currentUrl: string = '';

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  showSidebar(): boolean {
  const hideRoutes = ['/login', '/superadmin-signup'];

  // hide sidebar on exact routes
  if (hideRoutes.includes(this.currentUrl)) {
    return false;
  }

  //  hide sidebar on change-password with ANY id
  if (this.currentUrl.startsWith('/change-password')) {
    return false;
  }

  return true;
}
}
