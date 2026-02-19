import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html'
})
export class Users implements OnInit {
  users: User[] = [];
  permissions = {
    canView: false,
    canCreate: false,
    canEdit: false,
    canDelete: false
  };

  addUserModalVisible = false;
  selectedUser: Partial<User> = {};
  isEditing = false;

  constructor(
    public usersService: UsersService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.usersService.loadRoles();
  }

  loadUsers() {
  this.usersService.getUsers().subscribe({
    next: res => {
      this.permissions = {
        canView: res.permissions?.canView ?? false,
        canCreate: res.permissions?.canCreate ?? false,
        canEdit: res.permissions?.canEdit ?? false,
        canDelete: res.permissions?.canDelete ?? false
      };
      this.users = res.data ?? [];
    },
    error: err => {
      console.error('Cannot load users:', err);
    }
  });
}


  // ================= ADD / EDIT USER =================
  openAddUser() {
    if (!this.permissions.canCreate) return;
    this.isEditing = false;
    this.selectedUser = {};
    this.addUserModalVisible = true;
  }

  openEditUser(user: User) {
    if (!this.permissions.canEdit) return;
    this.isEditing = true;
    this.selectedUser = { ...user };
    this.addUserModalVisible = true;
  }

  saveUser() {
  const { firstName, lastName, email, roleId } = this.selectedUser;

  if (!firstName || !lastName || !email || !roleId) {
    this.toastr.error('All fields are required');
    return;
  }

  if (this.isEditing) {
    // ======== UPDATE USER ========
    this.usersService.updateUser(this.selectedUser).subscribe({
      next: () => {
        this.toastr.success('User updated');
        this.loadUsers();
        this.closeModal();
      },
      error: (err: any) => this.toastr.error(err.error || 'Failed to update user')
    });
  } else {
    // ======== CREATE USER ========
    const payload = {
      ...this.selectedUser,
      fullName: `${firstName} ${lastName}` // add FullName for backend validation
    };

    this.usersService.createUser(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(`User created. Temporary password: ${res.temporaryPassword}`);

        const role = this.usersService.roles.find(r => r.id === roleId) ?? { id: 0, name: 'Unknown' };

        const newUser: User = {
          id: res.id,
          email,
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          role,
          roleId: role.id,
          companyId: JSON.parse(localStorage.getItem('user')!).companyId,
          companyName: '', // optional
          isActive: true
        };

        this.users.push(newUser);
        this.closeModal();
      },
      error: (err: any) => this.toastr.error(err.error || 'Failed to create user')
    });
  }
}

  closeModal() {
    this.addUserModalVisible = false;
    this.selectedUser = {};
    this.isEditing = false;
  }

  // ================= DELETE USER =================
  deleteUser(id: number) {
    // if (!this.permissions.canDelete) return;

    if (!confirm('Are you sure you want to delete this user?')) return;

    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.toastr.success('User deleted');
        this.users = this.users.filter(u => u.id !== id);
      },
      error: () => this.toastr.error('Failed to delete user')
    });
  }
}
