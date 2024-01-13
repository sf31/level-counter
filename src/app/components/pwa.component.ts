import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BtnComponent } from './btn.component';
import { ScreenTitleComponent } from './screen-title.component';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

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
  ],
  template: `
    <!--    TODO-->
    <!--    <app-screen-title title="Settings" />-->
    <!--    <ng-container *ngIf="settingsActions | async as actions">-->
    <!--      <app-btn [class.done]="actions.reset" (click)="reset()">-->
    <!--        {{ actions.reset ? 'Done!' : 'Reset Levels & Gears' }}-->
    <!--      </app-btn>-->
    <!--      <app-btn [class.done]="actions.removeAll" (click)="removePlayers()">-->
    <!--        {{ actions.removeAll ? 'Players removed!' : 'Remove All Players' }}-->
    <!--      </app-btn>-->

    <!--      &lt;!&ndash; TODO refactor this...  &ndash;&gt;-->
    <!--      <div class="pwa" *ngIf="pwaState | async as pwa">-->
    <!--        <app-btn-->
    <!--          *ngIf="pwa.promptEvent && !pwa.isRunningStandalone"-->
    <!--          (click)="install(pwa)"-->
    <!--        >-->
    <!--          {{ pwa.installPending ? 'Installing...' : 'Install App' }}-->
    <!--        </app-btn>-->

    <!--        <app-btn *ngIf="pwa.isRunningStandalone">-->
    <!--          {{ pwa.installPending ? 'Installing...' : 'Install App' }}-->
    <!--        </app-btn>-->

    <!--        <app-btn-->
    <!--          class="install"-->
    <!--          *ngIf="pwa.updateAvailable; else installTmpl"-->
    <!--          (click)="reload()"-->
    <!--        >-->
    <!--          Update available! Tap to install-->
    <!--        </app-btn>-->
    <!--        <ng-template #installTmpl>-->
    <!--          <app-btn-->
    <!--            *ngIf="-->
    <!--              pwa.promptEvent && !pwa.isRunningStandalone && !actions.updated-->
    <!--            "-->
    <!--            (click)="install(pwa)"-->
    <!--          >-->
    <!--            {{ pwa.installPending ? 'Installing...' : 'Install App' }}-->
    <!--          </app-btn>-->
    <!--        </ng-template>-->
    <!--        <app-btn [class.done]="actions.updated" *ngIf="actions.updated">-->
    <!--          Updated!-->
    <!--        </app-btn>-->
    <!--      </div>-->

    <!--      <div class="actions">-->
    <!--        <app-btn routerLink=""> Back </app-btn>-->
    <!--      </div>-->
    <!--    </ng-container>-->
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaComponent {}
