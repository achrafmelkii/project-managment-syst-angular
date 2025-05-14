import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Consultant projects',
    },
    loadComponent: () =>
      import('./consultant-project-list.component').then(
        (m) => m.ConsultantProjectListComponent
      ),
  },
];
