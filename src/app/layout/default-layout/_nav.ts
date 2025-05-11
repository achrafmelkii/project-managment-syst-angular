import { INavData } from '@coreui/angular';
import { UserRole } from './default-layout.component';

const employeeNav: INavData[] = [
  {
    name: 'Dashboard',
    url: '/employee/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'My Tasks',
    url: '/employee/tasks',
    iconComponent: { name: 'cil-task' },
  },
  {
    name: 'Projects',
    url: '/manager/projects',
    iconComponent: { name: 'cil-File' },
  },

  {
    name: 'Calendar',
    url: '/employee/calendar',
    iconComponent: { name: 'cil-calendar' },
  },
  {
    name: 'My Profile',
    url: '/employee/profile',
    iconComponent: { name: 'cil-user' },
  },
];

const managerNav: INavData[] = [
  {
    name: 'Dashboard',
    url: '/manager/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Projects',
    url: '/manager/projects',
    iconComponent: { name: 'cil-File' },
  },
  {
    name: 'Tasks Management',
    url: '/manager/tasks',
    iconComponent: { name: 'cil-task' },
  },

  {
    name: 'Calendar',
    url: '/manager/calendar',
    iconComponent: { name: 'cil-calendar' },
  },
  {
    name: 'Profile',
    url: '/manager/profile',
    iconComponent: { name: 'cil-user' },
  },
];

const responsibleNav: INavData[] = [
  {
    name: 'Dashboard',
    url: '/responsible/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Users Management',
    url: '/responsible/users',
    iconComponent: { name: 'cil-people' },
  },
  {
    name: 'Projects',
    url: '/responsible/projects',
    iconComponent: { name: 'cil-File' },
  },
  {
    name: 'Skills Management',
    url: '/responsible/skills',
    iconComponent: { name: 'cil-puzzle' },
  },
  {
    name: 'Calendar',
    url: '/responsible/calendar',
    iconComponent: { name: 'cil-calendar' },
  },
  {
    name: 'Profile',
    url: '/responsible/profile',
    iconComponent: { name: 'cil-user' },
  },
];

export const navItems: Record<UserRole, INavData[]> = {
  employee: employeeNav,
  manager: managerNav,
  responsible: responsibleNav,
};
