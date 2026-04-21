import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map, Observable } from 'rxjs';
import { Party } from '../../types';
import { AppService } from '../../core/services/app.service';
import { PartyService } from './party.service';
import { ScreenTitleComponent } from '../../shared/components/screen-title.component';
import { BtnComponent } from '../../shared/components/btn.component';
import { BackBtnComponent } from '../../shared/components/back-btn.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faPen,
  faTrash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

interface PartyView {
  parties: Party[];
  activePartyId: string | null;
}

@Component({
  selector: 'app-parties',
  imports: [
    AsyncPipe,
    ScreenTitleComponent,
    BtnComponent,
    BackBtnComponent,
    FontAwesomeModule,
  ],
  template: `
    @if (view$ | async; as view) {
      <div class="new-party">
        <app-screen-title title="New Party Name" />
        <input #partyName type="text" placeholder="" />
        <app-btn (click)="addParty(partyName)">Create</app-btn>
      </div>

      @if (view.parties.length > 0) {
        <div class="party-list">
          <div class="title">
            <app-screen-title title="Your Parties" />
          </div>
          @for (party of view.parties; track party.id) {
            <div
              class="party-card"
              [class.active]="party.id === view.activePartyId"
            >
              <div class="party-header">
                @if (editingPartyId === party.id) {
                  <input
                    #renameInput
                    class="rename-input"
                    type="text"
                    [value]="party.name"
                    (keyup.enter)="confirmRename(renameInput, party.id)"
                  />
                  <div class="party-actions">
                    <fa-icon
                      class="action-icon confirm"
                      [icon]="iconCheck"
                      (click)="confirmRename(renameInput, party.id)"
                    />
                    <fa-icon
                      class="action-icon cancel"
                      [icon]="iconCancel"
                      (click)="cancelRename()"
                    />
                  </div>
                } @else {
                  <div
                    class="party-name text-ellipsis"
                    (click)="switchParty(party.id)"
                  >
                    {{ party.name }}
                  </div>
                  <div class="party-actions">
                    <fa-icon
                      class="action-icon"
                      [icon]="iconRename"
                      (click)="startRename(party.id)"
                    />
                    <fa-icon
                      class="action-icon delete"
                      [icon]="iconDelete"
                      (click)="removeParty(party)"
                    />
                  </div>
                }
              </div>
              <div class="player-preview" (click)="switchParty(party.id)">
                @if (party.playerList.length === 0) {
                  <span class="empty">No players yet</span>
                } @else {
                  @for (player of party.playerList; track player.id) {
                    <div
                      class="player-dot"
                      [style.background-color]="player.color"
                      [title]="player.name"
                    ></div>
                  }
                }
              </div>
              @if (party.playerList.length > 0) {
                <div class="player-names" (click)="switchParty(party.id)">
                  {{ getPlayerNames(party) }}
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="no-parties">
          <div>No parties yet!</div>
          <div>Create one above to get started</div>
        </div>
      }

      <div class="actions">
        <app-back-btn route="" />
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        min-height: 100dvh;
      }

      .new-party {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1.5rem 1rem;
      }

      input {
        font-size: 1.2rem;
        background-color: #a1887f;
        border-radius: var(--border-radius-1);
        padding: 0.5rem;
      }

      .title {
        text-align: center;
        margin: 0.5rem 0 1rem;
      }

      .party-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.5rem;
        align-items: center;
        overflow: auto;
      }

      .party-card {
        width: 80dvw;
        padding: 1rem;
        border-radius: var(--border-radius-1);
        background-color: #5d4037;
        border: 2px solid transparent;
        cursor: pointer;
        transition: border-color 0.2s;
      }

      .party-card.active {
        border-color: #fbc02d;
      }

      .party-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }

      .party-name {
        font-size: 1.3rem;
        font-weight: bold;
        color: #fff;
        flex: 1;
      }

      .rename-input {
        flex: 1;
        font-size: 1.1rem;
        padding: 0.3rem 0.5rem;
        background-color: #a1887f;
        border-radius: var(--border-radius-1);
      }

      .party-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      .action-icon {
        color: #bcaaa4;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.25rem;
      }

      .action-icon:hover {
        color: #fff;
      }

      .action-icon.delete {
        color: #ef5350;
      }

      .action-icon.confirm {
        color: #66bb6a;
      }

      .action-icon.cancel {
        color: #ef5350;
      }

      .player-preview {
        display: flex;
        gap: 0.4rem;
        margin-top: 0.75rem;
        flex-wrap: wrap;
      }

      .player-dot {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }

      .player-names {
        margin-top: 0.4rem;
        font-size: 0.85rem;
        color: #bcaaa4;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .empty {
        font-size: 0.85rem;
        color: #8d6e63;
        font-style: italic;
      }

      .no-parties {
        text-align: center;
        font-size: 1.3rem;
        color: #fff;
        padding: 3rem 1rem;
      }

      .no-parties > div {
        margin: 1rem;
      }

      .actions {
        margin: 2rem;
        display: flex;
        justify-content: center;
      }

      app-btn,
      app-back-btn {
        width: 150px;
      }

      @media (min-width: 500px) {
        .party-card {
          width: 400px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartiesComponent {
  view$: Observable<PartyView>;
  editingPartyId: string | null = null;

  iconRename = faPen;
  iconDelete = faTrash;
  iconCheck = faCheck;
  iconCancel = faXmark;

  constructor(
    private app: AppService,
    private partyService: PartyService,
  ) {
    this.view$ = combineLatest([
      this.app.select$('parties'),
      this.app.select$('activePartyId'),
    ]).pipe(
      map(([parties, activePartyId]) => ({
        parties,
        activePartyId,
      })),
    );
  }

  addParty(input: HTMLInputElement): void {
    const name = input.value.trim();
    if (!name) return;
    this.partyService.addParty(name);
    input.value = '';
  }

  removeParty(party: Party): void {
    this.partyService.removeParty(party);
  }

  startRename(partyId: string): void {
    this.editingPartyId = partyId;
  }

  confirmRename(input: HTMLInputElement, partyId: string): void {
    const newName = input.value.trim();
    if (newName) {
      this.partyService.renameParty(partyId, newName);
    }
    this.editingPartyId = null;
  }

  cancelRename(): void {
    this.editingPartyId = null;
  }

  switchParty(partyId: string): void {
    if (this.editingPartyId) return;
    this.partyService.switchParty(partyId);
  }

  getPlayerNames(party: Party): string {
    return party.playerList.map((p) => p.name).join(', ');
  }
}
