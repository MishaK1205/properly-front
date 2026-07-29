import { Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'property/:id',
    loadComponent: () =>
      import('./features/property-detail/property-detail').then((m) => m.PropertyDetail),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin',
    canActivate: [adminAuthGuard],
    loadComponent: () => import('./features/admin/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'companies' },
      {
        path: 'companies',
        loadComponent: () =>
          import('./features/admin/companies/companies').then((m) => m.AdminCompanies),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/admin/projects/projects').then((m) => m.AdminProjects),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/admin/applications/applications').then((m) => m.AdminApplications),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
