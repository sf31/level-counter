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
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DiceDialogComponent } from '../../shared/components/dice-dialog.component';
import { PwaService } from '../../core/services/pwa.service';

interface HomeView {
  activeParty: Party | undefined;
  playerList: Player[];
  showInstallNotice: boolean;
}

@Component({
  selector: 'app-home',
  imports: [
    PlayerComponent,
    RouterLink,
    FontAwesomeModule,
    AsyncPipe,
    DiceDialogComponent,
  ],
  template: `
    @if (view$ | async; as view) {
      @if (view.showInstallNotice) {
        <aside class="install-notice" aria-label="Install LevelCounter">
          <fa-icon class="install-icon" [icon]="iconInstall" />
          <span class="install-copy">
            Install LevelCounter for offline use.
          </span>
          <a class="install-action" routerLink="/pwa">Install</a>
          <button
            class="install-dismiss"
            type="button"
            aria-label="Dismiss installation notice"
            (click)="dismissInstall()"
          >
            <fa-icon [icon]="iconDismiss" />
          </button>
        </aside>
      }

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

        <button
          class="fab shadow"
          type="button"
          aria-label="Roll dice"
          (click)="showDice = true"
        >
          <fa-icon [icon]="iconDice" />
        </button>
      } @else {
        <div class="empty-state">
          <div class="empty-title">Welcome!</div>
          <div class="empty-hint">
            Create or select a party to start playing
          </div>
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
        --fab-size: 56px;

        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      .player-list {
        flex: 1;
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        align-content: start;
        gap: var(--space-sm);
        padding: var(--space-sm);
        padding-bottom: calc(
          var(--fab-size) + var(--space-lg) + var(--space-sm) +
            env(safe-area-inset-bottom)
        );
      }

      .install-notice {
        margin: var(--space-sm);
        padding: var(--space-xs) var(--space-xs) var(--space-xs) var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        border: 1px solid var(--color-surface);
        border-radius: var(--border-radius-1);
        background-color: var(--color-bg-light);
      }

      .install-icon {
        color: var(--color-accent);
      }

      .install-copy {
        min-width: 0;
        flex: 1;
        color: var(--color-text-muted);
        font-size: 0.9rem;
      }

      .install-action {
        min-height: var(--touch-target);
        padding: 0 var(--space-sm);
        display: flex;
        align-items: center;
        color: var(--color-accent);
        font-weight: bold;
      }

      .install-dismiss {
        width: var(--touch-target);
        height: var(--touch-target);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius-1);
        color: var(--color-text-muted);
        cursor: pointer;
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
        bottom: calc(var(--space-lg) + env(safe-area-inset-bottom));
        right: var(--space-lg);
        width: var(--fab-size);
        height: var(--fab-size);
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
  iconInstall = faCloudArrowDown;
  iconDismiss = faXmark;

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
      map(([activeParty, playerList, dismissPwa, pwa]) => ({
        activeParty,
        playerList,
        showInstallNotice: !pwa.isRunningStandalone && dismissPwa === null,
      })),
    );
  }

  dismissInstall(): void {
    this.app.patchState({ dismissPwa: Date.now() });
  }

  onPlayerChange(player: Player): void {
    this.app.updatePlayer(player);
  }
}
