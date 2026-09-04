import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './core/services/pwa.service';
import { HeaderComponent } from './shared/components/header.component';
import { BeforeInstallPromptEvent } from './types';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, RouterOutlet, HeaderComponent],
  template: `
    <div class="app-shell">
      <app-header />
      @if (pwa$ | async; as pwa) {
        @if (pwa.updateError) {
          <aside class="update-notice error" role="alert">
            <span>{{ pwa.updateError }}</span>
            <button type="button" (click)="reload()">Reload</button>
          </aside>
        } @else if (pwa.updateAvailable) {
          <aside class="update-notice" role="status">
            <span>A new version of LevelCounter is ready.</span>
            <button type="button" (click)="reload()">Reload</button>
          </aside>
        }
      }
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .app-shell {
        height: 100dvh;
        overflow: hidden;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
      }

      .content {
        width: 100%;
        max-width: 1024px;
        min-height: 0;
        margin: 0 auto;
        overflow: auto;
      }

      .update-notice {
        position: fixed;
        top: calc(var(--header-height) + var(--space-sm));
        left: 50%;
        z-index: 10;
        width: min(560px, calc(100% - 2 * var(--space-md)));
        padding: var(--space-sm) var(--space-sm) var(--space-sm) var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-md);
        transform: translateX(-50%);
        border: var(--border-width) solid var(--color-border-subtle);
        border-left: 4px solid var(--color-accent);
        border-radius: var(--border-radius-1);
        background-color: var(--color-bg-light);
        box-shadow: var(--shadow-raised);
      }

      .update-notice.error {
        border-left-color: var(--color-danger);
      }

      .update-notice span {
        min-width: 0;
        flex: 1;
      }

      .update-notice button {
        min-height: var(--touch-target);
        padding: 0 var(--space-sm);
        color: var(--color-accent);
        cursor: pointer;
        font-weight: var(--font-weight-strong);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly pwa$: PwaService['state$'];

  constructor(private pwa: PwaService) {
    this.pwa$ = this.pwa.state$;
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event): void {
    this.pwa.captureInstallPrompt(event as BeforeInstallPromptEvent);
  }

  @HostListener('window:appinstalled')
  onAppInstalled(): void {
    this.pwa.markInstalled();
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.pwa.refreshStandaloneState();
  }

  reload(): void {
    window.location.reload();
  }
}
