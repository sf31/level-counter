import { Routes } from '@angular/router';
import { HomeComponent } from './features/game/home.component';

export const routes: Routes = [
  {
    path: 'parties',
    loadComponent: () =>
      import('./features/party/parties.component').then(
        (m) => m.PartiesComponent,
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
