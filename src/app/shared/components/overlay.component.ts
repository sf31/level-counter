import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  imports: [],
  template: `
    <div class="backdrop" (click)="close.emit()"></div>
    <div class="panel" role="dialog" aria-modal="true">
      <ng-content />
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.6);
      }

      .panel {
        position: relative;
        width: 100%;
        max-width: 480px;
        max-height: 85dvh;
        overflow: auto;
        background-color: var(--color-bg-light);
        border-radius: var(--border-radius-2) var(--border-radius-2) 0 0;
        padding: var(--space-lg);
        animation: slideUp 0.25s ease-out;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @media (min-width: 600px) {
        :host {
          align-items: center;
        }

        .panel {
          border-radius: var(--border-radius-2);
          max-height: 70dvh;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent {
  close = output<void>();
}
