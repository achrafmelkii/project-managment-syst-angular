import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'skills',
    },
    loadComponent: () =>
      import('./skills-list.component').then((m) => m.SkillsListComponent),
  },
];
