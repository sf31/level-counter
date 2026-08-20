import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
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
    ReactiveFormsModule,
  ],
  template: `
    @if (view$ | async; as view) {
      <section class="content" aria-labelledby="parties-title">
        <div class="heading">
          <h1 id="parties-title">Parties</h1>
          <p>Select a party to return to the game.</p>
        </div>

        @if (isCreating()) {
          <form
            class="create-form"
            [formGroup]="createPartyForm"
            (ngSubmit)="addParty()"
          >
            <label for="party-name">Party name</label>
            <div class="create-row">
              <input
                id="party-name"
                type="text"
                placeholder="New party name..."
                autocomplete="off"
                autofocus
                formControlName="name"
              />
              <button
                class="icon-action confirm"
                type="submit"
                [disabled]="createPartyForm.invalid"
                aria-label="Create party"
              >
                <fa-icon [icon]="iconConfirm" />
              </button>
              <button
                class="icon-action cancel"
                type="button"
                aria-label="Cancel party creation"
                (click)="cancelCreating()"
              >
                <fa-icon [icon]="iconCancel" />
              </button>
            </div>
          </form>
        } @else {
          <button class="create-party" type="button" (click)="startCreating()">
            <fa-icon [icon]="iconAdd" />
            Create Party
          </button>
        }

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
      }

      .create-form {
        width: 100%;
        max-width: 560px;
      }

      .create-form label {
        display: block;
        margin-bottom: var(--space-xs);
        color: var(--color-text-muted);
        font-size: var(--font-size-caption);
      }

      .create-row {
        display: flex;
        gap: var(--space-sm);
      }

      .create-row input {
        flex: 1;
        min-width: 0;
      }

      .icon-action {
        width: var(--touch-target);
        height: var(--touch-target);
        flex-shrink: 0;
        border-radius: var(--border-radius-1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .icon-action.confirm {
        background-color: var(--color-success);
      }

      .icon-action.confirm:disabled {
        opacity: 0.45;
        cursor: default;
      }

      .icon-action.cancel {
        background-color: var(--color-bg-lighter);
        color: var(--color-text-muted);
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
  protected readonly iconConfirm = faCheck;
  protected readonly iconCancel = faXmark;
  protected readonly isCreating = signal(false);
  protected readonly createPartyForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/)],
    }),
  });

  protected readonly view$ = combineLatest([
    this.app.select$('parties'),
    this.app.select$('activePartyId'),
  ]).pipe(
    map(([parties, activePartyId]) => ({
      parties,
      activePartyId,
    })),
  );

  protected startCreating(): void {
    this.isCreating.set(true);
  }

  protected cancelCreating(): void {
    this.createPartyForm.reset();
    this.isCreating.set(false);
  }

  protected addParty(): void {
    const name = this.createPartyForm.controls.name.value.trim();
    if (!name) return;

    this.partyService.addParty(name);
    this.cancelCreating();
  }

  protected switchParty(partyId: string): void {
    this.partyService.switchParty(partyId);
  }
}
