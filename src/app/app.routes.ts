import { Routes } from '@angular/router';
import { HomeComponent } from './features/game/home.component';

export const routes: Routes = [
  {
    path: 'parties',
    data: { headerTitle: 'Party list' },
    loadComponent: () =>
      import('./features/party/party-list.component').then(
        (m) => m.PartyListComponent,
      ),
  },
  {
    path: 'parties/new',
    data: { headerTitle: 'Create party', backMode: 'setup' },
    loadComponent: () =>
      import('./features/party/party-create.component').then(
        (m) => m.PartyCreateComponent,
      ),
  },
  {
    path: 'parties/:id',
    data: { headerTitle: 'Party settings' },
    loadComponent: () =>
      import('./features/party/party-detail.component').then(
        (m) => m.PartyDetailComponent,
      ),
  },
  {
    path: 'pwa',
    data: { headerTitle: 'Install app' },
    loadComponent: () =>
      import('./features/pwa/pwa.component').then((m) => m.PwaComponent),
  },
  {
    path: 'settings',
    data: { headerTitle: 'Settings' },
    loadComponent: () =>
      import('./features/settings/settings.component').then(
        (m) => m.SettingsComponent,
      ),
  },
  {
    path: 'about',
    data: { headerTitle: 'About' },
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
  },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
