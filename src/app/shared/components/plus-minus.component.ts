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
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-plus-minus',
  imports: [FontAwesomeModule],
  template: `
    <button
      type="button"
      [attr.aria-label]="increaseLabel()"
      (click)="plus.emit()"
    >
      <fa-icon [icon]="iconPlus" aria-hidden="true" />
    </button>
    <div
      class="value"
      role="status"
      aria-live="polite"
      [class.bump]="bumping()"
      [attr.aria-label]="valueLabel()"
    >
      {{ value() }}
    </div>
    <button
      type="button"
      [attr.aria-label]="decreaseLabel()"
      (click)="minus.emit()"
    >
      <fa-icon [icon]="iconMinus" aria-hidden="true" />
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .value {
        font-size: var(--font-size-page-title);
        font-weight: var(--font-weight-strong);
      }

      .value.bump {
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

      button {
        cursor: pointer;
        padding: var(--space-sm);
        font-size: var(--font-size-display);
        min-width: var(--touch-target);
        min-height: var(--touch-target);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        background: none;
        color: inherit;
      }

      button:active {
        opacity: 0.7;
      }

      button:focus-visible {
        outline: var(--border-width-strong) solid currentColor;
        border-radius: var(--border-radius-1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMinusComponent {
  value = input.required<string | number>();
  label = input.required<string>();
  plus = output<void>();
  minus = output<void>();

  protected readonly bumping = signal(false);

  iconMinus = faCaretDown;
  iconPlus = faCaretUp;

  protected increaseLabel(): string {
    return this.label() === 'gear'
      ? $localize`Increase gear`
      : $localize`Increase level`;
  }

  protected decreaseLabel(): string {
    return this.label() === 'gear'
      ? $localize`Decrease gear`
      : $localize`Decrease level`;
  }

  protected valueLabel(): string {
    return this.label() === 'gear'
      ? $localize`Gear: ${this.value()}:value:`
      : $localize`Level: ${this.value()}:value:`;
  }

  constructor() {
    const destroyRef = inject(DestroyRef);
    let initialized = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    effect(() => {
      this.value();
      if (!initialized) {
        initialized = true;
        return;
      }
      if (timer !== null) clearTimeout(timer);
      this.bumping.set(true);
      timer = setTimeout(() => {
        this.bumping.set(false);
        timer = null;
      }, 250);
    });

    destroyRef.onDestroy(() => {
      if (timer !== null) clearTimeout(timer);
    });
  }
}
