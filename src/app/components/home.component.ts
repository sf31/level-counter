import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerComponent } from './player.component';
import { combineLatest, map, Observable } from 'rxjs';
import { Player } from '../types';
import { AppService } from '../app.service';
import {
  faCloudArrowDown,
  faDice,
  faRotateLeft,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconBtnComponent } from './icon-btn.component';
import { PwaService } from '../pwa.service';

@Component({
  selector: 'app-home',
  imports: [
    PlayerComponent,
    RouterLink,
    FontAwesomeModule,
    PlayerComponent,
    IconBtnComponent,
    AsyncPipe
],
  template: `
    @if (playerList$ | async; as list) {
      <div class="actions">
        <app-icon-btn routerLink="users" [icon]="iconUsers" />
        <div class="fill-remaining-space"></div>
        <app-icon-btn [icon]="iconDice" routerLink="dice" />
        <div class="fill-remaining-space"></div>
        @if (showPwa$ | async; as showPwa) {
          <app-icon-btn routerLink="pwa" color="#FBC02D" [icon]="iconPwa" />
        }
        <app-icon-btn routerLink="reset" [icon]="iconReset" />
      </div>
      <div class="player-list">
        @for (player of list; track player) {
          <app-player [player]="player" />
        }
      </div>
      @if (list.length === 0) {
        <div class="no-player">
          <div>Mmmh...</div>
          <div>No one here yet!</div>
          <div>Use <fa-icon [icon]="iconUsers" /> above to start</div>
        </div>
      }
    }
    `,
  styles: [
    `
      :host {
        height: 100dvh;
        overflow: hidden;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        gap: 0.5rem;
      }

      .player-list {
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .no-player {
        text-align: center;
        font-size: 1.5rem;
        color: #fff;
        padding: 3rem 1rem;
      }

      .no-player > div:first-child {
        font-size: 2.5rem;
      }

      .no-player > div {
        margin: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  playerList$: Observable<Player[]>;
  iconUsers = faUsers;
  iconDice = faDice;
  iconReset = faRotateLeft;
  iconPwa = faCloudArrowDown;
  showPwa$: Observable<boolean>;

  constructor(
    private app: AppService,
    private pwa: PwaService,
  ) {
    this.playerList$ = this.app.select$('playerList');
    this.showPwa$ = combineLatest([
      this.app.select$('dismissPwa'),
      this.pwa.getState$(),
    ]).pipe(
      map(([dismiss, pwa]) => {
        return !pwa.isRunningStandalone && dismiss === null;
      }),
    );
  }
}
