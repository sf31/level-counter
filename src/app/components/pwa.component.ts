import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BtnComponent } from './btn.component';
import { ScreenTitleComponent } from './screen-title.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PwaUpdateState } from '../types';
import { Observable } from 'rxjs';
import { PwaService } from '../pwa.service';
import { AppService } from '../app.service';
import { BackBtnComponent } from './back-btn.component';

@Component({
  selector: 'app-pwa',
  standalone: true,
  imports: [
    BtnComponent,
    ScreenTitleComponent,
    RouterLink,
    NgIf,
    AsyncPipe,
    JsonPipe,
    FontAwesomeModule,
    BackBtnComponent,
  ],
  template: `
    <ng-container *ngIf="pwa$ | async as pwa">
      <app-screen-title title="PWA support detected!" />
      <ng-container *ngIf="!pwa.installPending && !pwa.isRunningStandalone">
        <div class="text">
          <p>
            Looks like your browser supports
            <span class="link" (click)="openLink()">
              <span class="link-inner">Progressive Web Apps</span>
              <fa-icon [icon]="iconLink" />
            </span>
          </p>

          <p *ngIf="!pwa.isRunningStandalone">
            Install this app on your device for a better experience.
          </p>
        </div>
      </ng-container>

      <ng-container *ngIf="pwa.promptEvent && !pwa.isRunningStandalone">
        <ng-container *ngIf="!pwa.installPending">
          <app-btn class="success-btn" (click)="install(pwa)">
            Install now
          </app-btn>
          <app-btn class="dismiss" (click)="dismiss()">
            Do not show again
          </app-btn>
        </ng-container>

        <div class="text" *ngIf="pwa.installPending">
          <p>Installing...</p>
          <p>Follow the instructions of your browser</p>
        </div>
      </ng-container>

      <div class="text success" *ngIf="pwa.isRunningStandalone">
        App successfully installed!
      </div>

      <ng-container *ngIf="!pwa.promptEvent">
        <ng-container *ngIf="!pwa.isRunningStandalone">
          <div class="text">Install prompt not available</div>
          <div class="text">Open your browser menu to install the app</div>
          <app-btn class="dismiss" (click)="dismiss()">
            Do not show again
          </app-btn>
        </ng-container>
      </ng-container>
      <app-back-btn route="" />
    </ng-container>
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
