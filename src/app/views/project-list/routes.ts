import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'projects',
    },
    loadComponent: () =>
      import('./project-list.component').then((m) => m.ProjectListComponent),
  },
];
