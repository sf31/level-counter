import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { Party } from '../../types';
import { AppService } from '../../core/services/app.service';
import { PartyService } from './party.service';
import { IconBtnComponent } from '../../shared/components/icon-btn.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faEllipsis,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

interface PartiesView {
  parties: Party[];
  activePartyId: string | null;
}

@Component({
  selector: 'app-parties',
  imports: [AsyncPipe, IconBtnComponent, FontAwesomeModule, RouterLink],
  template: `
    @if (view$ | async; as view) {
      <div class="page-header">
        <app-icon-btn routerLink="" [icon]="iconBack" />
        <span class="page-header-title">Parties</span>
        <div style="width: var(--touch-target)"></div>
      </div>

      <div class="content">
        <div class="create-row">
          <input
            #partyName
            type="text"
            placeholder="New party name..."
            (keyup.enter)="addParty(partyName)"
          />
          <button class="add-btn" (click)="addParty(partyName)">
            <fa-icon [icon]="iconAdd" />
          </button>
        </div>

        @if (view.parties.length > 0) {
          <div class="section-label">Your Parties</div>
          <div class="party-list">
            @for (party of view.parties; track party.id) {
              <div
                class="party-card"
                [class.active]="party.id === view.activePartyId"
                (click)="switchParty(party.id)"
              >
                <div class="card-body">
                  <div class="card-name text-ellipsis">{{ party.name }}</div>
                  <div class="card-meta">
                    @if (party.playerList.length === 0) {
                      <span class="meta-empty">No players</span>
                    } @else {
                      <div class="player-dots">
                        @for (
                          player of party.playerList;
                          track player.id
                        ) {
                          <div
                            class="dot"
                            [style.background-color]="player.color"
                          ></div>
                        }
                      </div>
                      <span class="meta-names text-ellipsis">
                        {{ getPlayerNames(party) }}
                      </span>
                    }
                  </div>
                </div>
                <button
                  class="card-action"
                  (click)="goToDetail(party.id); $event.stopPropagation()"
                >
                  <fa-icon [icon]="iconMore" />
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-title">No parties yet</div>
            <div class="empty-hint">Create one above to get started</div>
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
      }

      .content {
        flex: 1;
        padding: var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .create-row {
        display: flex;
        gap: var(--space-sm);
        width: 100%;
        max-width: 440px;
        margin-bottom: var(--space-lg);
      }

      .create-row input {
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
        color: var(--color-bg);
        font-size: 1.2rem;
        cursor: pointer;
        flex-shrink: 0;
        border: none;
        transition: opacity 0.15s;
      }

      .add-btn:active {
        opacity: 0.8;
      }

      .section-label {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--space-sm);
        width: 100%;
        max-width: 440px;
      }

      .party-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        width: 100%;
        max-width: 440px;
      }

      .party-card {
        display: flex;
        align-items: center;
        background-color: var(--color-bg-light);
        border-radius: var(--border-radius-1);
        border: 2px solid transparent;
        padding: var(--space-md);
        cursor: pointer;
        transition:
          border-color 0.2s,
          background-color 0.15s;
        gap: var(--space-sm);
      }

      .party-card:active {
        background-color: var(--color-bg-lighter);
      }

      .party-card.active {
        border-color: var(--color-accent);
      }

      .card-body {
        flex: 1;
        overflow: hidden;
      }

      .card-name {
        font-size: 1.2rem;
        font-weight: bold;
      }

      .card-meta {
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        margin-top: var(--space-xs);
      }

      .player-dots {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      .meta-names {
        font-size: 0.85rem;
        color: var(--color-text-muted);
      }

      .meta-empty {
        font-size: 0.85rem;
        color: var(--color-surface-light);
        font-style: italic;
      }

      .card-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--touch-target);
        height: var(--touch-target);
        border-radius: var(--border-radius-1);
        color: var(--color-text-muted);
        font-size: 1.2rem;
        cursor: pointer;
        flex-shrink: 0;
        border: none;
        background: none;
        transition: color 0.15s;
      }

      .card-action:active {
        color: var(--color-text);
      }

      .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: var(--space-xl);
        gap: var(--space-md);
      }

      .empty-title {
        font-size: 1.5rem;
        font-weight: bold;
      }

      .empty-hint {
        color: var(--color-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartiesComponent {
  view$: Observable<PartiesView>;

  iconBack = faArrowLeft;
  iconAdd = faPlus;
  iconMore = faEllipsis;

  constructor(
    private app: AppService,
    private partyService: PartyService,
    private router: Router,
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

  switchParty(partyId: string): void {
    this.partyService.switchParty(partyId);
  }

  goToDetail(partyId: string): void {
    this.router.navigate(['/parties', partyId]);
  }

  getPlayerNames(party: Party): string {
    return party.playerList.map((p) => p.name).join(', ');
  }
}
