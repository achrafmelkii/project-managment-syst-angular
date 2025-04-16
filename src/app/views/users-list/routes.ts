import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'users',
    },
    loadComponent: () =>
      import('./users-list.component').then((m) => m.UsersListComponent),
  },
];
