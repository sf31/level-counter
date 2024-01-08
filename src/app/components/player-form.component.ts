import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BtnComponent } from './btn.component';
import { Router, RouterLink } from '@angular/router';
import { AppService } from '../app.service';
import { PlayerComponent } from './screen-title.component';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [BtnComponent, RouterLink, PlayerComponent],
  template: `
    <div class="form">
      <app-screen-title title="Player name" />
      <input #playerName type="text" />
    </div>
    <div class="actions">
      <app-btn routerLink=""> Back </app-btn>
      <app-btn (click)="addPlayer(playerName.value)"> Add </app-btn>
    </div>
  `,
  styles: [
    `
      .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin: 1rem;
        border-radius: var(--border-radius-1);
        font-size: 1.5rem;
      }

      input {
        font-size: 1.2rem;
        background-color: #a1887f;
        border-radius: var(--border-radius-1);
        padding: 0.5rem;
      }

      .actions {
        display: flex;
        justify-content: space-around;
        margin-top: 2rem;
      }

      app-btn {
        width: 100px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerFormComponent {
  constructor(
    private app: AppService,
    private router: Router,
  ) {}
  addPlayer(playerName: string): void {
    if (!playerName || playerName.length === 0) return;
    this.app.addPlayer(playerName);
    this.router.navigate(['']).catch();
  }
}
