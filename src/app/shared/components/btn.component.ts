import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-btn',
  template: `
    <button type="button">
      <ng-content />
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: var(--color-surface);
        border-radius: var(--border-radius-1);
        box-shadow: var(--shadow-control);
      }

      button {
        width: 100%;
        min-height: var(--touch-target);
        padding: var(--space-sm) var(--space-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: inherit;
        border-radius: inherit;
        color: var(--color-text);
        cursor: pointer;
        font-weight: var(--font-weight-strong);
        transition:
          opacity var(--duration-fast),
          transform var(--duration-fast);
      }

      button:active {
        opacity: 0.8;
        transform: translateY(2px);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {}
