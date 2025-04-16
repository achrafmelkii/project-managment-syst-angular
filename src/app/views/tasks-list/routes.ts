import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'tasks',
    },
    loadComponent: () =>
      import('./tasks-list.component').then((m) => m.TasksListComponent),
  },
];
