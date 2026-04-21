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
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconBtnComponent } from '../../shared/components/icon-btn.component';
import { PwaService } from '../../core/services/pwa.service';
import { DiceDialogComponent } from '../../shared/components/dice-dialog.component';

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
    DiceDialogComponent,
  ],
  template: `
    @if (view$ | async; as view) {
      <div class="page-header">
        <app-icon-btn routerLink="parties" [icon]="iconParties" />
        <span class="page-header-title">
          {{ view.activeParty ? view.activeParty.name : 'LevelCounter' }}
        </span>
        @if (view.showPwa) {
          <app-icon-btn
            routerLink="pwa"
            [color]="'var(--color-accent)'"
            [icon]="iconPwa"
          />
        }
      </div>

      @if (view.activeParty) {
        <div class="player-list">
          @for (player of view.playerList; track player.id) {
            <app-player
              [player]="player"
              (playerChange)="onPlayerChange($event)"
            />
          }
        </div>
        @if (view.playerList.length === 0) {
          <div class="empty-state">
            <div class="empty-title">No players yet</div>
            <div class="empty-hint">
              Open <fa-icon [icon]="iconParties" /> Parties to add players
            </div>
          </div>
        }

        <button class="fab shadow" (click)="showDice = true">
          <fa-icon [icon]="iconDice" />
        </button>
      } @else {
        <div class="empty-state">
          <div class="empty-title">Welcome!</div>
          <div class="empty-hint">Create or select a party to start playing</div>
          <a routerLink="parties" class="empty-cta">Go to Parties</a>
        </div>
      }

      @if (showDice) {
        <app-dice-dialog (close)="showDice = false" />
      }
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100dvh;
        overflow: hidden;
      }

      .player-list {
        flex: 1;
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        align-content: start;
        gap: var(--space-sm);
        padding: var(--space-sm);
      }

      .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: var(--space-xl);
        gap: var(--space-md);
      }

      .empty-title {
        font-size: 2rem;
        font-weight: bold;
      }

      .empty-hint {
        font-size: 1.1rem;
        color: var(--color-text-muted);
      }

      .empty-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: var(--touch-target);
        padding: var(--space-sm) var(--space-xl);
        background-color: var(--color-accent);
        color: var(--color-bg);
        border-radius: var(--border-radius-1);
        font-weight: bold;
        font-size: 1.1rem;
        text-decoration: none;
        margin-top: var(--space-md);
      }

      .fab {
        position: fixed;
        bottom: var(--space-lg);
        right: var(--space-lg);
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: var(--color-surface);
        color: var(--color-text);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        cursor: pointer;
        border: none;
        z-index: 5;
        transition: transform 0.15s;
      }

      .fab:active {
        transform: scale(0.92);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  view$: Observable<HomeView>;
  showDice = false;

  iconParties = faShieldHalved;
  iconDice = faDice;
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
