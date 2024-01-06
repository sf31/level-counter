import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Player } from '../types';
import { NgIf } from '@angular/common';
import { AppService } from '../app.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [NgIf, FontAwesomeModule],
  template: `
    <div class="player" *ngIf="player">
      <div class="band" [style.background-color]="player.color"></div>
      <div class="left">
        <div class="name">{{ player.name }}</div>
        <div class="gender" (click)="toggleGender()">{{ player.gender }}</div>
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
        background-color: #8d6e63;
        color: #fff;
        display: flex;
        justify-content: space-between;
        //padding: 1rem 2rem;
        margin: 1rem;
        border-radius: 0.5rem;
        align-items: center;
        box-shadow:
          0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
        font-size: 1.5rem;
        overflow: hidden;
      }

      .band {
        width: 1.5rem;
        height: 120px;
      }

      fa-icon {
        font-size: 2.5rem;
        padding: 0 1rem;
      }

      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
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
}
