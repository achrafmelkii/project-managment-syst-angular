import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'calendar',
    },
    loadComponent: () =>
      import('./calendar.component').then((m) => m.CalendarComponent),
  },
];
