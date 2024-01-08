import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';
import { RouterLink } from '@angular/router';
import { BtnComponent } from './btn.component';
import { PlayerComponent } from './screen-title.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { PwaUpdateState } from '../types';

type SettingActions = {
  reset: boolean;
  removeAll: boolean;
};

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    BtnComponent,
    PlayerComponent,
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
      <app-btn [class.done]="actions.removeAll" (click)="removePlayers()">
        {{ actions.removeAll ? 'Players removed!' : 'Remove All Players' }}
      </app-btn>
    </ng-container>

    <app-btn> Install App</app-btn>

    <div class="debug">
      <pre>{{ pwaState | async | json }}</pre>
    </div>

    <div class="actions">
      <app-btn routerLink=""> Back </app-btn>
    </div>
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
        width: 300px;
      }

      .debug {
        width: 300px;
      }

      .actions {
        display: flex;
        padding-top: 2rem;
        width: 100px;
      }

      .done {
        background-color: #43a047;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  settingsActions = new BehaviorSubject<SettingActions>({
    reset: false,
    removeAll: false,
  });

  pwaState: Observable<PwaUpdateState> = this.app.getPwaState();

  constructor(private app: AppService) {}

  removePlayers(): void {
    this.app.removeAllPlayers();
    this.processSetting('removeAll');
  }

  reset(): void {
    this.app.resetPlayers();
    this.processSetting('reset');
  }

  processSetting(target: keyof SettingActions): void {
    if (this.settingsActions.getValue()[target]) return;
    this.setAction(target, true);
    setTimeout(() => this.setAction(target, false), 1500);
  }

  private setAction(target: keyof SettingActions, value: boolean): void {
    const payload: SettingActions = {
      ...this.settingsActions.getValue(),
      [target]: value,
    };
    this.settingsActions.next(payload);
  }
}