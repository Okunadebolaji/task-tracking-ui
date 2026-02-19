import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../services/team.services';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-team.component.html'
})
export class AddTeamComponent implements OnInit {
  teamId: number | null = null;
  name = '';
  maxMembers = 5;

  constructor(
    private teamService: TeamService,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.teamId = +params['id'];
        this.loadTeam(this.teamId);
      }
    });
  }

 loadTeam(id: number) {
  this.teamService.getAll().subscribe(teams => {
    const team = teams.find(t => t.id === id);
    if (team) {
      this.name = team.name;
      this.maxMembers = team.maxMembers; // ✅ THIS IS THE FIX

      
    }
    
  });
}



  submit() {
  if (!this.name) {
    this.toastr.warning('Please enter team name');
    return;
  }

  if (this.teamId) {
    // EDIT team
    this.teamService.update({
      id: this.teamId,
      name: this.name,
      maxMembers: this.maxMembers,  // make sure maxMembers is sent
      isActive: true,
      projectId:null,
    }).subscribe(() => {
      this.toastr.success('Team updated successfully');
      this.router.navigate(['/teams']);
    });
  } else {
    // CREATE team
    this.teamService.create({
  name: this.name,
  maxMembers: this.maxMembers
}).subscribe({
  next: () => {
    this.toastr.success('Team created successfully');
    this.router.navigate(['/teams']);
  },
  error: (err) => {
    this.toastr.error(err.error);
  }
});

  }
}

}
