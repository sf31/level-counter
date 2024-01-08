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
    <div
      class="player shadow"
      [style.background-color]="player.color"
      *ngIf="player"
    >
      <div class="left">
        <app-plus-minus
          label="gear"
          [value]="player.equipment"
          (plus)="onChangeEquipment(1)"
          (minus)="onChangeEquipment(-1)"
        />
        <div class="label">Gear</div>
      </div>

      <div class="central">
        <div class="name text-ellipsis">{{ player.name }}</div>
        <div class="central-inner">
          <app-gender (click)="toggleGender()" [player]="player" />
          <div class="fill-remaining-space"></div>
          <div class="total">
            {{ player.level + player.equipment }}
          </div>
          <div class="label">Strength</div>
        </div>
      </div>

      <div class="right">
        <app-plus-minus
          label="level"
          [value]="player.level"
          (plus)="onChangeLevel(1)"
          (minus)="onChangeLevel(-1)"
        />
        <div class="label">Level</div>
      </div>
    </div>
  `,
  styles: [
    `
      .player {
        display: grid;
        grid-template-columns: auto 1fr auto;
        //background-color: #8d6e63;
        border-radius: var(--border-radius-1);
        overflow: hidden;
        color: #fff;
        padding: 0.5rem;
        gap: 0.5rem;
      }

      .central {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .central-inner {
        flex: 1 1 auto;
        padding-top: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .name,
      .total {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
      }

      .total {
        font-size: 2.5rem;
      }

      .fill-remaining-space {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  @Input() player?: Player;

  constructor(private app: AppService) {}

  onChangeLevel(delta: number): void {
    if (!this.player) return;
    const level = this.player.level + delta;
    if (level >= 1) this.app.updatePlayer({ ...this.player, level });
  }

  onChangeEquipment(delta: number): void {
    if (!this.player) return;
    const equipment = this.player.equipment + delta;
    if (equipment >= 0) this.app.updatePlayer({ ...this.player, equipment });
  }

  toggleGender(): void {
    if (!this.player) return;
    const gender = this.player.gender === 'M' ? 'F' : 'M';
    this.app.updatePlayer({ ...this.player, gender });
  }
}
