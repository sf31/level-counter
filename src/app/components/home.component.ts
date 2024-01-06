import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PlayerComponent } from './player.component';
import { HeaderComponent } from './header.component';
import { Observable } from 'rxjs';
import { Player } from '../types';
import { AppService } from '../app.service';
import { FloatingBtnComponent } from './floating-btn.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PlayerComponent,
    HeaderComponent,
    FloatingBtnComponent,
    RouterLink,
  ],
  template: `
    <app-header />
    <div class="player-list">
      <app-player
        *ngFor="let player of playerList$ | async"
        [player]="player"
      />
    </div>
    <app-floating-btn routerLink="add-player" />
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  playerList$: Observable<Player[]>;

  constructor(private app: AppService) {
    this.playerList$ = this.app.getPlayerList();
  }
}
