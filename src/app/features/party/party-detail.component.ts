import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { Party, Player } from '../../types';
import { AppService } from '../../core/services/app.service';
import { PartyService } from './party.service';
import { PLAYER_COLORS } from '../../const';
import { BtnComponent } from '../../shared/components/btn.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faCheck,
  faPen,
  faPlus,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

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
    BtnComponent,
    ConfirmDialogComponent,
    FontAwesomeModule,
    RouterLink,
  ],
  template: `
    @if (view$ | async; as view) {
      <div class="detail-header">
        <a
          class="header-action"
          routerLink="/parties"
          aria-label="Back to parties"
        >
          <fa-icon [icon]="iconBack" />
        </a>
        @if (isRenaming) {
          <input
            #renameInput
            class="rename-input"
            type="text"
            aria-label="Party name"
            [value]="view.party.name"
            (keyup.enter)="confirmRename(renameInput, view.party.id)"
          />
          <button
            class="header-action confirm"
            type="button"
            aria-label="Save party name"
            (click)="confirmRename(renameInput, view.party.id)"
          >
            <fa-icon [icon]="iconCheck" />
          </button>
          <button
            class="header-action cancel"
            type="button"
            aria-label="Cancel renaming"
            (click)="isRenaming = false"
          >
            <fa-icon [icon]="iconCancel" />
          </button>
        } @else {
          <h1 class="detail-title">{{ view.party.name }}</h1>
          <button
            class="header-action"
            type="button"
            aria-label="Rename party"
            (click)="isRenaming = true"
          >
            <fa-icon [icon]="iconRename" />
          </button>
        }
      </div>

      <div class="content">
        @if (!view.maximumPlayersReached) {
          <div class="add-row">
            <input
              #playerName
              type="text"
              aria-label="Player name"
              placeholder="Player name..."
              (keyup.enter)="addPlayer(playerName)"
            />
            <button
              class="add-btn"
              type="button"
              aria-label="Add player"
              (click)="addPlayer(playerName)"
            >
              <fa-icon [icon]="iconAdd" />
            </button>
          </div>
        } @else {
          <div class="max-warning">
            Maximum players reached ({{ maxPlayers }})
          </div>
        }

        @if (view.party.playerList.length > 0) {
          <div class="section-label">
            Players ({{ view.party.playerList.length }}/{{ maxPlayers }})
          </div>
          <div class="player-list">
            @for (player of view.party.playerList; track player.id) {
              <div class="player-row">
                <div
                  class="player-color"
                  [style.background-color]="player.color"
                ></div>
                <div class="player-name text-ellipsis">{{ player.name }}</div>
                <button
                  class="player-delete"
                  type="button"
                  [attr.aria-label]="'Remove ' + player.name"
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
            <div>No players yet</div>
            <div class="empty-hint">Add players above to start playing</div>
          </div>
        }

        <div class="danger-zone">
          <app-btn
            class="btn-reset"
            (click)="confirmAction = { type: 'resetLevels' }"
          >
            Reset Levels & Gears
          </app-btn>
          <app-btn
            class="btn-delete"
            (click)="confirmAction = { type: 'deleteParty' }"
          >
            Delete Party
          </app-btn>
        </div>
      </div>

      @if (confirmAction) {
        @switch (confirmAction.type) {
          @case ('deletePlayer') {
            <app-confirm-dialog
              title="Remove Player"
              [message]="
                'Remove ' + confirmAction.player.name + ' from this party?'
              "
              confirmLabel="Remove"
              (confirm)="removePlayer(confirmAction.player)"
              (cancel)="confirmAction = null"
            />
          }
          @case ('deleteParty') {
            <app-confirm-dialog
              title="Delete Party"
              [message]="
                'Permanently delete ' +
                view.party.name +
                ' and all its players?'
              "
              confirmLabel="Delete"
              (confirm)="deleteParty(view.party)"
              (cancel)="confirmAction = null"
            />
          }
          @case ('resetLevels') {
            <app-confirm-dialog
              title="Reset Levels & Gears"
              [message]="
                'Reset all players in ' +
                view.party.name +
                ' to Level 1 and Gear 0?'
              "
              confirmLabel="Reset"
              (confirm)="resetLevels()"
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
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      .detail-header {
        min-height: var(--header-height);
        padding: var(--space-sm) var(--space-md);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        border-bottom: var(--border-width) solid var(--color-bg-lighter);
      }

      .detail-title {
        min-width: 0;
        flex: 1;
        margin: 0;
        overflow: hidden;
        font-size: var(--font-size-title);
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .rename-input {
        flex: 1;
        font-size: var(--font-size-body);
        font-weight: var(--font-weight-strong);
        min-width: 0;
      }

      .header-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--touch-target);
        height: var(--touch-target);
        color: var(--color-text-muted);
        cursor: pointer;
        border: none;
        background: none;
        font-size: var(--font-size-body);
        flex-shrink: 0;
        text-decoration: none;
      }

      .header-action.confirm {
        color: var(--color-success);
      }

      .header-action.cancel {
        color: var(--color-danger);
      }

      .content {
        flex: 1;
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
        transition: opacity var(--duration-fast);
      }

      .add-btn:active {
        opacity: 0.8;
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
        border-radius: var(--border-radius-1);
        min-height: var(--touch-target);
      }

      .player-color {
        width: 14px;
        height: 14px;
        border-radius: 50%;
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

      .danger-zone {
        width: 100%;
        max-width: 440px;
        margin-top: auto;
        padding-top: var(--space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        padding-bottom: var(--space-lg);
      }

      .btn-reset {
        background-color: var(--color-bg-lighter);
      }

      .btn-delete {
        background-color: var(--color-danger);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyDetailComponent implements OnInit {
  view$!: Observable<DetailView>;
  isRenaming = false;
  confirmAction: ConfirmAction | null = null;
  maxPlayers = PLAYER_COLORS.length;

  iconBack = faArrowLeft;
  iconRename = faPen;
  iconCheck = faCheck;
  iconCancel = faXmark;
  iconAdd = faPlus;
  iconDelete = faTrash;

  constructor(
    private app: AppService,
    private partyService: PartyService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

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

  addPlayer(input: HTMLInputElement): void {
    const name = input.value.trim();
    if (!name) return;
    // Temporarily switch active party to this one for addPlayer to work
    const partyId = this.route.snapshot.paramMap.get('id');
    if (partyId) {
      const prevActiveId = this.app.getStateSnapshot().activePartyId;
      this.app.patchState({ activePartyId: partyId });
      this.app.addPlayer(name);
      if (prevActiveId !== partyId) {
        this.app.patchState({ activePartyId: prevActiveId });
      }
    }
    input.value = '';
  }

  removePlayer(player: Player): void {
    const partyId = this.route.snapshot.paramMap.get('id');
    if (partyId) {
      const prevActiveId = this.app.getStateSnapshot().activePartyId;
      this.app.patchState({ activePartyId: partyId });
      this.app.removePlayer(player);
      if (prevActiveId !== partyId) {
        this.app.patchState({ activePartyId: prevActiveId });
      }
    }
    this.confirmAction = null;
  }

  confirmRename(input: HTMLInputElement, partyId: string): void {
    const newName = input.value.trim();
    if (newName) {
      this.partyService.renameParty(partyId, newName);
    }
    this.isRenaming = false;
  }

  resetLevels(): void {
    const partyId = this.route.snapshot.paramMap.get('id');
    if (partyId) {
      const prevActiveId = this.app.getStateSnapshot().activePartyId;
      this.app.patchState({ activePartyId: partyId });
      this.app.resetPlayers();
      if (prevActiveId !== partyId) {
        this.app.patchState({ activePartyId: prevActiveId });
      }
    }
    this.confirmAction = null;
  }

  deleteParty(party: Party): void {
    this.partyService.removeParty(party);
    this.confirmAction = null;
  }
}
