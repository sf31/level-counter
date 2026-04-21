import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerComponent } from './player.component';
import { combineLatest, map, Observable } from 'rxjs';
import { Party, Player } from '../../types';
import { AppService } from '../../core/services/app.service';
import {
  faCloudArrowDown,
  faDice,
  faRotateLeft,
  faShieldHalved,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconBtnComponent } from '../../shared/components/icon-btn.component';
import { PwaService } from '../../core/services/pwa.service';

interface HomeView {
  activeParty: Party | undefined;
  playerList: Player[];
  showPwa: boolean;
}

@Component({
  selector: 'app-home',
  imports: [
    PlayerComponent,
    RouterLink,
    FontAwesomeModule,
    IconBtnComponent,
    AsyncPipe,
  ],
  template: `
    @if (view$ | async; as view) {
      <div class="actions">
        <app-icon-btn routerLink="parties" [icon]="iconParties" />
        @if (view.activeParty) {
          <app-icon-btn routerLink="users" [icon]="iconUsers" />
        }
        <div class="fill-remaining-space"></div>
        <app-icon-btn [icon]="iconDice" routerLink="dice" />
        <div class="fill-remaining-space"></div>
        @if (view.showPwa) {
          <app-icon-btn routerLink="pwa" color="#FBC02D" [icon]="iconPwa" />
        }
        @if (view.activeParty) {
          <app-icon-btn routerLink="reset" [icon]="iconReset" />
        }
      </div>

      @if (view.activeParty) {
        <div class="party-name">{{ view.activeParty.name }}</div>
        <div class="player-list">
          @for (player of view.playerList; track player) {
            <app-player
              [player]="player"
              (playerChange)="onPlayerChange($event)"
            />
          }
        </div>
        @if (view.playerList.length === 0) {
          <div class="no-player">
            <div>Mmmh...</div>
            <div>No one here yet!</div>
            <div>Use <fa-icon [icon]="iconUsers" /> above to start</div>
          </div>
        }
      } @else {
        <div class="no-player">
          <div>Welcome!</div>
          <div>Select or create a party</div>
          <div>Use <fa-icon [icon]="iconParties" /> above to start</div>
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

      .party-name {
        text-align: center;
        color: #bcaaa4;
        font-size: 1.1rem;
        padding: 0 0.5rem 0.25rem;
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
  view$: Observable<HomeView>;

  iconParties = faShieldHalved;
  iconUsers = faUsers;
  iconDice = faDice;
  iconReset = faRotateLeft;
  iconPwa = faCloudArrowDown;

  constructor(
    private app: AppService,
    private pwa: PwaService,
  ) {
    this.view$ = combineLatest([
      this.app.activeParty$,
      this.app.activePlayerList$,
      this.app.select$('dismissPwa'),
      this.pwa.getState$(),
    ]).pipe(
      map(([activeParty, playerList, dismiss, pwa]) => ({
        activeParty,
        playerList,
        showPwa: !pwa.isRunningStandalone && dismiss === null,
      })),
    );
  }

  onPlayerChange(player: Player): void {
    this.app.updatePlayer(player);
  }
}
