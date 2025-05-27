import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Consultant projects',
    },
    loadComponent: () =>
      import('./consultant-tasks-list.component').then(
        (m) => m.ConsultantTasksListComponent
      ),
  },
];
