import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';

export const routes: Routes = [
  {
    path: 'add-player',
    loadComponent: () =>
      import('./components/player-form.component').then(
        (m) => m.PlayerFormComponent,
      ),
  },
  {
    path: 'remove-player',
    loadComponent: () =>
      import('./components/remove-player.component').then(
        (m) => m.RemovePlayerComponent,
      ),
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
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
