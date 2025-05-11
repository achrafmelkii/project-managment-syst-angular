import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile',
    },
    loadComponent: () =>
      import('./profile.component').then((m) => m.UserProfileComponent),
  },
];
