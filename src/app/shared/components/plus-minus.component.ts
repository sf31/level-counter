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
    <fa-icon (click)="plus.emit()" [icon]="iconPlus" />
    <div class="value" [class.bump]="bumping()">{{ value() }}</div>
    <fa-icon (click)="minus.emit()" [icon]="iconMinus" />
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

      fa-icon {
        cursor: pointer;
        padding: var(--space-sm);
        font-size: var(--font-size-display);
        min-width: var(--touch-target);
        min-height: var(--touch-target);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      fa-icon:active {
        opacity: 0.7;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMinusComponent {
  value = input<string | number>();
  label = input<string>();
  plus = output<void>();
  minus = output<void>();

  protected readonly bumping = signal(false);

  iconMinus = faCaretDown;
  iconPlus = faCaretUp;

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
