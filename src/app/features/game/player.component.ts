import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Player } from '../../types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GenderComponent } from '../../shared/components/gender.component';
import { PlusMinusComponent } from '../../shared/components/plus-minus.component';

@Component({
  selector: 'app-player',
  imports: [FontAwesomeModule, GenderComponent, PlusMinusComponent],
  template: `
    <div class="player shadow" [style.background-color]="player().color">
      <div class="left">
        <app-plus-minus
          label="gear"
          [value]="player().gears"
          (plus)="onChangeEquipment(1)"
          (minus)="onChangeEquipment(-1)"
        />
        <div class="label">Gear</div>
      </div>
      <div class="central">
        <div class="name text-ellipsis">{{ player().name }}</div>
        <div class="central-inner">
          <app-gender (click)="toggleGender()" [player]="player()" />
          <div class="fill-remaining-space"></div>
          <div class="total">
            {{ player().level + player().gears }}
          </div>
          <div class="label">Strength</div>
        </div>
      </div>
      <div class="right">
        <app-plus-minus
          label="level"
          [value]="player().level"
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
  player = input.required<Player>();
  playerChange = output<Player>();

  onChangeLevel(delta: number): void {
    const level = this.player().level + delta;
    if (level >= 1) this.playerChange.emit({ ...this.player(), level });
  }

  onChangeEquipment(delta: number): void {
    const gears = this.player().gears + delta;
    if (gears >= 0) this.playerChange.emit({ ...this.player(), gears });
  }

  toggleGender(): void {
    const gender = this.player().gender === 'M' ? 'F' : 'M';
    this.playerChange.emit({ ...this.player(), gender });
  }
}
