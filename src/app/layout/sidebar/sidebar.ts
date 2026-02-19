import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth';
import { Menu } from '../../Models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {

  menus: Menu[] = [];

  constructor(
    private menuService: MenuService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  this.menuService.loadMenusByRole().subscribe({
    next: menus => {
      this.menus = menus;
      console.log('SIDEBAR MENUS:', menus);
    },
    error: err => {
      console.error('MENU LOAD ERROR:', err);
    }
  });
}


  toggle(menu: Menu) {
    menu.expanded = !menu.expanded;
  }

   logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
