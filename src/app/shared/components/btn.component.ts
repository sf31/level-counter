import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-btn',
  imports: [],
  template: ` <ng-content /> `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: var(--touch-target);
        background-color: var(--color-surface);
        padding: var(--space-sm) var(--space-lg);
        border-radius: var(--border-radius-1);
        color: var(--color-text);
        cursor: pointer;
        font-weight: bold;
        transition: opacity 0.15s;
      }

      :host:active {
        opacity: 0.8;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {
  width = input('auto');
}
