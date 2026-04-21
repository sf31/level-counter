import { Routes } from '@angular/router';
import { HomeComponent } from './features/game/home.component';

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'parties',
    loadComponent: () =>
      import('./features/party/parties.component').then(
        (m) => m.PartiesComponent,
      ),
  },
  {
    path: 'reset',
    loadComponent: () =>
      import('./features/reset/reset.component').then((m) => m.ResetComponent),
  },
  {
    path: 'pwa',
    loadComponent: () =>
      import('./features/pwa/pwa.component').then((m) => m.PwaComponent),
  },
  {
    path: 'dice',
    loadComponent: () =>
      import('./features/dice/dice.component').then((m) => m.DiceComponent),
  },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
