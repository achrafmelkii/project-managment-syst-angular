import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'projects',
    },
    loadComponent: () =>
      import('./manager-project-list.component').then(
        (m) => m.ManagerProjectListComponent
      ),
  },
];
