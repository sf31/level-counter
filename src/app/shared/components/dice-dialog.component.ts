import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  output,
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
        <div class="dice-label">Tap to roll</div>
        <div class="dice">
          <div class="face f-{{ currentFace }}">
            @if (currentFace === null) {
              <div class="no-face">
                <fa-icon [icon]="noFaceIcon" />
              </div>
            }
            @if (currentFace) {
              @for (item of [].constructor(currentFace); track $index) {
                <div class="dot"></div>
              }
            }
          </div>
        </div>
        <div class="dice-close" (click)="close.emit(); $event.stopPropagation()">
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
        font-size: 1.3rem;
        color: var(--color-text-muted);
      }

      .no-face {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.5rem;
      }

      .face {
        width: 110px;
        height: 110px;
        background-color: #fff;
        display: grid;
        border-radius: 12px;
      }

      .dot {
        justify-self: center;
        align-self: center;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: #000;
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
        font-size: 1.1rem;
        cursor: pointer;
        padding: var(--space-sm) var(--space-lg);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiceDialogComponent implements OnDestroy {
  close = output<void>();

  currentFace: number | null = null;
  rollTimer: ReturnType<typeof setTimeout> | null = null;
  noFaceIcon = faQuestion;

  roll(): void {
    if (this.rollTimer !== null) return;
    let runs = 10;
    this.rollTimer = setInterval(() => {
      this.currentFace = randomIntFromInterval(1, 6);
      if (runs-- === 0) {
        if (this.rollTimer !== null) clearInterval(this.rollTimer);
        this.rollTimer = null;
      }
    }, 70);
  }

  ngOnDestroy(): void {
    if (this.rollTimer !== null) {
      clearInterval(this.rollTimer);
      this.rollTimer = null;
    }
  }
}
