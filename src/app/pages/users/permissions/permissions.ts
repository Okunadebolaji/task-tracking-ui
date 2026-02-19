import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './permissions.html'
})
export class Permissions implements OnInit {

  roles: any[] = [];
  selectedRoleId: number | null = null;
  permissions: any[] = [];

  constructor(
    private usersService: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.usersService.loadRoles();
    this.roles = this.usersService.roles;
  }

  onRoleChange() {
    if (!this.selectedRoleId) {
      this.permissions = [];
      return;
    }

    this.usersService
      .getPermissionsByRole(this.selectedRoleId)
      .subscribe({
        next: res => this.permissions = res,
        error: () => this.toastr.error('Failed to load permissions')
      });
  }

  savePermissions() {
    if (!this.selectedRoleId) return;

    const payload = this.permissions.map(p => ({
      permissionId: p.id,
      isAllowed: p.isAllowed
    }));

    this.usersService
      .updateRolePermissions(this.selectedRoleId, payload)
      .subscribe({
        next: () => this.toastr.success('Permissions updated'),
        error: () => this.toastr.error('Failed to save permissions')
      });
  }
}
