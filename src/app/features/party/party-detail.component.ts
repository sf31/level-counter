import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  viewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, switchMap } from 'rxjs';
import { Party, Player } from '../../types';
import { AppService } from '../../core/services/app.service';
import { PartyService } from './party.service';
import { PLAYER_COLORS } from '../../const';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

interface DetailView {
  party: Party;
  maximumPlayersReached: boolean;
}

type ConfirmAction =
  | { type: 'deletePlayer'; player: Player }
  | { type: 'deleteParty' }
  | { type: 'resetLevels' };

@Component({
  selector: 'app-party-detail',
  imports: [
    AsyncPipe,
    ConfirmDialogComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  template: `
    @if (view$ | async; as view) {
      <div class="scrollable-section">
        <div class="detail-header">
          @if (isRenaming) {
            <textarea
              #partyNameTextarea
              class="rename-input"
              rows="1"
              aria-label="Party name"
              i18n-aria-label
              [formControl]="partyNameControl"
              (input)="resizePartyNameInput(partyNameTextarea)"
              (keydown.enter)="
                confirmRename(view.party.id); $event.preventDefault()
              "
            ></textarea>
            <div class="detail-actions">
              <button
                class="detail-action save"
                type="button"
                [disabled]="partyNameControl.invalid"
                (click)="confirmRename(view.party.id)"
              >
                <ng-container i18n>Save name</ng-container>
              </button>
              <button
                class="detail-action"
                type="button"
                (click)="isRenaming = false"
              >
                <ng-container i18n>Cancel</ng-container>
              </button>
            </div>
          } @else {
            <h1 class="detail-title">{{ view.party.name }}</h1>
            <div class="detail-actions">
              <button
                class="detail-action"
                type="button"
                (click)="startRenaming(view.party.name)"
              >
                <ng-container i18n>Rename</ng-container>
              </button>
              <button
                class="detail-action delete"
                type="button"
                (click)="confirmAction = { type: 'deleteParty' }"
              >
                <ng-container i18n>Delete</ng-container>
              </button>
            </div>
          }
        </div>

        <div class="content">
          @if (!view.maximumPlayersReached) {
            <form
              class="add-row"
              (submit)="addPlayer(view.party.id); $event.preventDefault()"
            >
              <input
                type="text"
                aria-label="Player name"
                i18n-aria-label
                placeholder="Player name..."
                i18n-placeholder
                autocomplete="off"
                [formControl]="playerNameControl"
              />
              <button
                class="add-btn"
                type="submit"
                aria-label="Add player"
                i18n-aria-label
                [disabled]="playerNameControl.invalid"
              >
                <fa-icon [icon]="iconAdd" />
              </button>
            </form>
          } @else {
            <div class="max-warning" i18n>
              Maximum players reached ({{ maxPlayers }})
            </div>
          }

          @if (view.party.playerList.length > 0) {
            <div class="section-label">
              <ng-container i18n>
                Players ({{ view.party.playerList.length }}/{{ maxPlayers }})
              </ng-container>
            </div>
            <div class="player-list">
              @for (player of view.party.playerList; track player.id) {
                <div class="player-row">
                  <div
                    class="player-color"
                    [style.background-color]="player.color"
                  ></div>
                  <div class="player-name text-ellipsis">
                    {{ player.name }}
                  </div>
                  <button
                    class="player-delete"
                    type="button"
                    [attr.aria-label]="removePlayerLabel(player.name)"
                    (click)="
                      confirmAction = { type: 'deletePlayer', player: player }
                    "
                  >
                    <fa-icon [icon]="iconDelete" />
                  </button>
                </div>
              }
            </div>
          } @else {
            <div class="empty-players">
              <div i18n>No players yet</div>
              <div class="empty-hint" i18n>
                Add players above to start playing
              </div>
            </div>
          }
        </div>
      </div>

      <footer class="footer">
        <button
          class="reset-action"
          type="button"
          (click)="confirmAction = { type: 'resetLevels' }"
        >
          <ng-container i18n>Reset Levels &amp; Gears</ng-container>
        </button>
      </footer>

      @if (confirmAction) {
        @switch (confirmAction.type) {
          @case ('deletePlayer') {
            <app-confirm-dialog
              [title]="removePlayerTitle"
              [message]="removePlayerMessage(confirmAction.player.name)"
              [confirmLabel]="removeLabel"
              [danger]="true"
              (confirm)="removePlayer(view.party.id, confirmAction.player)"
              (cancel)="confirmAction = null"
            />
          }
          @case ('deleteParty') {
            <app-confirm-dialog
              [title]="deletePartyTitle"
              [message]="deletePartyMessage(view.party.name)"
              [confirmLabel]="deleteLabel"
              [danger]="true"
              (confirm)="deleteParty(view.party)"
              (cancel)="confirmAction = null"
            />
          }
          @case ('resetLevels') {
            <app-confirm-dialog
              [title]="resetLevelsTitle"
              [message]="resetLevelsMessage"
              [confirmLabel]="resetLabel"
              (confirm)="resetLevels(view.party.id)"
              (cancel)="confirmAction = null"
            />
          }
        }
      }
    }
  `,
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .scrollable-section {
        flex: 1;
        min-height: 0;
        overflow: auto;
      }

      .detail-header {
        padding: var(--space-sm) var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-sm);
        border-bottom: var(--border-width) solid var(--color-bg-lighter);
      }

      .detail-title {
        width: 100%;
        max-width: 440px;
        margin: 0;
        font-size: var(--font-size-title);
        text-align: center;
        overflow-wrap: anywhere;
      }

      .rename-input {
        max-width: 440px;
        min-height: var(--touch-target);
        overflow-y: hidden;
        resize: none;
        font-weight: var(--font-weight-strong);
        line-height: var(--line-height-body);
      }

      .detail-actions {
        width: 100%;
        max-width: 440px;
        display: flex;
        gap: var(--space-sm);
      }

      .detail-action {
        min-height: var(--touch-target);
        flex: 1;
        padding: 0 var(--space-md);
        background-color: transparent;
        color: var(--color-text-muted);
        cursor: pointer;
        font-weight: var(--font-weight-strong);
        transition: opacity var(--duration-fast);
      }

      .detail-action.save {
        color: var(--color-success);
      }

      .detail-action.delete {
        color: var(--color-danger);
      }

      .detail-action:active:not(:disabled) {
        opacity: 0.7;
      }

      .detail-action:focus-visible {
        outline: var(--border-width-strong) solid var(--color-accent);
        outline-offset: calc(-1 * var(--border-width-strong));
      }

      .detail-action:disabled {
        opacity: 0.45;
        cursor: default;
      }

      .content {
        padding: var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .add-row {
        display: flex;
        gap: var(--space-sm);
        width: 100%;
        max-width: 440px;
        margin-bottom: var(--space-lg);
      }

      .add-row input {
        flex: 1;
      }

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--touch-target);
        height: var(--touch-target);
        border-radius: var(--border-radius-1);
        background-color: var(--color-accent);
        color: var(--color-on-accent);
        font-size: var(--font-size-control);
        cursor: pointer;
        flex-shrink: 0;
        border: none;
        box-shadow: var(--shadow-control);
        transition:
          opacity var(--duration-fast),
          transform var(--duration-fast);
      }

      .add-btn:active:not(:disabled) {
        opacity: 0.8;
        transform: translateY(2px);
      }

      .add-btn:disabled {
        opacity: 0.45;
        cursor: default;
      }

      .max-warning {
        color: var(--color-accent);
        font-weight: var(--font-weight-strong);
        text-align: center;
        padding: var(--space-md) 0;
        margin-bottom: var(--space-md);
      }

      .section-label {
        color: var(--color-text-muted);
        font-size: var(--font-size-caption);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--space-sm);
        width: 100%;
        max-width: 440px;
      }

      .player-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
        width: 100%;
        max-width: 440px;
        margin-bottom: var(--space-lg);
      }

      .player-row {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        padding: var(--space-sm) var(--space-md);
        background-color: var(--color-bg-light);
        border: var(--border-width) solid var(--color-border-subtle);
        border-radius: var(--border-radius-1);
        box-shadow: var(--shadow-surface);
        min-height: var(--touch-target);
      }

      .player-color {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: var(--border-width-strong) solid rgba(255, 255, 255, 0.72);
        flex-shrink: 0;
      }

      .player-name {
        flex: 1;
        font-size: var(--font-size-body);
      }

      .player-delete {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--touch-target);
        height: var(--touch-target);
        color: var(--color-danger);
        cursor: pointer;
        border: none;
        background: none;
        font-size: 1rem;
        flex-shrink: 0;
        opacity: 0.7;
        transition: opacity var(--duration-fast);
      }

      .player-delete:active {
        opacity: 1;
      }

      .empty-players {
        text-align: center;
        padding: var(--space-xl);
        color: var(--color-text-muted);
        font-size: var(--font-size-body);
      }

      .empty-hint {
        font-size: var(--font-size-caption);
        margin-top: var(--space-sm);
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

      .reset-action {
        width: 100%;
        max-width: 440px;
        min-height: var(--touch-target);
        padding: var(--space-sm);
        color: var(--color-text-muted);
        cursor: pointer;
        font-weight: var(--font-weight-strong);
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyDetailComponent implements OnInit {
  private readonly partyNameTextarea =
    viewChild<ElementRef<HTMLTextAreaElement>>('partyNameTextarea');

  view$!: Observable<DetailView>;
  isRenaming = false;
  confirmAction: ConfirmAction | null = null;
  maxPlayers = PLAYER_COLORS.length;

  iconAdd = faPlus;
  iconDelete = faTrash;
  playerNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });
  partyNameControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });
  readonly removePlayerTitle = $localize`Remove Player`;
  readonly deletePartyTitle = $localize`Delete Party`;
  readonly resetLevelsTitle = $localize`Reset Levels & Gears`;
  readonly removeLabel = $localize`Remove`;
  readonly deleteLabel = $localize`Delete`;
  readonly resetLabel = $localize`Reset`;
  readonly resetLevelsMessage = $localize`Reset every player to Level 1 and Gear 0?`;

  constructor(
    private app: AppService,
    private partyService: PartyService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    afterRenderEffect(() => {
      const textarea = this.partyNameTextarea()?.nativeElement;
      if (textarea) this.resizePartyNameInput(textarea);
    });
  }

  ngOnInit(): void {
    this.view$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const partyId = params.get('id');
        return this.app.select$('parties').pipe(
          map((parties) => {
            const party = parties.find((p) => p.id === partyId);
            if (!party) {
              this.router.navigate(['/parties'], { replaceUrl: true });
              // Return a placeholder to avoid template errors during redirect
              return {
                party: { id: '', name: '', playerList: [] },
                maximumPlayersReached: false,
              } as DetailView;
            }
            return {
              party,
              maximumPlayersReached:
                party.playerList.length >= PLAYER_COLORS.length,
            };
          }),
        );
      }),
    );
  }

  addPlayer(partyId: string): void {
    if (this.playerNameControl.invalid) return;

    this.app.addPlayer(partyId, this.playerNameControl.value.trim());
    this.playerNameControl.reset();
  }

  removePlayer(partyId: string, player: Player): void {
    this.app.removePlayer(partyId, player);
    this.confirmAction = null;
  }

  startRenaming(partyName: string): void {
    this.partyNameControl.setValue(partyName);
    this.isRenaming = true;
  }

  resizePartyNameInput(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${
      textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight
    }px`;
  }

  confirmRename(partyId: string): void {
    if (this.partyNameControl.invalid) return;

    this.partyService.renameParty(partyId, this.partyNameControl.value.trim());
    this.isRenaming = false;
  }

  removePlayerLabel(playerName: string): string {
    return $localize`Remove ${playerName}:playerName:`;
  }

  removePlayerMessage(playerName: string): string {
    return $localize`Remove ${playerName}:playerName: from this party?`;
  }

  deletePartyMessage(partyName: string): string {
    return $localize`Delete ${partyName}:partyName: and all its players? This cannot be undone.`;
  }

  resetLevels(partyId: string): void {
    this.app.resetPlayers(partyId);
    this.confirmAction = null;
  }

  deleteParty(party: Party): void {
    this.partyService.removeParty(party);
    this.confirmAction = null;
  }
}
