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
      <div class="name-row">
        <span class="name text-ellipsis">{{ party().name }}</span>
        @if (isActive()) {
          <span class="active-badge">Active</span>
        }
      </div>
      <div class="meta-row">
        @if (party().playerList.length === 0) {
          <span class="meta-text">No players</span>
        } @else {
          <div class="swatches">
            @for (p of party().playerList; track p.id) {
              <div class="swatch" [style.background-color]="p.color"></div>
            }
          </div>
          <span class="meta-text text-ellipsis">
            {{ party().playerList.length }}
            {{ party().playerList.length === 1 ? 'player' : 'players' }} ·
            {{ playerNames() }}
          </span>
        }
      </div>
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
        justify-content: center;
        gap: var(--space-xs);
        background-color: var(--color-bg-light);
        border: var(--border-width-strong) solid var(--color-border-subtle);
        border-radius: var(--border-radius-1);
        box-shadow: var(--shadow-surface);
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
        box-shadow: none;
      }

      .name-row {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        min-width: 0;
      }

      .name {
        flex: 1;
        min-width: 0;
        font-size: 1.15rem;
        font-weight: var(--font-weight-strong);
      }

      .active-badge {
        flex-shrink: 0;
        font-size: 0.75rem;
        padding: 2px var(--space-xs);
        background-color: var(--color-accent);
        color: var(--color-on-accent);
        border-radius: var(--border-radius-pill);
        font-weight: var(--font-weight-strong);
        letter-spacing: 0.04em;
      }

      .meta-row {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        min-width: 0;
      }

      .swatches {
        display: flex;
        gap: 3px;
        flex-shrink: 0;
      }

      .swatch {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.35);
      }

      .meta-text {
        min-width: 0;
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
