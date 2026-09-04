import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-party-list-empty',
  template: `
    <div class="empty-state">
      <div class="empty-title" i18n>No parties yet</div>
      <div class="empty-hint" i18n>
        Create your first party to start playing.
      </div>
    </div>
  `,
  styles: [
    `
      .empty-state {
        padding: var(--space-xl) var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
        text-align: center;
      }

      .empty-title {
        font-size: var(--font-size-subtitle);
        font-weight: var(--font-weight-strong);
      }

      .empty-hint {
        color: var(--color-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyListEmptyComponent {}
