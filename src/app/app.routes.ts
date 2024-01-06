import { Routes } from '@angular/router';
import { PlayerFormComponent } from './components/player-form.component';
import { HomeComponent } from './components/home.component';

export const routes: Routes = [
  { path: 'add-player', component: PlayerFormComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
