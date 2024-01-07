import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Player } from '../types';
import { NgIf } from '@angular/common';
import { AppService } from '../app.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenderComponent } from './gender.component';
import { PlusMinusComponent } from './plus-minus.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [NgIf, FontAwesomeModule, GenderComponent, PlusMinusComponent],
  template: `
    <div class="player shadow" *ngIf="player" (contextmenu)="removePlayer()">
      <div class="band" [style.background-color]="player.color"></div>
      <div class="left ">
        <div class="name text-ellipsis">{{ player.name }}</div>
        <div class="gender">
          <app-gender (click)="toggleGender()" [player]="player" />
        </div>
      </div>
      <app-plus-minus
        [value]="player.level"
        (plus)="increment()"
        (minus)="decrement()"
      />
    </div>
  `,
  styles: [
    `
      .player {
        display: grid;
        grid-template-columns: 20px 1fr auto;
        background-color: #8d6e63;
        margin: 0.5rem;
        border-radius: var(--border-radius-1);
        overflow: hidden;
        color: #fff;
        padding-right: 0.5rem;
      }

      fa-icon {
        padding: 0 1rem;
      }

      .left {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  @Input() player?: Player;

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
