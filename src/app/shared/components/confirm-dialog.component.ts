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
    <app-overlay
      labelledBy="confirm-dialog-title"
      describedBy="confirm-dialog-message"
      (close)="cancel.emit()"
    >
      <h2 id="confirm-dialog-title" class="dialog-title">{{ title() }}</h2>
      <p id="confirm-dialog-message" class="dialog-message">
        {{ message() }}
      </p>
      <div class="dialog-actions">
        <app-btn class="btn-cancel" (click)="cancel.emit()">
          <ng-container i18n>Cancel</ng-container>
        </app-btn>
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
        margin: 0 0 var(--space-sm);
        font-size: var(--font-size-title);
        font-weight: var(--font-weight-strong);
        color: var(--color-text);
      }

      .dialog-message {
        margin: 0 0 var(--space-lg);
        color: var(--color-text-muted);
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
  confirmLabel = input($localize`Confirm`);
  danger = input(false);

  confirm = output<void>();
  cancel = output<void>();
}
