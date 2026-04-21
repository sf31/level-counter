import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-plus-minus',
  imports: [FontAwesomeModule],
  template: `
    <fa-icon (click)="plus.emit()" [icon]="iconPlus" />
    <div class="value">{{ value() }}</div>
    <fa-icon (click)="minus.emit()" [icon]="iconMinus" />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .value {
        font-size: 1.5rem;
        font-weight: bold;
      }

      fa-icon {
        cursor: pointer;
        padding: var(--space-sm);
        font-size: 2.5rem;
        min-width: var(--touch-target);
        min-height: var(--touch-target);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      fa-icon:active {
        opacity: 0.7;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMinusComponent {
  value = input<string | number>();
  label = input<string>();
  plus = output<void>();
  minus = output<void>();

  iconMinus = faCaretDown;
  iconPlus = faCaretUp;
}
