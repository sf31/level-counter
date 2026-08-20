import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, map } from 'rxjs';
import { AppService } from '../../core/services/app.service';
import { PartyService } from './party.service';
import { PartyListEmptyComponent } from './party-list-empty.component';
import { PartyListItemComponent } from './party-list-item.component';

@Component({
  selector: 'app-party-list',
  imports: [
    AsyncPipe,
    FontAwesomeModule,
    PartyListEmptyComponent,
    PartyListItemComponent,
    RouterLink,
  ],
  template: `
    @if (view$ | async; as view) {
      <section class="content" aria-labelledby="parties-title">
        <div class="heading">
          <h1 id="parties-title">Parties</h1>
          <p>Select a party to return to the game.</p>
        </div>

        <a
          class="create-party"
          routerLink="/parties/new"
          [state]="partySetupNavigationState"
          [replaceUrl]="true"
        >
          <fa-icon [icon]="iconAdd" />
          Create Party
        </a>

        <div class="party-list" aria-label="Parties">
          @for (party of view.parties; track party.id) {
            <app-party-list-item
              [party]="party"
              [activePartyId]="view.activePartyId"
              (selected)="switchParty(party.id)"
            />
          } @empty {
            <app-party-list-empty />
          }
        </div>
      </section>
    }
  `,
  styles: [
    `
      .content {
        min-height: 100%;
        padding: var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-lg);
      }

      .heading {
        width: 100%;
        max-width: 560px;
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

      .create-party {
        min-height: var(--touch-target);
        padding: var(--space-sm) var(--space-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-sm);
        border-radius: var(--border-radius-1);
        background-color: var(--color-accent);
        color: var(--color-on-accent);
        font-weight: var(--font-weight-strong);
        cursor: pointer;
        text-decoration: none;
      }

      .party-list {
        width: 100%;
        max-width: 560px;
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      @media (min-width: 768px) {
        .content {
          padding: var(--space-xl);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyListComponent {
  private readonly app = inject(AppService);
  private readonly partyService = inject(PartyService);

  protected readonly iconAdd = faPlus;
  protected readonly partySetupNavigationState = {
    setupBackUrl: '/parties',
  };

  protected readonly view$ = combineLatest([
    this.app.select$('parties'),
    this.app.select$('activePartyId'),
  ]).pipe(
    map(([parties, activePartyId]) => ({
      parties,
      activePartyId,
    })),
  );

  protected switchParty(partyId: string): void {
    this.partyService.switchParty(partyId);
  }
}
