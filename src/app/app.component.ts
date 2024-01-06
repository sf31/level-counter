import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Player } from './types';
import { AppService } from './app.service';
import { PlayerComponent } from './components/player.component';
import { HeaderComponent } from './components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PlayerComponent, HeaderComponent],
  template: `
    <app-header />
    <div class="player-list">
      <app-player
        *ngFor="let player of playerList$ | async"
        [player]="player"
      />
    </div>
  `,
  styles: [
    `
      :host {
        display: grid;
        height: 100dvh;
        grid-template-rows: auto 1fr;
        overflow: hidden;
      }

      .player-list {
        overflow: auto;
      }
    `,
  ],
})
export class AppComponent {
  playerList$: Observable<Player[]>;

  constructor(private app: AppService) {
    this.playerList$ = this.app.getPlayerList();
  }
}
