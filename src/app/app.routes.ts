import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./components/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'reset',
    loadComponent: () =>
      import('./components/reset.component').then((m) => m.ResetComponent),
  },
  {
    path: 'pwa',
    loadComponent: () =>
      import('./components/pwa.component').then((m) => m.PwaComponent),
  },
  {
    path: 'dice',
    loadComponent: () =>
      import('./components/dice.component').then((m) => m.DiceComponent),
  },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
