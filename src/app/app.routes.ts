import { Routes } from '@angular/router';
import { PlayerFormComponent } from './components/player-form.component';
import { HomeComponent } from './components/home.component';
import { RemovePlayerComponent } from './components/remove-player.component';
import { ResetComponent } from './components/reset.component';

export const routes: Routes = [
  { path: 'add-player', component: PlayerFormComponent },
  { path: 'remove-player', component: RemovePlayerComponent },
  { path: 'reset', component: ResetComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
