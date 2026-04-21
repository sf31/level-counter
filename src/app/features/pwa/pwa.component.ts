import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BtnComponent } from '../../shared/components/btn.component';
import { ScreenTitleComponent } from '../../shared/components/screen-title.component';
import { AsyncPipe } from '@angular/common';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PwaUpdateState } from '../../types';
import { Observable } from 'rxjs';
import { PwaService } from '../../core/services/pwa.service';
import { AppService } from '../../core/services/app.service';
import { BackBtnComponent } from '../../shared/components/back-btn.component';

@Component({
  selector: 'app-pwa',
  imports: [
    BtnComponent,
    ScreenTitleComponent,
    AsyncPipe,
    FontAwesomeModule,
    BackBtnComponent,
  ],
  template: `
    @if (pwa$ | async; as pwa) {
      <app-screen-title title="PWA support detected!" />
      @if (!pwa.installPending && !pwa.isRunningStandalone) {
        <div class="text">
          <p>
            Looks like your browser supports
            <span class="link" (click)="openLink()">
              <span class="link-inner">Progressive Web Apps</span>
              <fa-icon [icon]="iconLink" />
            </span>
          </p>
          @if (!pwa.isRunningStandalone) {
            <p>Install this app on your device for a better experience.</p>
          }
        </div>
      }
      @if (pwa.promptEvent && !pwa.isRunningStandalone) {
        @if (!pwa.installPending) {
          <app-btn class="success-btn" (click)="install(pwa)">
            Install now
          </app-btn>
          <app-btn class="dismiss" (click)="dismiss()">
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
      @if (!pwa.promptEvent) {
        @if (!pwa.isRunningStandalone) {
          <div class="text">Install prompt not available</div>
          <div class="text">Open your browser menu to install the app</div>
          <app-btn class="dismiss" (click)="dismiss()">
            Do not show again
          </app-btn>
        }
      }
      <app-back-btn route="" />
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem;
      }

      .text {
        text-align: center;
        color: #fff;
        &.success {
          margin: 2rem 0;
        }
      }

      .link {
        white-space: nowrap;
      }

      .link-inner {
        text-decoration: underline;
        margin-right: 0.5rem;
      }

      .link fa-icon {
        font-size: 0.9rem;
      }

      app-btn {
        margin-top: 1rem;
        width: 220px;
      }

      app-back-btn {
        margin-top: 1rem;
        width: 150px;
      }

      .success {
        color: #43a047;
      }

      .success-btn {
        background-color: #43a047;
      }

      .dismiss {
        background-color: #455a64;
        position: absolute;
        bottom: 3rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaComponent {
  pwa$: Observable<PwaUpdateState>;
  iconLink = faUpRightFromSquare;

  constructor(
    private app: AppService,
    private pwa: PwaService,
    private router: Router,
  ) {
    this.pwa$ = this.pwa.getState$();
  }

  openLink(): void {
    window.open('https://en.wikipedia.org/wiki/Progressive_web_app', '_blank');
  }

  dismiss(): void {
    this.app.patchState({ dismissPwa: Date.now() });
    this.router.navigate(['']).catch();
  }

  async install(pwa: PwaUpdateState): Promise<void> {
    if (!pwa.promptEvent) return;
    pwa.promptEvent.prompt();
    this.pwa.patchState({ installPending: true });
    const choice = await pwa.promptEvent.userChoice;
    if (choice.outcome === 'accepted') this.pwa.updateIsRunningStandalone();
    else this.pwa.patchState({ installPending: false });
  }
}
