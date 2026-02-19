import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../services/team.services';
import { UsersService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { filter, take } from 'rxjs/operators';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-members.component.html'
})
export class TeamMembersComponent implements OnInit {

  teams: any[] = [];
  selectedTeamId!: number;

  companyUsers: any[] = [];
  teamMembers: any[] = [];
  availableUsers: any[] = [];

  maxMembers!: number;   // no default, always set from API
  canAddMore = true;

  loading = false;

  constructor(
    private teamService: TeamService,
    private usersService: UsersService,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit() {
  this.auth.currentUser$
    .pipe(
      filter(u => !!u),
      take(1)
    )
    .subscribe(() => {
      this.loadTeams();
      this.loadCompanyUsers();
    });
}


  loadTeams() {
    this.teamService.getAll().subscribe({
      next: res => {
        this.teams = res;
        // If a team is already selected, update maxMembers immediately
        if (this.selectedTeamId) {
          const team = this.teams.find(t => t.id === this.selectedTeamId);
          this.maxMembers = team?.maxMembers ?? 5;
        }
      },
      error: () => this.toastr.error('Failed to load teams')
    });
  }

  loadCompanyUsers() {
    this.usersService.getUsers().subscribe({
      next: res => this.companyUsers = res.data,
      error: () => this.toastr.error('Failed to load users')
    });
  }

  onTeamChange() {
    if (!this.selectedTeamId) return;

    const team = this.teams.find(t => t.id === this.selectedTeamId);
    this.maxMembers = team?.maxMembers ?? 5;

    this.loadTeamMembers();

    console.log('selectedTeamId (raw):', this.selectedTeamId, typeof this.selectedTeamId);
console.log('teams sample:', this.teams.slice(0,3));

  }

  loadTeamMembers() {
    this.loading = true;

    this.teamService.getTeamMembers(this.selectedTeamId).subscribe({
      next: members => {
        this.teamMembers = members; // backend response already has fullName, email, userTeamId

        const memberUserIds = members.map((m: any) => m.userId);
        this.availableUsers = this.companyUsers.filter(u => !memberUserIds.includes(u.id));

        this.canAddMore = this.teamMembers.length < this.maxMembers;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load team members');
        this.loading = false;
      }
    });

    console.log('selectedTeamId (raw):', this.selectedTeamId, typeof this.selectedTeamId);
console.log('teams sample:', this.teams.slice(0,3));

  }

  addUser(userId: number) {
    if (!this.canAddMore) {
      this.toastr.warning(`Team member limit (${this.maxMembers}) reached`);
      return;
    }

    this.teamService.addUser(this.selectedTeamId, userId).subscribe({
      next: () => {
        this.toastr.success('User added');
        this.loadTeamMembers();
      },
      error: err => this.toastr.error(err.error || 'Add failed')
    });
  }

  removeUser(userTeamId: number) {
    this.teamService.removeUser(userTeamId).subscribe({
      next: () => {
        this.toastr.success('User removed');
        this.loadTeamMembers();
      },
      error: () => this.toastr.error('Remove failed')
    });
  }
}
