import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Player } from '../../types';
import { GenderComponent } from '../../shared/components/gender.component';
import { PlusMinusComponent } from '../../shared/components/plus-minus.component';

@Component({
  selector: 'app-player',
  imports: [GenderComponent, PlusMinusComponent],
  template: `
    <div class="player shadow" [style.background-color]="player().color">
      <div class="side">
        <app-plus-minus
          label="gear"
          [value]="player().gears"
          (plus)="onChangeEquipment(1)"
          (minus)="onChangeEquipment(-1)"
        />
        <div class="label" i18n>Gear</div>
      </div>
      <div class="center">
        <div class="name text-ellipsis">{{ player().name }}</div>
        <div class="center-inner">
          <app-gender [player]="player()" (toggle)="toggleGender()" />
          <div class="fill-remaining-space"></div>
          <div class="strength" [class.bump]="strengthBumping()">
            {{ strength() }}
          </div>
          <div class="label" i18n>Strength</div>
        </div>
      </div>
      <div class="side">
        <app-plus-minus
          label="level"
          [value]="player().level"
          (plus)="onChangeLevel(1)"
          (minus)="onChangeLevel(-1)"
        />
        <div class="label" i18n>Level</div>
      </div>
    </div>
  `,
  styles: [
    `
      .player {
        display: grid;
        grid-template-columns: auto 1fr auto;
        border-radius: var(--border-radius-2);
        border: var(--border-width) solid rgba(255, 255, 255, 0.24);
        box-shadow:
          inset 0 var(--border-width) 0 rgba(255, 255, 255, 0.2),
          var(--shadow-raised);
        overflow: hidden;
        color: var(--color-text);
        padding: var(--space-sm) var(--space-md);
        gap: var(--space-sm);
      }

      .side {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .center {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .center-inner {
        flex: 1 1 auto;
        padding-top: var(--space-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .name {
        font-size: var(--font-size-page-title);
        font-weight: var(--font-weight-heavy);
        text-align: center;
      }

      .strength {
        font-size: var(--font-size-hero);
        font-weight: var(--font-weight-heavy);
        text-align: center;
      }

      .strength.bump {
        animation: bump var(--duration-slow) ease-out;
      }

      @keyframes bump {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.4);
        }
        100% {
          transform: scale(1);
        }
      }

      .label {
        font-size: var(--font-size-caption);
        font-weight: var(--font-weight-strong);
        color: var(--color-player-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
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

  protected readonly strength = computed(
    () => this.player().level + this.player().gears,
  );
  protected readonly strengthBumping = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    let initialized = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    effect(() => {
      this.strength();
      if (!initialized) {
        initialized = true;
        return;
      }
      if (timer !== null) clearTimeout(timer);
      this.strengthBumping.set(true);
      timer = setTimeout(() => {
        this.strengthBumping.set(false);
        timer = null;
      }, 250);
    });

    destroyRef.onDestroy(() => {
      if (timer !== null) clearTimeout(timer);
    });
  }

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
