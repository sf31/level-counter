import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { OverlayComponent } from './overlay.component';
import { BtnComponent } from './btn.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [OverlayComponent, BtnComponent],
  template: `
    <app-overlay (close)="cancel.emit()">
      <div class="dialog-title">{{ title() }}</div>
      <div class="dialog-message">{{ message() }}</div>
      <div class="dialog-actions">
        <app-btn class="btn-cancel" (click)="cancel.emit()">Cancel</app-btn>
        <app-btn
          class="btn-confirm"
          [class.danger]="danger()"
          (click)="confirm.emit()"
        >
          {{ confirmLabel() }}
        </app-btn>
      </div>
    </app-overlay>
  `,
  styles: [
    `
      .dialog-title {
        font-size: var(--font-size-title);
        font-weight: var(--font-weight-strong);
        color: var(--color-text);
        margin-bottom: var(--space-sm);
      }

      .dialog-message {
        color: var(--color-text-muted);
        margin-bottom: var(--space-lg);
        line-height: var(--line-height-body);
      }

      .dialog-actions {
        display: flex;
        gap: var(--space-md);
        justify-content: flex-end;
      }

      .btn-cancel {
        background-color: var(--color-bg-lighter);
      }

      .btn-confirm {
        background-color: var(--color-success);
      }

      .btn-confirm.danger {
        background-color: var(--color-danger);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  title = input.required<string>();
  message = input.required<string>();
  confirmLabel = input('Confirm');
  danger = input(false);

  confirm = output<void>();
  cancel = output<void>();
}
