import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { OverlayComponent } from './overlay.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { randomIntFromInterval } from '../../core/utils/app.utils';
import { BtnComponent } from './btn.component';

type ShakeStatus = 'unavailable' | 'permission-required' | 'enabled' | 'denied';

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

@Component({
  selector: 'app-dice-dialog',
  imports: [OverlayComponent, FontAwesomeModule, BtnComponent],
  template: `
    <app-overlay (close)="close.emit()">
      <div class="dice-content" (click)="roll()">
        <div class="dice-label" role="status" aria-live="polite">
          @if (isRolling()) {
            Rolling…
          } @else if (currentFace(); as face) {
            Rolled {{ face }} ·
            {{
              shakeStatus() === 'enabled'
                ? 'Shake or tap again'
                : 'Tap to roll again'
            }}
          } @else if (shakeStatus() === 'enabled') {
            Shake or tap to roll
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
        @if (shakeStatus() === 'permission-required') {
          <app-btn class="shake-permission" (click)="enableShake($event)">
            Enable shake to roll
          </app-btn>
        } @else if (shakeStatus() === 'denied') {
          <div class="dice-label" role="status">
            Shake access unavailable · Tap to roll
          </div>
        }
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
        animation: dice-roll 100ms ease-in-out 12 alternate;
      }

      @keyframes dice-roll {
        from {
          transform: translate(-5px, -2px) rotate(-8deg);
        }
        to {
          transform: translate(5px, -8px) rotate(8deg);
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
export class DiceDialogComponent implements OnInit, OnDestroy {
  readonly close = output<void>();

  protected readonly currentFace = signal<number | null>(null);
  protected readonly isRolling = signal(false);
  protected readonly shakeStatus = signal<ShakeStatus>('unavailable');
  protected readonly noFaceIcon = faQuestion;

  private readonly shakeThreshold = 18;
  private readonly shakeCooldown = 1000;
  private rollTimer: ReturnType<typeof setInterval> | null = null;
  private lastMotionMagnitude: number | null = null;
  private lastShakeAt = 0;

  ngOnInit(): void {
    if (
      typeof DeviceMotionEvent === 'undefined' ||
      navigator.maxTouchPoints === 0
    ) {
      return;
    }

    const motionEvent = DeviceMotionEvent as DeviceMotionEventWithPermission;
    if (motionEvent.requestPermission) {
      this.shakeStatus.set('permission-required');
      return;
    }

    this.startShakeListener();
  }

  protected async enableShake(event: MouseEvent): Promise<void> {
    event.stopPropagation();

    const motionEvent = DeviceMotionEvent as DeviceMotionEventWithPermission;
    try {
      const permission = await motionEvent.requestPermission?.();
      if (permission === 'granted') {
        this.startShakeListener();
      } else {
        this.shakeStatus.set('denied');
      }
    } catch {
      this.shakeStatus.set('denied');
    }
  }

  protected roll(): void {
    if (this.isRolling()) return;

    this.isRolling.set(true);
    this.currentFace.set(randomIntFromInterval(1, 6));
    navigator.vibrate?.([20, 70, 20, 70, 20]);
    let rollsRemaining = 15;
    this.rollTimer = setInterval(() => {
      this.currentFace.set(randomIntFromInterval(1, 6));
      rollsRemaining -= 1;
      if (rollsRemaining === 0) {
        this.finishRoll();
      }
    }, 80);
  }

  ngOnDestroy(): void {
    this.stopRoll();
    window.removeEventListener('devicemotion', this.handleDeviceMotion);
    navigator.vibrate?.(0);
  }

  private readonly handleDeviceMotion = (event: DeviceMotionEvent): void => {
    const acceleration =
      event.acceleration ?? event.accelerationIncludingGravity;
    if (
      !acceleration ||
      acceleration.x === null ||
      acceleration.y === null ||
      acceleration.z === null
    ) {
      return;
    }

    const magnitude = Math.hypot(
      acceleration.x,
      acceleration.y,
      acceleration.z,
    );
    const now = Date.now();

    if (
      this.lastMotionMagnitude !== null &&
      Math.abs(magnitude - this.lastMotionMagnitude) >= this.shakeThreshold &&
      now - this.lastShakeAt >= this.shakeCooldown
    ) {
      this.lastShakeAt = now;
      this.roll();
    }

    this.lastMotionMagnitude = magnitude;
  };

  private startShakeListener(): void {
    window.addEventListener('devicemotion', this.handleDeviceMotion);
    this.shakeStatus.set('enabled');
  }

  private finishRoll(): void {
    this.stopRoll();
    navigator.vibrate?.(40);
  }

  private stopRoll(): void {
    if (this.rollTimer !== null) {
      clearInterval(this.rollTimer);
      this.rollTimer = null;
    }
    this.isRolling.set(false);
  }
}
