import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Party } from '../../types';

@Component({
  selector: 'app-party-list-item',
  imports: [FontAwesomeModule],
  template: `
    <article
      class="party-card"
      [class.active]="isActive()"
      [attr.aria-label]="party().name"
    >
      <button
        class="party-select"
        type="button"
        [attr.aria-pressed]="isActive()"
        (click)="selected.emit()"
      >
        <span class="name text-ellipsis">{{ party().name }}</span>
        <span class="meta text-ellipsis">
          @if (party().playerList.length === 0) {
            No players
          } @else {
            {{ party().playerList.length }}
            {{ party().playerList.length === 1 ? 'player' : 'players' }} ·
            {{ playerNames() }}
          }
        </span>
      </button>
      <button
        class="edit"
        type="button"
        [attr.aria-label]="'Edit ' + party().name"
        (click)="edit.emit()"
      >
        <fa-icon [icon]="editIcon" />
      </button>
    </article>
  `,
  styles: [
    `
      .party-card {
        min-height: 72px;
        display: flex;
        align-items: stretch;
        background-color: var(--color-bg-light);
        border: 2px solid transparent;
        border-radius: var(--border-radius-1);
        overflow: hidden;
        transition:
          border-color 0.15s,
          background-color 0.15s;
      }

      .party-card.active {
        border-color: var(--color-accent);
      }

      .party-select {
        min-width: 0;
        flex: 1;
        padding: var(--space-sm) var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        cursor: pointer;
        text-align: left;
      }

      .party-select:active,
      .edit:active {
        background-color: var(--color-bg-lighter);
      }

      .name {
        width: 100%;
        font-size: 1.15rem;
        font-weight: bold;
      }

      .meta {
        width: 100%;
        margin-top: var(--space-xs);
        color: var(--color-text-muted);
        font-size: 0.85rem;
      }

      .edit {
        width: var(--touch-target);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyListItemComponent {
  readonly party = input.required<Party>();
  readonly activePartyId = input<string | null>(null);
  readonly selected = output<void>();
  readonly edit = output<void>();

  protected readonly editIcon = faPen;

  protected isActive(): boolean {
    return this.activePartyId() === this.party().id;
  }

  protected playerNames(): string {
    return this.party()
      .playerList.map((player) => player.name)
      .join(', ');
  }
}
