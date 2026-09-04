import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Player } from '../../types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gender',
  imports: [FontAwesomeModule],
  template: `
    <button
      class="gender-btn"
      type="button"
      [attr.aria-label]="genderLabel()"
      (click)="toggle.emit()"
    >
      <span class="icon-wrap" [class.appear]="appearing()">
        <fa-icon
          [icon]="player().gender === 'M' ? iconMale : iconFemale"
          aria-hidden="true"
        />
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        width: fit-content;
      }

      .gender-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--touch-target);
        height: var(--touch-target);
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.6rem;
        background-color: rgba(255, 255, 255, 0.15);
        transition: background-color var(--duration-fast);
      }

      .gender-btn:active {
        background-color: rgba(255, 255, 255, 0.28);
      }

      .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon-wrap.appear {
        animation: gender-appear var(--duration-normal) ease-out;
      }

      @keyframes gender-appear {
        from {
          transform: scale(0.4) rotate(-30deg);
          opacity: 0;
        }
        to {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderComponent {
  readonly player = input.required<Player>();
  readonly toggle = output<void>();

  protected readonly appearing = signal(false);
  protected readonly iconMale = faMars;
  protected readonly iconFemale = faVenus;

  constructor() {
    const destroyRef = inject(DestroyRef);
    let initialized = false;
    let previousGender: string | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    effect(() => {
      const gender = this.player().gender;
      if (!initialized) {
        initialized = true;
        previousGender = gender;
        return;
      }
      if (gender === previousGender) return;
      previousGender = gender;
      if (timer !== null) clearTimeout(timer);
      this.appearing.set(true);
      timer = setTimeout(() => {
        this.appearing.set(false);
        timer = null;
      }, 200);
    });

    destroyRef.onDestroy(() => {
      if (timer !== null) clearTimeout(timer);
    });
  }

  protected genderLabel(): string {
    const isMale = this.player().gender === 'M';
    return isMale
      ? $localize`Gender: male. Switch to female`
      : $localize`Gender: female. Switch to male`;
  }
}
