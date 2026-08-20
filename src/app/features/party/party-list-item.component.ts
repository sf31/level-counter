import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Party } from '../../types';

@Component({
  selector: 'app-party-list-item',
  template: `
    <button
      class="party-card"
      type="button"
      [class.active]="isActive()"
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
  `,
  styles: [
    `
      .party-card {
        min-height: 72px;
        width: 100%;
        padding: var(--space-sm) var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        background-color: var(--color-bg-light);
        border: var(--border-width-strong) solid transparent;
        border-radius: var(--border-radius-1);
        overflow: hidden;
        cursor: pointer;
        text-align: left;
        transition:
          border-color var(--duration-fast),
          background-color var(--duration-fast);
      }

      .party-card.active {
        border-color: var(--color-accent);
      }

      .party-card:active {
        background-color: var(--color-bg-lighter);
      }

      .name {
        width: 100%;
        font-size: 1.15rem;
        font-weight: var(--font-weight-strong);
      }

      .meta {
        width: 100%;
        margin-top: var(--space-xs);
        color: var(--color-text-muted);
        font-size: 0.85rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyListItemComponent {
  readonly party = input.required<Party>();
  readonly activePartyId = input<string | null>(null);
  readonly selected = output<void>();

  protected isActive(): boolean {
    return this.activePartyId() === this.party().id;
  }

  protected playerNames(): string {
    return this.party()
      .playerList.map((player) => player.name)
      .join(', ');
  }
}
