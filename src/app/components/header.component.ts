import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';
import { RouterLink } from '@angular/router';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCog,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { BtnComponent } from './btn.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CdkMenuTrigger,
    FontAwesomeModule,
    CdkMenu,
    CdkMenuItem,
    BtnComponent,
    NgIf,
  ],
  template: `
    <div class="row">
      <app-btn routerLink="add-player"> Add Player</app-btn>
      <app-btn (click)="showSettings = !showSettings"> Settings</app-btn>
    </div>

    <div class="settings row" *ngIf="showSettings">
      <app-btn (click)="reset()"> Reset Levels </app-btn>
      <!--      <app-btn (click)="removeAllPlayers()"> Remove All Players </app-btn>-->
    </div>
  `,
  styles: [
    `
      .row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
      }

      .menu {
        background-color: #9e9e9e;
        border-radius: var(--border-radius-1);
      }

      .menu > div {
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  iconSettings = faCog;
  iconAddPlayer = faUserPlus;
  iconRemovePlayer = faUserMinus;
  showSettings = false;
  constructor(private app: AppService) {}

  reset(): void {
    this.app.resetPlayers();
    this.showSettings = false;
  }
  removeAllPlayers(): void {
    this.app.removeAllPlayers();
    this.showSettings = false;
  }
}
