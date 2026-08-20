import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { AppService } from '../../core/services/app.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, FontAwesomeModule, RouterLink],
  template: `
    @if (activeParty$ | async; as activeParty) {
      <header class="header">
        <div class="header-inner">
          <div class="party-name text-ellipsis">{{ activeParty.name }}</div>

          <button
            class="menu-trigger"
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
              [routerLink]="['/parties', activeParty.id]"
              (click)="navigationMenu.hidePopover()"
            >
              Party settings
            </a>
            <a routerLink="/parties" (click)="navigationMenu.hidePopover()">
              Party list
            </a>
            <a routerLink="/settings" (click)="navigationMenu.hidePopover()">
              Settings
            </a>
            <a routerLink="/pwa" (click)="navigationMenu.hidePopover()">
              Install app
            </a>
            <a routerLink="/about" (click)="navigationMenu.hidePopover()">
              About
            </a>
          </nav>
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
        padding: 0 var(--space-sm) 0 var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
      }

      .party-name {
        min-width: 0;
        flex: 1;
        font-size: var(--font-size-control);
        font-weight: var(--font-weight-strong);
      }

      .menu-trigger {
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

  protected readonly activeParty$ = this.app.activeParty$;
  protected readonly menuIcon = faEllipsisVertical;
}
