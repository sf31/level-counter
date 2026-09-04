import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Party } from '../../types';

@Component({
  selector: 'app-party-list-item',
  imports: [FontAwesomeModule, RouterLink],
  template: `
    <div class="party-card" [class.active]="isActive()">
      <button
        class="party-select"
        type="button"
        [attr.aria-pressed]="isActive()"
        (click)="selected.emit()"
      >
        <div class="name-row">
          <span class="name text-ellipsis">{{ party().name }}</span>
          @if (isActive()) {
            <span class="active-badge" i18n>Active</span>
          }
        </div>
        <div class="meta-row">
          @if (party().playerList.length === 0) {
            <span class="meta-text" i18n>No players</span>
          } @else {
            <div class="swatches">
              @for (p of party().playerList; track p.id) {
                <div class="swatch" [style.background-color]="p.color"></div>
              }
            </div>
            <span class="meta-text text-ellipsis" i18n>
              {{ party().playerList.length }}
              {party().playerList.length, plural, =1 {player} other {players}} ·
              {{ playerNames() }}
            </span>
          }
        </div>
      </button>
      <a
        class="settings-button"
        [routerLink]="['/parties', party().id]"
        [state]="settingsNavigationState"
        title="Party settings"
        i18n-title
        [attr.aria-label]="settingsLabel()"
      >
        <fa-icon [icon]="settingsIcon" aria-hidden="true" />
      </a>
    </div>
  `,
  styles: [
    `
      .party-card {
        min-height: 72px;
        width: 100%;
        padding: 0;
        display: flex;
        align-items: stretch;
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

      .party-select {
        min-width: 0;
        flex: 1;
        padding: var(--space-sm) var(--space-md);
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: var(--space-xs);
        background-color: transparent;
        cursor: pointer;
        text-align: left;
      }

      .party-select:active {
        background-color: var(--color-bg-lighter);
        box-shadow: none;
      }

      .settings-button {
        width: var(--touch-target);
        height: var(--touch-target);
        margin: auto var(--space-sm) auto 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius-1);
        color: var(--color-text-muted);
        text-decoration: none;
        cursor: pointer;
      }

      .settings-button:is(:hover, :focus-visible) {
        background-color: var(--color-bg-lighter);
        color: var(--color-text);
      }

      .settings-button:focus-visible {
        outline: var(--border-width-strong) solid var(--color-accent);
        outline-offset: calc(-1 * var(--border-width-strong));
      }

      .settings-button:active {
        opacity: 0.7;
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
  protected readonly settingsIcon = faGear;
  protected readonly settingsNavigationState = { fromGame: true };

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

  protected settingsLabel(): string {
    return $localize`Open settings for ${this.party().name}:partyName:`;
  }
}
