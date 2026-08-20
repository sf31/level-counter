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
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  startWith,
} from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { Party } from '../../types';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, FontAwesomeModule, RouterLink],
  template: `
    @if (view$ | async; as view) {
      <header class="header">
        <div class="header-inner">
          @if (view.sectionTitle) {
            <button
              class="header-action"
              type="button"
              aria-label="Back to game"
              (click)="backToGame()"
            >
              <fa-icon [icon]="backIcon" />
            </button>
            <div class="title text-ellipsis">{{ view.sectionTitle }}</div>
          } @else {
            <div class="title text-ellipsis">{{ view.activeParty.name }}</div>

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
              <a
                [routerLink]="['/parties', view.activeParty.id]"
                [state]="childNavigationState"
                (click)="navigationMenu.hidePopover()"
              >
                Party settings
              </a>
              <a
                routerLink="/parties"
                [state]="childNavigationState"
                (click)="navigationMenu.hidePopover()"
              >
                Party list
              </a>
              <a
                routerLink="/settings"
                [state]="childNavigationState"
                (click)="navigationMenu.hidePopover()"
              >
                Settings
              </a>
              <a
                routerLink="/pwa"
                [state]="childNavigationState"
                (click)="navigationMenu.hidePopover()"
              >
                Install app
              </a>
              <a
                routerLink="/about"
                [state]="childNavigationState"
                (click)="navigationMenu.hidePopover()"
              >
                About
              </a>
            </nav>
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

      .header-action {
        width: var(--touch-target);
        height: var(--touch-target);
        flex-shrink: 0;
        color: var(--color-text);
        cursor: pointer;
      }

      nav {
        position: fixed;
        inset: calc(var(--header-height) + var(--space-xs)) var(--space-sm) auto
          auto;
        width: min(220px, calc(100vw - var(--space-md)));
        margin: 0;
        padding: var(--space-xs);
        border: 0;
        border-radius: var(--border-radius-1);
        background-color: var(--color-bg-light);
        box-shadow: var(--shadow-raised);
      }

      nav a {
        min-height: var(--touch-target);
        padding: 0 var(--space-md);
        display: flex;
        align-items: center;
        color: var(--color-text);
        text-decoration: none;
      }

      nav a:active {
        background-color: var(--color-bg-lighter);
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
  protected readonly childNavigationState = { fromGame: true };

  private readonly activeParty$ = this.app.activeParty$.pipe(
    filter((activeParty): activeParty is Party => activeParty !== undefined),
  );

  private readonly sectionTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.getSectionTitle()),
    distinctUntilChanged(),
  );

  protected readonly view$ = combineLatest([
    this.activeParty$,
    this.sectionTitle$,
  ]).pipe(
    map(([activeParty, sectionTitle]) => ({ activeParty, sectionTitle })),
  );

  protected backToGame(): void {
    if (history.state.fromGame) {
      this.location.back();
      return;
    }

    this.router.navigate(['/'], { replaceUrl: true }).catch();
  }

  private getSectionTitle(): string | null {
    let route = this.route;
    while (route.firstChild) route = route.firstChild;
    return route.snapshot.data['headerTitle'] ?? null;
  }
}
