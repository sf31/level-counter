import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BtnComponent } from '../../shared/components/btn.component';
import { ScreenTitleComponent } from '../../shared/components/screen-title.component';
import { BackBtnComponent } from '../../shared/components/back-btn.component';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { PLAYER_COLORS } from '../../const';
import { Player } from '../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [BtnComponent, ScreenTitleComponent, BackBtnComponent, AsyncPipe],
  template: `
    @if (view$ | async; as view) {
      <div class="new-player">
        @if (view.maximumPlayersReached) {
          <div class="too-many">Maximum number of players reached!</div>
        } @else {
          <app-screen-title title="New Player Name" />
          <input #playerName type="text" placeholder="" />
          <app-btn (click)="addPlayer(playerName)"> Add</app-btn>
        }
      </div>
      @if (view.playerList.length > 0) {
        <div class="player-list">
          <div class="title">
            <app-screen-title title="Tap to remove" />
          </div>
          @for (player of view.playerList; track player) {
            <div
              class="player "
              [style.background-color]="player.color"
              (click)="removePlayer(player)"
            >
              <div class="player-name text-ellipsis">
                {{ player.name }}
              </div>
            </div>
          }
        </div>
      }
      <div class="actions">
        <app-back-btn route="''" />
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 200px 1fr 100px;
      }

      .new-player {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
      }

      .too-many {
        color: #fbc02d;
        font-weight: bold;
        text-align: center;
        padding: 1rem 0;
      }

      input {
        font-size: 1.2rem;
        background-color: #a1887f;
        border-radius: var(--border-radius-1);
        padding: 0.5rem;
      }

      .title {
        text-align: center;
        margin: 1rem;
      }

      .player-list {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        padding: 0.5rem;
        align-items: center;
      }

      .player {
        width: 80dvw;
        padding: 1rem;
        border-radius: var(--border-radius-1);
        text-align: center;
        color: #fff;
        font-weight: bold;
      }

      @media (min-width: 500px) {
        .player-list {
          align-items: center;
        }
        .player {
          width: 400px;
        }
      }

      .actions {
        margin: 2rem;
        display: flex;
        justify-content: center;
      }

      app-btn,
      app-back-btn {
        width: 150px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  view$: Observable<{
    playerList: Player[];
    maximumPlayersReached: boolean;
  }>;

  constructor(
    private app: AppService,
    private router: Router,
  ) {
    this.view$ = this.app.activePlayerList$.pipe(
      map((playerList) => ({
        playerList,
        maximumPlayersReached: playerList.length >= PLAYER_COLORS.length,
      })),
    );
  }

  ngOnInit(): void {
    const state = this.app.getStateSnapshot();
    if (!state.activePartyId) {
      this.router.navigate(['/parties'], { replaceUrl: true });
    }
  }

  addPlayer(input: HTMLInputElement): void {
    const playerName = input.value;
    if (!playerName || playerName.length === 0) return;
    this.app.addPlayer(playerName);
    input.value = '';
  }

  removePlayer(p: Player): void {
    this.app.removePlayer(p);
  }
}
