import { Routes } from '@angular/router';
import { PlayerFormComponent } from './components/player-form.component';
import { HomeComponent } from './components/home.component';
import { RemovePlayerComponent } from './components/remove-player.component';
import { SettingsComponent } from './components/settings.component';

export const routes: Routes = [
  { path: 'add-player', component: PlayerFormComponent },
  { path: 'remove-player', component: RemovePlayerComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
