import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [FontAwesomeModule],
  template: `
    <label [for]="controlId()">{{ label() }}</label>
    <div class="select-control">
      <select [id]="controlId()" [value]="value()" (change)="onChange($event)">
        @for (option of options(); track option.value) {
          <option [value]="option.value" [selected]="option.value === value()">
            {{ option.label }}
          </option>
        }
      </select>
      <fa-icon class="chevron" [icon]="chevronIcon" aria-hidden="true" />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      label {
        display: block;
        margin-bottom: var(--space-xs);
        color: var(--color-text-muted);
        font-size: var(--font-size-caption);
      }

      .select-control {
        position: relative;
      }

      select {
        width: 100%;
        min-height: var(--touch-target);
        margin: 0;
        padding: var(--space-sm) var(--space-xl) var(--space-sm) var(--space-md);
        appearance: none;
        border: var(--border-width) solid var(--color-border);
        border-radius: var(--border-radius-1);
        outline: none;
        background-color: var(--color-bg-lighter);
        box-shadow: var(--shadow-control);
        color: var(--color-text);
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        transition: border-color var(--duration-normal);
      }

      select:focus-visible {
        border-color: var(--color-accent);
        outline: var(--border-width-strong) solid var(--color-accent);
        outline-offset: var(--border-width-strong);
      }

      option {
        background-color: var(--color-bg-lighter);
        color: var(--color-text);
      }

      .chevron {
        position: absolute;
        top: 50%;
        right: var(--space-md);
        pointer-events: none;
        color: var(--color-text-muted);
        transform: translateY(-50%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  readonly controlId = input.required<string>();
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  readonly value = input.required<string>();
  readonly valueChange = output<string>();

  protected readonly chevronIcon = faChevronDown;

  protected onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
