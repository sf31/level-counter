import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Player } from '../types';
import { NgIf } from '@angular/common';
import { AppService } from '../app.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { GenderComponent } from './gender.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [NgIf, FontAwesomeModule, GenderComponent],
  template: `
    <div class="player" *ngIf="player" (contextmenu)="removePlayer()">
      <div class="band" [style.background-color]="player.color"></div>
      <div class="left ">
        <div class="name text-ellipsis">{{ player.name }}</div>
        <div class="gender">
          <app-gender (click)="toggleGender()" [player]="player" />
        </div>
      </div>
      <div class="right">
        <fa-icon (click)="increment()" [icon]="iconPlus" />
        <div class="level">{{ player.level }}</div>
        <fa-icon (click)="decrement()" [icon]="iconMinus" />
      </div>
    </div>
  `,
  styles: [
    `
      .player {
        display: grid;
        grid-template-columns: 20px 1fr auto;
        background-color: #8d6e63;
        margin: 1rem;
        border-radius: var(--border-radius-1);
        font-size: 1.5rem;
        overflow: hidden;
        color: #fff;
        box-shadow:
          0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
      }

      fa-icon {
        font-size: 2.7rem;
        padding: 0 1rem;
      }

      .left {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  @Input() player?: Player;

  iconPlus = faCaretUp;
  iconMinus = faCaretDown;

  constructor(private app: AppService) {}

  increment(): void {
    if (!this.player) return;
    this.app.updatePlayer({ ...this.player, level: this.player.level + 1 });
  }

  decrement(): void {
    if (!this.player) return;
    if (this.player.level <= 1) return;
    this.app.updatePlayer({ ...this.player, level: this.player.level - 1 });
  }

  toggleGender(): void {
    if (!this.player) return;
    const gender = this.player.gender === 'M' ? 'F' : 'M';
    this.app.updatePlayer({ ...this.player, gender });
  }

  removePlayer(): void {
    if (!this.player) return;
    this.app.removePlayer(this.player);
  }
}
