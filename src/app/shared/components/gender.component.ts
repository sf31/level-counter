import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Player } from '../../types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gender',
  imports: [FontAwesomeModule],
  template: `
    <button
      class="gender-picker"
      type="button"
      [attr.aria-label]="genderLabel()"
      (click)="toggle.emit()"
    >
      <span class="icon" [class.active]="player().gender === 'M'">
        <fa-icon [icon]="iconMale" aria-hidden="true" />
      </span>
      <span class="icon" [class.active]="player().gender === 'F'">
        <fa-icon [icon]="iconFemale" aria-hidden="true" />
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
        width: fit-content;
      }

      .gender-picker {
        min-height: var(--touch-target);
        padding: var(--space-xs);
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        background-color: var(--color-toggle-track);
        border-radius: var(--border-radius-pill);
        cursor: pointer;
      }

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        color: var(--color-on-accent);
        opacity: 0.55;
        transition:
          background-color var(--duration-fast),
          color var(--duration-fast),
          opacity var(--duration-fast);
      }

      .active {
        background-color: var(--color-toggle-thumb);
        color: var(--color-text);
        opacity: 1;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderComponent {
  readonly player = input.required<Player>();
  readonly toggle = output<void>();

  protected readonly iconMale = faMars;
  protected readonly iconFemale = faVenus;

  protected genderLabel(): string {
    const isMale = this.player().gender === 'M';
    return `Gender: ${isMale ? 'male' : 'female'}. Switch to ${isMale ? 'female' : 'male'}`;
  }
}
