import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router, RouterLink } from '@angular/router';
import { BtnComponent } from './btn.component';
import { ScreenTitleComponent } from './screen-title.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { PwaUpdateState } from '../types';

type SettingActions = {
  reset: boolean;
  removeAll: boolean;
  updated: boolean;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    BtnComponent,
    ScreenTitleComponent,
    RouterLink,
    NgIf,
    AsyncPipe,
    JsonPipe,
  ],
  template: `
    <app-screen-title title="Settings" />
    <ng-container *ngIf="settingsActions | async as actions">
      <app-btn [class.done]="actions.reset" (click)="reset()">
        {{ actions.reset ? 'Done!' : 'Reset Levels & Gears' }}
      </app-btn>

      <!-- TODO refactor this...  -->
      <div class="pwa" *ngIf="pwaState | async as pwa">
        <app-btn
          *ngIf="pwa.promptEvent && !pwa.isRunningStandalone"
          (click)="install(pwa)"
        >
          {{ pwa.installPending ? 'Installing...' : 'Install App' }}
        </app-btn>

        <app-btn *ngIf="pwa.isRunningStandalone">
          {{ pwa.installPending ? 'Installing...' : 'Install App' }}
        </app-btn>

        <app-btn
          class="install"
          *ngIf="pwa.updateAvailable; else installTmpl"
          (click)="reload()"
        >
          Update available! Tap to install
        </app-btn>
        <ng-template #installTmpl>
          <app-btn
            *ngIf="
              pwa.promptEvent && !pwa.isRunningStandalone && !actions.updated
            "
            (click)="install(pwa)"
          >
            {{ pwa.installPending ? 'Installing...' : 'Install App' }}
          </app-btn>
        </ng-template>
        <app-btn [class.done]="actions.updated" *ngIf="actions.updated">
          Updated!
        </app-btn>
      </div>

      <div class="actions">
        <app-btn routerLink=""> Back </app-btn>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
      }

      app-btn {
        width: 330px;
      }

      .actions {
        display: flex;
        padding-top: 2rem;
        width: 100px;
      }

      .done,
      .install {
        background-color: #43a047;
      }

      .pwa {
        margin-top: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  settingsActions = new BehaviorSubject<SettingActions>({
    reset: false,
    removeAll: false,
    updated: false,
  });

  pwaState: Observable<PwaUpdateState> = this.app.getPwaState$();

  constructor(
    private app: AppService,
    private router: Router,
  ) {}

  reset(): void {
    this.app.resetPlayers();
    this.processSetting('reset');
  }

  processSetting(target: keyof SettingActions): void {
    if (this.settingsActions.getValue()[target]) return;
    this.setAction(target, true);
    setTimeout(() => this.setAction(target, false), 1500);
  }

  install(pwa: PwaUpdateState): void {
    pwa.promptEvent?.prompt();
    this.app.patchPwaState({ installPending: true });
  }

  reload(): void {
    this.setAction('updated', true);
    setTimeout(() => {
      this.setAction('updated', false);
      window.location.reload();
    }, 1000);
  }

  private setAction(target: keyof SettingActions, value: boolean): void {
    const payload: SettingActions = {
      ...this.settingsActions.getValue(),
      [target]: value,
    };
    this.settingsActions.next(payload);
  }
}
