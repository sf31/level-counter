import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';
import { RouterLink } from '@angular/router';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CdkMenuTrigger,
    FontAwesomeModule,
    CdkMenu,
    CdkMenuItem,
  ],
  template: `
    <div routerLink="add-player">Add Player</div>
    <fa-icon [icon]="iconSettings" [cdkMenuTriggerFor]="menu" />

    <ng-template #menu>
      <div class="menu shadow" cdkMenu>
        <div (click)="reset()" cdkMenuItem>Reset levels</div>
        <div (click)="removeAllPlayers()" cdkMenuItem>Remove All Players</div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: space-between;
        background-color: #9e9e9e;
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
  constructor(private app: AppService) {}

  reset(): void {
    this.app.resetPlayers();
  }
  removeAllPlayers(): void {
    this.app.removeAllPlayers();
  }
}
