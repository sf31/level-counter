import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faCloudArrowDown,
  faEllipsisVertical,
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
          <button
            class="mobile-menu-trigger"
            type="button"
            popovertarget="mobile-navigation"
            aria-label="Open navigation"
          >
            <fa-icon [icon]="iconMobileMenu" />
          </button>

          <a class="brand" routerLink="/">LevelCounter</a>

          <nav class="desktop-navigation" aria-label="Primary navigation">
            <a
              class="navigation-link"
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              ariaCurrentWhenActive="page"
            >
              <fa-icon [icon]="iconHome" />
              <span>Game</span>
            </a>
            <a
              class="navigation-link"
              routerLink="/parties"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
            >
              <fa-icon [icon]="iconParties" />
              <span>Parties</span>
            </a>
          </nav>

          <a
            class="title text-ellipsis"
            [routerLink]="view.activePartyName ? '/parties' : '/'"
          >
            {{ view.activePartyName ?? 'LevelCounter' }}
          </a>

          <div class="mobile-spacer" aria-hidden="true"></div>

          @if (view.canInstall) {
            <button
              class="desktop-menu-trigger"
              type="button"
              popovertarget="desktop-secondary-menu"
              aria-label="Open additional menu"
            >
              <fa-icon [icon]="iconDesktopMenu" />
            </button>

            <div
              #desktopSecondaryMenu
              id="desktop-secondary-menu"
              class="secondary-navigation desktop-secondary-navigation"
              popover
            >
              <nav aria-label="Additional navigation">
                <a
                  class="secondary-navigation-link"
                  routerLink="/pwa"
                  routerLinkActive="active"
                  ariaCurrentWhenActive="page"
                  (click)="closePopover(desktopSecondaryMenu)"
                >
                  <fa-icon [icon]="iconInstall" />
                  <span>Install app</span>
                </a>
              </nav>
            </div>
          }

          <div
            #mobileNavigation
            id="mobile-navigation"
            class="secondary-navigation mobile-navigation"
            popover
          >
            <nav aria-label="Mobile navigation">
              <a
                class="secondary-navigation-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                ariaCurrentWhenActive="page"
                (click)="closePopover(mobileNavigation)"
              >
                <fa-icon [icon]="iconHome" />
                <span>Game</span>
              </a>
              <a
                class="secondary-navigation-link"
                routerLink="/parties"
                routerLinkActive="active"
                ariaCurrentWhenActive="page"
                (click)="closePopover(mobileNavigation)"
              >
                <fa-icon [icon]="iconParties" />
                <span>Parties</span>
              </a>
              @if (view.canInstall) {
                <a
                  class="secondary-navigation-link"
                  routerLink="/pwa"
                  routerLinkActive="active"
                  ariaCurrentWhenActive="page"
                  (click)="closePopover(mobileNavigation)"
                >
                  <fa-icon [icon]="iconInstall" />
                  <span>Install app</span>
                </a>
              }
            </nav>
          </div>
        </div>
      </header>
    }
  `,
  styles: [
    `
      .header {
        background-color: var(--color-bg-light);
      }

      .header-inner {
        min-height: var(--header-height);
        max-width: 1024px;
        margin: 0 auto;
        padding: 0 var(--space-sm);
        display: grid;
        grid-template-columns: var(--touch-target) minmax(0, 1fr) var(
            --touch-target
          );
        align-items: center;
      }

      .brand,
      .desktop-navigation,
      .desktop-menu-trigger {
        display: none;
      }

      .title {
        min-width: 0;
        grid-column: 2;
        color: var(--color-text);
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
      }

      .mobile-menu-trigger,
      .desktop-menu-trigger {
        width: var(--touch-target);
        height: var(--touch-target);
        align-items: center;
        justify-content: center;
        color: var(--color-text);
      }

      .mobile-menu-trigger {
        display: flex;
        grid-column: 1;
      }

      .desktop-menu-trigger {
        display: none;
      }

      .secondary-navigation {
        width: min(220px, calc(100vw - var(--space-md)));
        padding: var(--space-xs);
        background-color: var(--color-bg-light);
      }

      .mobile-navigation {
        position: fixed;
        inset: calc(var(--header-height) + var(--space-xs)) auto auto
          var(--space-sm);
      }

      .desktop-secondary-navigation {
        position: fixed;
        inset: calc(var(--header-height) + var(--space-xs)) var(--space-sm) auto
          auto;
      }

      .secondary-navigation-link {
        min-height: var(--touch-target);
        padding: 0 var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        color: var(--color-text);
        text-decoration: none;
      }

      .secondary-navigation-link.active {
        color: var(--color-accent);
      }

      @media (min-width: 900px) {
        .header-inner {
          padding: 0 var(--space-md);
          grid-template-columns: auto auto minmax(0, 1fr) auto;
          gap: var(--space-sm);
        }

        .brand {
          display: block;
          color: var(--color-text);
          font-weight: bold;
          text-decoration: none;
        }

        .desktop-navigation {
          display: flex;
        }

        .navigation-link {
          min-height: var(--touch-target);
          padding: 0 var(--space-sm);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          border-radius: var(--border-radius-1);
          color: var(--color-text-muted);
          text-decoration: none;
        }

        .navigation-link.active {
          color: var(--color-accent);
          background-color: var(--color-bg-lighter);
        }

        .title {
          grid-column: auto;
        }

        .desktop-menu-trigger {
          display: flex;
        }

        .mobile-menu-trigger,
        .mobile-spacer,
        .mobile-navigation {
          display: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly app = inject(AppService);
  private readonly pwa = inject(PwaService);

  protected readonly iconMobileMenu = faBars;
  protected readonly iconDesktopMenu = faEllipsisVertical;
  protected readonly iconHome = faHouse;
  protected readonly iconParties = faShieldHalved;
  protected readonly iconInstall = faCloudArrowDown;

  protected readonly view$ = combineLatest([
    this.app.activeParty$,
    this.pwa.getState$(),
  ]).pipe(
    map(([activeParty, pwa]) => ({
      activePartyName: activeParty?.name,
      canInstall: !pwa.isRunningStandalone,
    })),
  );

  protected closePopover(popover: HTMLElement): void {
    popover.hidePopover();
  }
}
