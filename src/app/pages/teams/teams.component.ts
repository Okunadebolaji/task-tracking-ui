import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, Subscription } from 'rxjs';
import { TeamService } from '../../services/team.services';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html'
})
export class TeamsComponent implements OnInit, OnDestroy {
  teams: any[] = [];
  loading = false;
  private teamListSub: Subscription | null = null;

  constructor(
    private teamService: TeamService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTeamsWithCounts();
    // subscribe to service events so the list refreshes automatically
    this.teamListSub = this.teamService.teamListChanged.subscribe(() => {
      this.loadTeamsWithCounts();
    });
  }

  ngOnDestroy() {
    this.teamListSub?.unsubscribe();
  }

  // Load teams and their member counts in parallel
  loadTeamsWithCounts() {
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: teams => {
        if (!teams || teams.length === 0) {
          this.teams = [];
          this.loading = false;
          return;
        }

       const validTeams = teams.filter((t: any) => t && t.id != null);
const calls = validTeams.map((t: any) => this.teamService.getTeamMembers(t.id));
forkJoin(calls).subscribe({
  next: results => {
    validTeams.forEach((t: any, i: number) => {
      t.memberCount = Array.isArray(results[i]) ? results[i].length : 0;
    });
    // keep original order if needed; or assign this.teams = validTeams
    this.teams = teams.map(t => t && t.id != null ? validTeams.find(v => v.id === t.id) || t : t);
    this.loading = false;
  },


          error: () => {
            teams.forEach((t: any) => t.memberCount = 0);
            this.teams = teams;
            this.loading = false;
            this.toastr.error('Failed to load team member counts');
          }
        });
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load teams');
      }
    });
  }

  addTeam() {
    this.router.navigate(['/teams/add']);
  }

  editTeam(teamId: number) {
    this.router.navigate(['/teams/add'], { queryParams: { id: teamId } });
  }

  manageMembers(teamId: number) {
    this.router.navigate(['/teams/team-members', teamId]);
  }

 confirmDelete(team: any) {
  if (!team || team.id == null) {
    console.warn('confirmDelete called with invalid team', team);
    this.toastr.error('Invalid team selected');
    return;
  }

  const ok = confirm(`Delete team "${team.name}"? This cannot be undone.`);
  if (!ok) return;

  this.deleteTeamById(team.id);
}

deleteTeamById(teamId: number) {
  if (teamId == null) {
    console.warn('deleteTeamById called with invalid id', teamId);
    this.toastr.error('Invalid team id');
    return;
  }

  this.teamService.delete(teamId).subscribe({
    next: () => {
      this.toastr.success('Team deleted');
      this.teams = this.teams.filter(t => t.id !== teamId);
    },
    error: err => {
      const serverMsg = err?.error;
      if (err?.status === 400 && serverMsg) this.toastr.warning(serverMsg);
      else if (serverMsg) this.toastr.error(serverMsg);
      else this.toastr.error('Failed to delete team');
      this.loadTeamsWithCounts();
    }
  });
}
onDeleteClick(team: any) {
  console.log('onDeleteClick team:', team);
  this.confirmDelete(team);
}


  // Call this after add/remove member operations to keep counts accurate
  refreshAfterMemberChange() {
    this.loadTeamsWithCounts();
  }
}
