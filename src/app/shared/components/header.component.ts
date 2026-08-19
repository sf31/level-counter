import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCloudArrowDown,
  faHouse,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { combineLatest, map } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { PwaService } from '../../core/services/pwa.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, FontAwesomeModule, RouterLink, RouterLinkActive],
  template: `
    @if (view$ | async; as view) {
      <header class="header">
        <div class="header-inner">
          <div class="brand" aria-label="LevelCounter">LC</div>

          <div class="title text-ellipsis">
            {{ view.activePartyName ?? 'LevelCounter' }}
          </div>

          <nav class="navigation" aria-label="Primary navigation">
            <a
              class="navigation-link"
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              ariaCurrentWhenActive="page"
              aria-label="Game"
            >
              <fa-icon [icon]="iconHome" />
              <span>Game</span>
            </a>
            <a
              class="navigation-link"
              routerLink="/parties"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              aria-label="Parties"
            >
              <fa-icon [icon]="iconParties" />
              <span>Parties</span>
            </a>
            @if (view.showInstall) {
              <a
                class="navigation-link install-link"
                routerLink="/pwa"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                aria-label="Install app"
              >
                <fa-icon [icon]="iconInstall" />
                <span>Install</span>
              </a>
            }
          </nav>
        </div>
      </header>
    }
  `,
  styles: [
    `
      .header {
        min-height: var(--header-height);
        background-color: var(--color-bg-light);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .header-inner {
        min-height: var(--header-height);
        max-width: 1024px;
        margin: 0 auto;
        padding: 0 var(--space-sm);
        display: grid;
        grid-template-columns: var(--touch-target) minmax(0, 1fr) auto;
        align-items: center;
        gap: var(--space-sm);
      }

      .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--touch-target);
        height: var(--touch-target);
        color: var(--color-accent);
        font-weight: bold;
      }

      .title {
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
      }

      .navigation {
        display: flex;
        align-items: center;
      }

      .navigation-link {
        min-width: var(--touch-target);
        min-height: var(--touch-target);
        padding: 0 var(--space-sm);
        border-radius: var(--border-radius-1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-xs);
        color: var(--color-text-muted);
        text-decoration: none;
      }

      .navigation-link.active {
        color: var(--color-accent);
        background-color: var(--color-bg-lighter);
      }

      .install-link:not(.active) {
        color: var(--color-accent);
      }

      @media (max-width: 767px) {
        .navigation-link span {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      }

      @media (min-width: 768px) {
        .header-inner {
          padding: 0 var(--space-md);
        }

        .brand {
          width: auto;
          justify-content: flex-start;
        }

        .header-inner {
          grid-template-columns: minmax(150px, 1fr) minmax(0, 1fr) minmax(
              150px,
              1fr
            );
        }

        .navigation {
          justify-content: flex-end;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly app = inject(AppService);
  private readonly pwa = inject(PwaService);

  protected readonly iconHome = faHouse;
  protected readonly iconParties = faShieldHalved;
  protected readonly iconInstall = faCloudArrowDown;

  protected readonly view$ = combineLatest([
    this.app.activeParty$,
    this.app.select$('dismissPwa'),
    this.pwa.getState$(),
  ]).pipe(
    map(([activeParty, dismissPwa, pwa]) => ({
      activePartyName: activeParty?.name,
      showInstall: !pwa.isRunningStandalone && dismissPwa === null,
    })),
  );
}
