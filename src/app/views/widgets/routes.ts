import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./widgets/widgets.component').then((m) => m.WidgetsComponent),
    data: {
      title: 'Widgets',
    },
  },
  {
    path: 'bradnd',
    loadComponent: () =>
      import('./widgets-brand/widgets-brand.component').then(
        (m) => m.WidgetsBrandComponent
      ),
    data: {
      title: 'Widgets Brand',
    },
  },
  {
    path: 'dropdown',
    loadComponent: () =>
      import('./widgets-dropdown/widgets-dropdown.component').then(
        (m) => m.WidgetsDropdownComponent
      ),
    data: {
      title: 'Widgets Dropdown',
    },
  },
  {
    path: 'e',
    loadComponent: () =>
      import('./widgets-e/widgets-e.component').then(
        (m) => m.WidgetsEComponent
      ),
    data: {
      title: 'Widgets E',
    },
  },
];
