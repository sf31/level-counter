import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BtnComponent } from '../../shared/components/btn.component';
import { AsyncPipe } from '@angular/common';
import { PwaService } from '../../core/services/pwa.service';
import { AppService } from '../../core/services/app.service';
import {
  SelectComponent,
  SelectOption,
} from '../../shared/components/select.component';
import {
  detectPwaInstallGuide,
  PWA_INSTALL_GUIDES,
} from '../../core/utils/pwa.utils';

@Component({
  selector: 'app-pwa',
  imports: [BtnComponent, AsyncPipe, SelectComponent],
  template: `
    @if (pwa$ | async; as pwa) {
      <div class="content">
        <div class="text intro">
          <p i18n>Keep LevelCounter on your home screen and use it offline.</p>
        </div>
        @if (pwa.installStatus === 'available') {
          <app-btn class="success-btn" (click)="install()">
            <ng-container i18n>Install LevelCounter</ng-container>
          </app-btn>
          <app-btn class="dismiss-btn" (click)="dismiss()">
            <ng-container i18n>Hide install reminder</ng-container>
          </app-btn>
        } @else if (pwa.installStatus === 'prompting') {
          <div class="text" role="status">
            <p i18n>Installing...</p>
            <p i18n>Follow the instructions from your browser.</p>
          </div>
        } @else if (pwa.installStatus === 'installed') {
          <div class="text success" role="status">
            <p i18n>LevelCounter is installed.</p>
            <p i18n>Open it from your home screen whenever you need it.</p>
          </div>
        } @else {
          @if (pwa.installStatus === 'error' && pwa.installError) {
            <div class="text error" role="alert">{{ pwa.installError }}</div>
          } @else if (pwa.installStatus === 'dismissed') {
            <div class="text" i18n>
              Installation was canceled. You can install it later from your
              browser menu.
            </div>
          }

          <div class="manual-install">
            <section class="text" aria-labelledby="recommended-guide">
              <h1 id="recommended-guide">{{ installGuide.title }}</h1>
              <ol>
                @for (step of installGuide.steps; track $index) {
                  <li>{{ step }}</li>
                }
              </ol>
            </section>

            <app-select
              class="guide-select"
              controlId="install-guide"
              [label]="guideSelectLabel"
              [options]="installGuideOptions"
              [value]="installGuide.id"
              (valueChange)="selectInstallGuide($event)"
            />
          </div>
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
        justify-content: flex-start;
        padding: var(--space-xl) var(--space-md);
        gap: var(--space-md);
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
        width: min(440px, 100%);
        color: var(--color-text-muted);
      }

      .manual-install h1 {
        margin: 0;
        color: var(--color-text);
        font-size: var(--font-size-subtitle);
      }

      .manual-install ol {
        margin: var(--space-sm) 0 0;
        padding-left: var(--space-md);
        text-align: left;
      }

      .manual-install li + li {
        margin-top: var(--space-sm);
      }

      .guide-select {
        margin-top: var(--space-xl);
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

  protected readonly pwa$ = this.pwa.state$;
  protected readonly guideSelectLabel = $localize`Different browser or device?`;
  protected installGuide = detectPwaInstallGuide(
    navigator.userAgent,
    navigator.platform,
    navigator.maxTouchPoints,
  );
  protected readonly installGuideOptions: readonly SelectOption[] =
    PWA_INSTALL_GUIDES.map((guide) => ({
      value: guide.id,
      label: guide.title,
    }));

  protected selectInstallGuide(selectedId: string): void {
    const selectedGuide = PWA_INSTALL_GUIDES.find(
      (guide) => guide.id === selectedId,
    );

    if (selectedGuide) this.installGuide = selectedGuide;
  }

  protected dismiss(): void {
    this.app.patchState({ dismissPwa: Date.now() });
    this.router.navigate(['/'], { replaceUrl: true }).catch();
  }

  protected install(): void {
    void this.pwa.install();
  }
}
