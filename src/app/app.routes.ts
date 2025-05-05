import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { LoginComponent } from './views/pages/login/login.component';
import { UsersListComponent } from './views/users-list/users-list.component';
import { AuthGuard } from './services/auth.service';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  // {
  //   path: '',
  //   component: DefaultLayoutComponent,
  //   data: {
  //     title: 'Home',
  //   },
  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadChildren: () =>
  //         import('./views/dashboard/routes').then((m) => m.routes),
  //       canActivate: [AuthGuard],
  //     },
  //     {
  //       path: 'users',
  //       loadChildren: () =>
  //         import('./views/users-list/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'projects',
  //       loadChildren: () =>
  //         import('./views/project-list/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'skills',
  //       loadChildren: () =>
  //         import('./views/skills-list/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'tasks',
  //       loadChildren: () =>
  //         import('./views/tasks-list/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'calendar',
  //       loadChildren: () =>
  //         import('./views/calendar/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'theme',
  //       loadChildren: () =>
  //         import('./views/theme/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'base',
  //       loadChildren: () => import('./views/base/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'buttons',
  //       loadChildren: () =>
  //         import('./views/buttons/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'forms',
  //       loadChildren: () =>
  //         import('./views/forms/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'icons',
  //       loadChildren: () =>
  //         import('./views/icons/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'notifications',
  //       loadChildren: () =>
  //         import('./views/notifications/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'widgets',
  //       loadChildren: () =>
  //         import('./views/widgets/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'charts',
  //       loadChildren: () =>
  //         import('./views/charts/routes').then((m) => m.routes),
  //     },
  //     {
  //       path: 'pages',
  //       loadChildren: () =>
  //         import('./views/pages/routes').then((m) => m.routes),
  //     },
  //   ],
  // },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'manager',
        // canActivate: [RoleGuard],
        data: { role: 'MANAGER' },
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./views/dashboard/routes').then((m) => m.routes),
          },
          {
            path: 'users',
            loadChildren: () =>
              import('./views/users-list/routes').then((m) => m.routes),
          },

          {
            path: 'projects',
            loadChildren: () =>
              import('./views/manager-project-list/routes').then(
                (m) => m.routes
              ),
          },
          //  {
          //   path: 'projects',
          //   loadChildren: () =>
          //     import('./views/project-list/routes').then((m) => m.routes),
          // },
          {
            path: 'skills',
            loadChildren: () =>
              import('./views/skills-list/routes').then((m) => m.routes),
          },
          {
            path: 'tasks',
            loadChildren: () =>
              import('./views/tasks-list/routes').then((m) => m.routes),
          },
          {
            path: 'calendar',
            loadChildren: () =>
              import('./views/calendar/routes').then((m) => m.routes),
          },
        ],
      },
      {
        path: 'responsible',
        // canActivate: [RoleGuard],
        data: { role: 'RESPONSIBLE' },
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./views/dashboard/routes').then((m) => m.routes),
          },
          {
            path: 'users',
            loadChildren: () =>
              import('./views/users-list/routes').then((m) => m.routes),
          },

          {
            path: 'projects',
            loadChildren: () =>
              import('./views/project-list/routes').then((m) => m.routes),
          },
          {
            path: 'skills',
            loadChildren: () =>
              import('./views/skills-list/routes').then((m) => m.routes),
          },
          {
            path: 'tasks',
            loadChildren: () =>
              import('./views/tasks-list/routes').then((m) => m.routes),
          },
          {
            path: 'calendar',
            loadChildren: () =>
              import('./views/calendar/routes').then((m) => m.routes),
          },
        ],
      },
      {
        path: 'employee',
        // canActivate: [RoleGuard],
        data: { role: 'EMPLOYEE' },
        children: [
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./views/dashboard/routes').then((m) => m.routes),
          },
          {
            path: 'users',
            loadChildren: () =>
              import('./views/users-list/routes').then((m) => m.routes),
          },

          {
            path: 'projects',
            loadChildren: () =>
              import('./views/project-list/routes').then((m) => m.routes),
          },
          {
            path: 'skills',
            loadChildren: () =>
              import('./views/skills-list/routes').then((m) => m.routes),
          },
          {
            path: 'tasks',
            loadChildren: () =>
              import('./views/tasks-list/routes').then((m) => m.routes),
          },
          {
            path: 'calendar',
            loadChildren: () =>
              import('./views/calendar/routes').then((m) => m.routes),
          },
        ],
      },
    ],
  },

  {
    path: '404',
    loadComponent: () =>
      import('./views/pages/page404/page404.component').then(
        (m) => m.Page404Component
      ),
    data: {
      title: 'Page 404',
    },
  },
  {
    path: '500',
    loadComponent: () =>
      import('./views/pages/page500/page500.component').then(
        (m) => m.Page500Component
      ),
    data: {
      title: 'Page 500',
    },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./views/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./views/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    data: {
      title: 'Register Page',
    },
  },
  { path: '**', redirectTo: '404' },
];
