import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BtnComponent } from '../../shared/components/btn.component';
import { AsyncPipe } from '@angular/common';
import { PwaService } from '../../core/services/pwa.service';
import { AppService } from '../../core/services/app.service';

@Component({
  selector: 'app-pwa',
  imports: [BtnComponent, AsyncPipe],
  template: `
    @if (pwa$ | async; as pwa) {
      <div class="content">
        <h1>Install LevelCounter</h1>
        <div class="text intro">
          <p>Keep LevelCounter on your home screen and use it offline.</p>
          <p>No account required.</p>
        </div>
        @if (pwa.installStatus === 'available') {
          <app-btn class="success-btn" (click)="install()">
            Install LevelCounter
          </app-btn>
          <app-btn class="dismiss-btn" (click)="dismiss()">
            Hide install reminder
          </app-btn>
        } @else if (pwa.installStatus === 'prompting') {
          <div class="text" role="status">
            <p>Installing...</p>
            <p>Follow the instructions from your browser.</p>
          </div>
        } @else if (pwa.installStatus === 'installed') {
          <div class="text success" role="status">
            <p>LevelCounter is installed.</p>
            <p>Open it from your home screen whenever you need it.</p>
          </div>
        } @else {
          @if (pwa.installStatus === 'error' && pwa.installError) {
            <div class="text error" role="alert">{{ pwa.installError }}</div>
          } @else if (pwa.installStatus === 'dismissed') {
            <div class="text">
              Installation was canceled. You can install it later from your
              browser menu.
            </div>
          }

          <div class="text manual-install">
            <p>To install manually, use your browser's menu:</p>
            <ul>
              <li><strong>Android/Chrome:</strong> Install app</li>
              <li>
                <strong>iPhone/iPad Safari:</strong> Share → Add to Home Screen
              </li>
              <li>
                <strong>Desktop Chrome/Edge:</strong> Install in the address bar
                or browser menu
              </li>
            </ul>
          </div>

          <app-btn class="dismiss-btn" (click)="backToApp()">
            Back to app
          </app-btn>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-lg);
        gap: var(--space-md);
      }

      h1 {
        margin: 0 0 var(--space-md);
        font-size: var(--font-size-page-title);
      }

      .text {
        text-align: center;
        color: var(--color-text);
        line-height: var(--line-height-relaxed);
      }

      .text p {
        margin: 0;
      }

      .intro {
        max-width: 440px;
      }

      .intro p + p {
        margin-top: var(--space-sm);
        color: var(--color-text-muted);
      }

      .text.success {
        color: var(--color-success);
        font-size: var(--font-size-subtitle);
        font-weight: var(--font-weight-strong);
      }

      .text.success p + p {
        margin-top: var(--space-sm);
        color: var(--color-text-muted);
        font-size: var(--font-size-body);
        font-weight: normal;
      }

      .text.error {
        color: var(--color-danger);
        font-weight: var(--font-weight-strong);
      }

      .manual-install {
        max-width: 440px;
        color: var(--color-text-muted);
      }

      .manual-install ul {
        margin: var(--space-sm) 0 0;
        padding-left: var(--space-lg);
        text-align: left;
      }

      .manual-install li + li {
        margin-top: var(--space-sm);
      }

      app-btn {
        width: min(280px, 100%);
      }

      .success-btn {
        background-color: var(--color-success);
      }

      .dismiss-btn {
        background-color: var(--color-bg-lighter);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaComponent {
  private readonly app = inject(AppService);
  private readonly pwa = inject(PwaService);
  private readonly router = inject(Router);

  protected readonly pwa$ = this.pwa.getState$();

  protected dismiss(): void {
    this.app.patchState({ dismissPwa: Date.now() });
    this.router.navigate(['/'], { replaceUrl: true }).catch();
  }

  protected install(): void {
    void this.pwa.install();
  }

  protected backToApp(): void {
    this.router.navigate(['/'], { replaceUrl: true }).catch();
  }
}
