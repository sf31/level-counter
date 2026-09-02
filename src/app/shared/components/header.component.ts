import { AsyncPipe, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faCircleInfo,
  faDownload,
  faEllipsisVertical,
  faGear,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { combineLatest, filter, map, startWith } from 'rxjs';
import { AppService } from '../../core/services/app.service';

type BackMode = 'game' | 'setup';

interface RouteHeader {
  sectionTitle: string | null;
  backMode: BackMode;
}

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, FontAwesomeModule, RouterLink],
  template: `
    @if (view$ | async; as view) {
      <header class="header">
        <div class="header-inner">
          @if (view.routeHeader.sectionTitle) {
            <button
              class="header-action"
              type="button"
              [attr.aria-label]="
                view.routeHeader.backMode === 'setup' ? 'Back' : 'Back to game'
              "
              (click)="navigateBack(view.routeHeader.backMode)"
            >
              <fa-icon [icon]="backIcon" />
            </button>
            <div class="title text-ellipsis">
              {{ view.routeHeader.sectionTitle }}
            </div>
          } @else {
            <div class="title brand text-ellipsis">
              <span class="brand-level">Level</span
              ><span class="brand-accent">Counter</span>
            </div>

            @if (view.activeParty) {
              <button
                class="header-action"
                type="button"
                popovertarget="navigation-menu"
                aria-label="Open menu"
              >
                <fa-icon [icon]="menuIcon" />
              </button>

              <nav
                #navigationMenu
                id="navigation-menu"
                popover
                aria-label="Navigation"
              >
                <div
                  class="menu-section"
                  role="group"
                  aria-labelledby="party-menu-label"
                >
                  <div id="party-menu-label" class="menu-section-label">
                    Party
                  </div>
                  <a
                    [routerLink]="['/parties', view.activeParty.id]"
                    [state]="childNavigationState"
                    (click)="navigationMenu.hidePopover()"
                  >
                    <fa-icon class="menu-icon" [icon]="partySettingsIcon" />
                    <span>Party settings</span>
                  </a>
                  <a
                    routerLink="/parties"
                    [state]="childNavigationState"
                    (click)="navigationMenu.hidePopover()"
                  >
                    <fa-icon class="menu-icon" [icon]="partyListIcon" />
                    <span>Party list</span>
                  </a>
                </div>

                <div class="menu-divider" role="separator"></div>

                <div
                  class="menu-section"
                  role="group"
                  aria-labelledby="app-menu-label"
                >
                  <div id="app-menu-label" class="menu-section-label">App</div>
                  <a
                    routerLink="/pwa"
                    [state]="childNavigationState"
                    (click)="navigationMenu.hidePopover()"
                  >
                    <fa-icon class="menu-icon" [icon]="installIcon" />
                    <span>Install app</span>
                  </a>
                  <a
                    routerLink="/about"
                    [state]="childNavigationState"
                    (click)="navigationMenu.hidePopover()"
                  >
                    <fa-icon class="menu-icon" [icon]="aboutIcon" />
                    <span>About</span>
                  </a>
                </div>
              </nav>
            }
          }
        </div>
      </header>
    }
  `,
  styles: [
    `
      :host {
        min-width: 0;
      }

      .header {
        background-color: var(--color-bg-light);
      }

      .header-inner {
        min-height: var(--header-height);
        max-width: 1024px;
        margin: 0 auto;
        padding: 0 var(--space-sm);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      .title {
        min-width: 0;
        flex: 1;
        font-size: var(--font-size-control);
        font-weight: var(--font-weight-strong);
      }

      .brand-level {
        color: var(--color-accent);
      }

      .brand-accent {
        color: var(--color-text-muted);
      }

      .header-action {
        width: var(--touch-target);
        height: var(--touch-target);
        flex-shrink: 0;
        border-radius: var(--border-radius-1);
        color: var(--color-text);
        cursor: pointer;
      }

      .header-action:is(:hover, :focus-visible) {
        background-color: var(--color-bg-lighter);
      }

      .header-action:focus-visible {
        outline: var(--border-width-strong) solid var(--color-accent);
        outline-offset: calc(-1 * var(--border-width-strong));
      }

      nav {
        position: fixed;
        inset: calc(var(--header-height) + var(--space-xs)) var(--space-sm) auto
          auto;
        width: min(220px, calc(100vw - var(--space-md)));
        margin: 0;
        padding: var(--space-xs);
        border: var(--border-width) solid var(--color-border);
        border-radius: var(--border-radius-1);
        background-color: var(--color-bg-lighter);
        box-shadow:
          0 12px 28px rgba(0, 0, 0, 0.38),
          var(--shadow-raised);
      }

      .menu-section-label {
        padding: var(--space-sm) var(--space-md) var(--space-xs);
        color: var(--color-text-muted);
        font-size: 0.75rem;
        font-weight: var(--font-weight-strong);
        text-transform: uppercase;
      }

      nav a {
        min-height: var(--touch-target);
        padding: 0 var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        border-radius: var(--border-radius-1);
        color: var(--color-text);
        text-decoration: none;
      }

      nav a:is(:hover, :focus-visible) {
        background-color: var(--color-surface);
      }

      nav a:focus-visible {
        outline: var(--border-width-strong) solid var(--color-accent);
        outline-offset: calc(-1 * var(--border-width-strong));
      }

      nav a:active {
        background-color: var(--color-surface-light);
      }

      .menu-icon {
        width: 1.25rem;
        flex-shrink: 0;
        color: var(--color-text-muted);
        text-align: center;
      }

      .menu-divider {
        height: var(--border-width);
        margin: var(--space-xs) var(--space-sm);
        background-color: var(--color-border);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly app = inject(AppService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly backIcon = faArrowLeft;
  protected readonly menuIcon = faEllipsisVertical;
  protected readonly partySettingsIcon = faGear;
  protected readonly partyListIcon = faUsers;
  protected readonly installIcon = faDownload;
  protected readonly aboutIcon = faCircleInfo;
  protected readonly childNavigationState = { fromGame: true };

  private readonly routeHeader$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.getRouteHeader()),
  );

  protected readonly view$ = combineLatest([
    this.app.activeParty$,
    this.routeHeader$,
  ]).pipe(map(([activeParty, routeHeader]) => ({ activeParty, routeHeader })));

  protected navigateBack(backMode: BackMode): void {
    if (backMode === 'setup') {
      const setupBackUrl = history.state.setupBackUrl ?? '/';
      this.router.navigateByUrl(setupBackUrl, { replaceUrl: true }).catch();
      return;
    }

    if (history.state.fromGame) {
      this.location.back();
      return;
    }

    this.router.navigate(['/'], { replaceUrl: true }).catch();
  }

  private getRouteHeader(): RouteHeader {
    let route = this.route;
    while (route.firstChild) route = route.firstChild;
    return {
      sectionTitle: route.snapshot.data['headerTitle'] ?? null,
      backMode: route.snapshot.data['backMode'] === 'setup' ? 'setup' : 'game',
    };
  }
}
