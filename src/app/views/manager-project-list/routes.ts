import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Responsible projects',
    },
    loadComponent: () =>
      import('./manager-project-list.component').then(
        (m) => m.ManagerProjectListComponent
      ),
  },
];
