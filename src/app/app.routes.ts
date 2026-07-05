import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'property/:slug',
    loadComponent: () =>
      import('./features/property-detail/property-detail').then((m) => m.PropertyDetail),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
