import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { PLAYER_COLORS } from '../../const';
import { PartyService } from './party.service';

interface DraftPlayer {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-party-create',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
    <section class="setup-shell" aria-labelledby="setup-title">
      <div class="scrollable-section">
        <div class="intro">
          <h1 id="setup-title">Create your party</h1>
          <p>Give it a name and add at least one player.</p>
        </div>

        <div class="content">
          <label class="field-label" for="party-name">Party name</label>
          <textarea
            #partyNameTextarea
            id="party-name"
            class="party-name"
            rows="1"
            autocomplete="off"
            autofocus
            [formControl]="partyNameControl"
            (input)="resizePartyNameInput(partyNameTextarea)"
            (keydown.enter)="$event.preventDefault()"
          ></textarea>

          <label class="field-label players-label" for="player-name">
            Players
          </label>
          @if (players().length < maxPlayers) {
            <form
              class="add-row"
              (submit)="addPlayer(); $event.preventDefault()"
            >
              <input
                id="player-name"
                type="text"
                placeholder="Player name..."
                autocomplete="off"
                [formControl]="playerNameControl"
              />
              <button
                class="add-button"
                type="submit"
                aria-label="Add player"
                [disabled]="playerNameControl.invalid"
              >
                <fa-icon [icon]="iconAdd" />
              </button>
            </form>
          } @else {
            <div class="max-warning">
              Maximum players reached ({{ maxPlayers }})
            </div>
          }

          @if (players().length > 0) {
            <div class="player-count">
              {{ players().length }}/{{ maxPlayers }} players
            </div>
            <div class="player-list">
              @for (player of players(); track player.id) {
                <div class="player-row">
                  <span
                    class="player-color"
                    [style.background-color]="player.color"
                  ></span>
                  <span class="player-name text-ellipsis">
                    {{ player.name }}
                  </span>
                  <button
                    class="remove-player"
                    type="button"
                    [attr.aria-label]="'Remove ' + player.name"
                    (click)="removePlayer(player.id)"
                  >
                    <fa-icon [icon]="iconDelete" />
                  </button>
                </div>
              }
            </div>
          } @else {
            <div class="empty-players">Add a player to start the game.</div>
          }
        </div>
      </div>

      <footer class="footer">
        <button
          class="start-button"
          type="button"
          [disabled]="!canStart()"
          (click)="startGame()"
        >
          Start game
        </button>
      </footer>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .setup-shell {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .scrollable-section {
        flex: 1;
        min-height: 0;
        overflow: auto;
      }

      .intro {
        padding: var(--space-xl) var(--space-md) var(--space-md);
        text-align: center;
      }

      h1 {
        margin: 0;
        font-size: var(--font-size-page-title);
      }

      p {
        margin: var(--space-xs) 0 0;
        color: var(--color-text-muted);
      }

      .content {
        width: 100%;
        max-width: 472px;
        margin: 0 auto;
        padding: var(--space-md);
      }

      .field-label {
        display: block;
        margin-bottom: var(--space-xs);
        color: var(--color-text-muted);
        font-size: var(--font-size-caption);
      }

      .players-label {
        margin-top: var(--space-lg);
      }

      .party-name {
        display: block;
        min-height: var(--touch-target);
        overflow-y: hidden;
        resize: none;
        line-height: var(--line-height-body);
      }

      .add-row {
        display: flex;
        gap: var(--space-sm);
      }

      .add-row input {
        min-width: 0;
        flex: 1;
      }

      .add-button,
      .remove-player {
        width: var(--touch-target);
        height: var(--touch-target);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .add-button {
        border-radius: var(--border-radius-1);
        background-color: var(--color-accent);
        color: var(--color-on-accent);
      }

      .add-button:disabled,
      .start-button:disabled {
        opacity: 0.45;
        cursor: default;
      }

      .max-warning,
      .empty-players {
        padding: var(--space-lg) 0;
        color: var(--color-text-muted);
        text-align: center;
      }

      .max-warning {
        color: var(--color-accent);
        font-weight: var(--font-weight-strong);
      }

      .player-count {
        margin: var(--space-lg) 0 var(--space-sm);
        color: var(--color-text-muted);
        font-size: var(--font-size-caption);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .player-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
      }

      .player-row {
        min-height: var(--touch-target);
        padding: var(--space-sm) var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-md);
        border-radius: var(--border-radius-1);
        background-color: var(--color-bg-light);
      }

      .player-color {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
        border-radius: 50%;
      }

      .player-name {
        min-width: 0;
        flex: 1;
      }

      .remove-player {
        color: var(--color-danger);
        opacity: 0.7;
      }

      .footer {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        padding: var(--space-sm) var(--space-md)
          calc(var(--space-sm) + env(safe-area-inset-bottom));
        border-top: var(--border-width) solid var(--color-bg-lighter);
        background-color: var(--color-bg);
      }

      .start-button {
        width: 100%;
        max-width: 440px;
        min-height: var(--touch-target);
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--border-radius-1);
        background-color: var(--color-success);
        color: var(--color-text);
        font-weight: var(--font-weight-strong);
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyCreateComponent {
  private readonly partyService = inject(PartyService);
  private readonly router = inject(Router);
  private nextPlayerId = 0;

  protected readonly iconAdd = faPlus;
  protected readonly iconDelete = faTrash;
  protected readonly maxPlayers = PLAYER_COLORS.length;
  protected readonly players = signal<readonly DraftPlayer[]>([]);
  protected readonly partyNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });
  protected readonly playerNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });

  protected addPlayer(): void {
    if (
      this.playerNameControl.invalid ||
      this.players().length >= this.maxPlayers
    )
      return;

    const name = this.playerNameControl.value.trim();
    const color = PLAYER_COLORS.find(
      (candidate) =>
        !this.players().some((player) => player.color === candidate),
    );
    if (!color) return;

    this.players.update((players) => [
      ...players,
      { id: this.nextPlayerId++, name, color },
    ]);
    this.playerNameControl.reset();
  }

  protected removePlayer(playerId: number): void {
    this.players.update((players) =>
      players.filter((player) => player.id !== playerId),
    );
  }

  protected canStart(): boolean {
    return this.partyNameControl.valid && this.players().length > 0;
  }

  protected startGame(): void {
    if (!this.canStart()) return;

    this.partyService.createParty(
      this.partyNameControl.value.trim(),
      this.players().map(({ name, color }) => ({ name, color })),
    );
    this.router.navigate(['/'], { replaceUrl: true }).catch();
  }

  protected resizePartyNameInput(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${
      textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight
    }px`;
  }
}
