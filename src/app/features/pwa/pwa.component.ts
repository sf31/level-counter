import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BtnComponent } from '../../shared/components/btn.component';
import { AsyncPipe } from '@angular/common';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PwaUpdateState } from '../../types';
import { PwaService } from '../../core/services/pwa.service';
import { AppService } from '../../core/services/app.service';

@Component({
  selector: 'app-pwa',
  imports: [BtnComponent, AsyncPipe, FontAwesomeModule],
  template: `
    @if (pwa$ | async; as pwa) {
      <div class="content">
        <h1>Install App</h1>
        @if (!pwa.installPending && !pwa.isRunningStandalone) {
          <div class="text">
            <p>
              Looks like your browser supports
              <a
                class="link"
                href="https://en.wikipedia.org/wiki/Progressive_web_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="link-inner">Progressive Web Apps</span>
                <fa-icon [icon]="iconLink" />
              </a>
            </p>
            <p>Install this app on your device for a better experience.</p>
          </div>
        }
        @if (pwa.promptEvent && !pwa.isRunningStandalone) {
          @if (!pwa.installPending) {
            <app-btn class="success-btn" (click)="install(pwa)">
              Install now
            </app-btn>
            <app-btn class="dismiss-btn" (click)="dismiss()">
              Do not show again
            </app-btn>
          }
          @if (pwa.installPending) {
            <div class="text">
              <p>Installing...</p>
              <p>Follow the instructions of your browser</p>
            </div>
          }
        }
        @if (pwa.isRunningStandalone) {
          <div class="text success">App successfully installed!</div>
        }
        @if (!pwa.promptEvent && !pwa.isRunningStandalone) {
          <div class="text">Install prompt not available</div>
          <div class="text">Open your browser menu to install the app</div>
          <app-btn class="dismiss-btn" (click)="dismiss()">
            Do not show again
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
        font-size: 1.8rem;
      }

      .text {
        text-align: center;
        color: var(--color-text);
        line-height: 1.6;
      }

      .text.success {
        color: var(--color-success);
        font-size: 1.3rem;
        font-weight: bold;
      }

      .link {
        white-space: nowrap;
        cursor: pointer;
        color: inherit;
      }

      .link-inner {
        text-decoration: underline;
        margin-right: var(--space-xs);
      }

      .link fa-icon {
        font-size: 0.9rem;
      }

      app-btn {
        width: 220px;
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
  protected readonly iconLink = faUpRightFromSquare;

  protected dismiss(): void {
    this.app.patchState({ dismissPwa: Date.now() });
    this.router.navigate(['/']).catch();
  }

  protected async install(pwa: PwaUpdateState): Promise<void> {
    if (!pwa.promptEvent) return;
    pwa.promptEvent.prompt();
    this.pwa.patchState({ installPending: true });
    const choice = await pwa.promptEvent.userChoice;
    if (choice.outcome === 'accepted') this.pwa.updateIsRunningStandalone();
    else this.pwa.patchState({ installPending: false });
  }
}
