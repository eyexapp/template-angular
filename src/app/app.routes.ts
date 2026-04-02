import { Routes } from '@angular/router';
import { guestGuard } from './core';
import { AuthLayoutComponent, MainLayoutComponent } from './layouts';

export const routes: Routes = [
  // Main layout routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      // Add protected feature routes here
      // {
      //   path: 'dashboard',
      //   canActivate: [authGuard],
      //   loadComponent: () =>
      //     import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      // },
    ],
  },

  // Auth layout routes
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // Not found
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
