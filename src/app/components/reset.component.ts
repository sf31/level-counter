import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';
import { BtnComponent } from './btn.component';
import { Router, RouterLink } from '@angular/router';
import { ScreenTitleComponent } from './screen-title.component';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [BtnComponent, RouterLink, ScreenTitleComponent],
  template: `
    <app-screen-title title="Reset Levels & Gears" />
    <div class="text">
      <p>This will reset all levels and gears for all players</p>
      <p>Are you sure?</p>
    </div>
    <div class="actions">
      <app-btn routerLink=""> Back </app-btn>
      <app-btn (click)="reset()"> Confirm </app-btn>
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

      .text {
        text-align: center;
        color: #fff;
        margin: 1rem 0;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
      }

      app-btn {
        width: 100px;
      }

      .actions app-btn:last-child {
        background-color: #43a047;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetComponent {
  constructor(
    private app: AppService,
    private router: Router,
  ) {}

  reset(): void {
    this.app.resetPlayers();
    this.router.navigate(['']).catch();
  }
}
