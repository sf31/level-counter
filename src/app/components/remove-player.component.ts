import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Player } from '../types';
import { AsyncPipe, NgForOf } from '@angular/common';
import { AppService } from '../app.service';
import { Observable } from 'rxjs';
import { BtnComponent } from './btn.component';
import { Router, RouterLink } from '@angular/router';
import { ScreenTitleComponent } from './screen-title.component';
import { BackBtnComponent } from './back-btn.component';

@Component({
  selector: 'app-player-to-remove',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    BtnComponent,
    RouterLink,
    ScreenTitleComponent,
    BackBtnComponent,
  ],
  template: `
    <div class="title">
      <app-screen-title title="Tap to remove" />
    </div>
    <div class="player-list">
      <div
        *ngFor="let player of playerList$ | async as list"
        class="player text-ellipsis"
        [style.background-color]="player.color"
        (click)="removePlayer(player, list)"
      >
        {{ player.name }}
      </div>
    </div>

    <div class="actions">
      <app-back-btn route="" />
    </div>
  `,
  styles: [
    `
      .title {
        display: flex;
        justify-content: center;
        margin: 1rem;
      }

      .player-list {
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .player {
        padding: 1rem;
        border-radius: var(--border-radius-1);
        text-align: center;
        color: #fff;
        font-weight: bold;
      }

      .actions {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
      }

      app-back-btn {
        width: 200px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemovePlayerComponent {
  playerList$: Observable<Player[]>;

  constructor(
    private app: AppService,
    private router: Router,
  ) {
    this.playerList$ = this.app.select$('playerList');
  }

  removePlayer(p: Player, playerList: Player[]): void {
    this.app.removePlayer(p);
    if (playerList.length === 0) this.router.navigate(['']).catch();
  }
}
