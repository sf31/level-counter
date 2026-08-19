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
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
