import { Routes } from '@angular/router';
import { HomeComponent } from './features/game/home.component';

export const routes: Routes = [
  {
    path: 'parties',
    loadComponent: () =>
      import('./features/party/party-list.component').then(
        (m) => m.PartyListComponent,
      ),
  },
  {
    path: 'parties/:id',
    loadComponent: () =>
      import('./features/party/party-detail.component').then(
        (m) => m.PartyDetailComponent,
      ),
  },
  {
    path: 'pwa',
    loadComponent: () =>
      import('./features/pwa/pwa.component').then((m) => m.PwaComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
