import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { OverlayComponent } from './overlay.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { randomIntFromInterval } from '../../core/utils/app.utils';

@Component({
  selector: 'app-dice-dialog',
  imports: [OverlayComponent, FontAwesomeModule],
  template: `
    <app-overlay (close)="close.emit()">
      <div class="dice-content" (click)="roll()">
        <div class="dice-label" role="status" aria-live="polite">
          @if (isRolling()) {
            Rolling…
          } @else if (currentFace(); as face) {
            Rolled {{ face }} · Tap to roll again
          } @else {
            Tap to roll
          }
        </div>
        <div
          class="dice"
          [class.rolling]="isRolling()"
          [attr.aria-busy]="isRolling()"
        >
          <div class="face f-{{ currentFace() }}">
            @if (currentFace() === null) {
              <div class="no-face">
                <fa-icon [icon]="noFaceIcon" />
              </div>
            }
            @if (currentFace(); as face) {
              @for (item of [].constructor(face); track $index) {
                <div class="dot"></div>
              }
            }
          </div>
        </div>
        <div
          class="dice-close"
          (click)="close.emit(); $event.stopPropagation()"
        >
          Close
        </div>
      </div>
    </app-overlay>
  `,
  styles: [
    `
      .dice-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-lg);
        padding: var(--space-md) 0;
        cursor: pointer;
      }

      .dice-label {
        font-size: var(--font-size-subtitle);
        color: var(--color-text-muted);
      }

      .no-face {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--font-size-display);
      }

      .dice.rolling {
        animation: dice-roll 350ms ease-in-out 2;
      }

      @keyframes dice-roll {
        to {
          transform: rotate(1turn);
        }
      }

      .face {
        width: 110px;
        height: 110px;
        background-color: var(--color-dice-surface);
        display: grid;
        border-radius: var(--border-radius-2);
      }

      .dot {
        justify-self: center;
        align-self: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: var(--color-dice-dot);
      }

      .f-1 {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
      }

      .f-2 {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:last-child {
          grid-column: 2;
          grid-row: 2;
        }
      }

      .f-3 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:nth-child(2) {
          grid-column: 2;
          grid-row: 2;
        }
        & > .dot:last-child {
          grid-column: 3;
          grid-row: 3;
        }
      }

      .f-4 {
        grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
      }

      .f-5 {
        grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:nth-child(2) {
          grid-column: 3;
          grid-row: 1;
        }
        & > .dot:nth-child(3) {
          grid-column: 2;
          grid-row: 2;
        }
        & > .dot:nth-child(4) {
          grid-column: 1;
          grid-row: 3;
        }
        & > .dot:last-child {
          grid-column: 3;
          grid-row: 3;
        }
      }

      .f-6 {
        grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:nth-child(2) {
          grid-column: 3;
          grid-row: 1;
        }
        & > .dot:nth-child(3) {
          grid-column: 1;
          grid-row: 2;
        }
        & > .dot:nth-child(4) {
          grid-column: 3;
          grid-row: 2;
        }
        & > .dot:nth-child(5) {
          grid-column: 1;
          grid-row: 3;
        }
        & > .dot:last-child {
          grid-column: 3;
          grid-row: 3;
        }
      }

      .dice-close {
        color: var(--color-text-muted);
        font-size: var(--font-size-body);
        cursor: pointer;
        padding: var(--space-sm) var(--space-lg);
      }

      @media (prefers-reduced-motion: reduce) {
        .dice.rolling {
          animation: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiceDialogComponent implements OnDestroy {
  readonly close = output<void>();

  protected readonly currentFace = signal<number | null>(null);
  protected readonly isRolling = signal(false);
  protected readonly noFaceIcon = faQuestion;

  private rollTimer: ReturnType<typeof setInterval> | null = null;

  protected roll(): void {
    if (this.isRolling()) return;

    this.isRolling.set(true);
    this.currentFace.set(randomIntFromInterval(1, 6));
    let rollsRemaining = 10;
    this.rollTimer = setInterval(() => {
      this.currentFace.set(randomIntFromInterval(1, 6));
      rollsRemaining -= 1;
      if (rollsRemaining === 0) {
        this.finishRoll();
      }
    }, 70);
  }

  ngOnDestroy(): void {
    this.finishRoll();
  }

  private finishRoll(): void {
    if (this.rollTimer !== null) {
      clearInterval(this.rollTimer);
      this.rollTimer = null;
    }
    this.isRolling.set(false);
  }
}
