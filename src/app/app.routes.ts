import { Routes } from '@angular/router';
import  { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [

  /* =========================
     PUBLIC / NO SIDEBAR
     ========================= */

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
        .then(c => c.LoginComponent)
  },

  {
    path: 'superadmin-signup',
    loadComponent: () =>
      import('./pages/superadmin-signup/superadmin-signup')
        .then(m => m.SuperadminSignup)
  },

  {
    path: 'change-password/:id',
    loadComponent: () =>
      import('./pages/change-password/change-password')
        .then(c => c.ChangePasswordComponent)
  },

  /* =========================
     MAIN APP / WITH SIDEBAR
     ========================= */

  {
    path: '',
    component: MainLayoutComponent,
    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(c => c.Dashboard)
      },

      {
        path: 'dashboard/tasks/:type',
        loadComponent: () =>
          import('./pages/dashboard/task-drilldown/task-drilldown.component')
            .then(m => m.TaskDrilldownComponent)
      },

      /* -------- TASKS -------- */
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/tasks/tasks')
            .then(c => c.TasksComponent)
      },
      {
        path: 'tasks/view',
        loadComponent: () =>
          import('./pages/tasks/view/view')
            .then(m => m.View)
      },
      {
        path: 'tasks/create',
        loadComponent: () =>
          import('./pages/tasks/create/create')
            .then(m => m.Create)
      },
      {
        path: 'tasks/pending',
        loadComponent: () =>
          import('./pages/tasks/pending/pending')
            .then(m => m.Pending)
      },
      {
        path: 'tasks/completed',
        loadComponent: () =>
          import('./pages/tasks/completed/completed')
            .then(m => m.Completed)
      },
      {
        path: 'tasks/rejected',
        loadComponent: () =>
          import('./pages/tasks/rejected/rejected.component')
            .then(m => m.Rejected)
      },
      {
        path: 'tasks/edit/:id',
        loadComponent: () =>
          import('./pages/tasks/edit-status/edit-status.component')
            .then(m => m.EditStatusComponent)
      },
    

      /* -------- PROJECTS -------- */
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects')
            .then(c => c.Projects)
      },
      {
        path: 'projects/add',
        loadComponent: () =>
          import('./pages/projects/add/add')
            .then(m => m.Add)
      },
      {
        path: 'projects/assign-teams',
        loadComponent: () =>
          import('./pages/projects/assign-teams/assign-teams.component')
            .then(m => m.AssignTeamsComponent)
      },

      /* -------- REQUIREMENTS -------- */
      {
        path: 'requirements',
        loadComponent: () =>
          import('./pages/requirements/requirements')
            .then(c => c.RequirementsComponent)
      },
      {
        path: 'requirements/view',
        loadComponent: () =>
          import('./pages/requirements/view/view')
            .then(m => m.ViewRequirementsComponent)
      },
      {
        path: 'requirements/add',
        loadComponent: () =>
          import('./pages/requirements/add/add')
            .then(m => m.AddRequirementComponent)
      },
      // {
      //   path: 'requirements/edit/:id',
      //   loadComponent: () =>
      //     import('./pages/requirements/edit/edit')
      //       .then(m => m.EditRequirementComponent)
      // },

      /* -------- USERS -------- */
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users')
            .then(c => c.Users)
      },
      {
        path: 'users/permissions',
        loadComponent: () =>
          import('./pages/users/permissions/permissions')
            .then(m => m.Permissions)
      },

      /* -------- TEAMS -------- */
      {
        path: 'teams',
        loadComponent: () =>
          import('./pages/teams/teams.component')
            .then(m => m.TeamsComponent)
      },
      {
        path: 'teams/add',
        loadComponent: () =>
          import('./pages/teams/add-team/add-team.component')
            .then(m => m.AddTeamComponent)
      },
      {
        path: 'teams/team-members/:id',
        loadComponent: () =>
          import('./pages/teams/team-members/team-members.component')
            .then(m => m.TeamMembersComponent)
      },

      /* -------- COMPANY -------- */
      {
        path: 'company/profile',
        loadComponent: () =>
          import('./pages/CompanyProfile/company-profile')
            .then(m => m.CompanyProfileComponent)
      },

      /* -------- REPORTS -------- */
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports')
            .then(c => c.Reports)
      }
    ]
  }

];
