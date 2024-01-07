import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-plus-minus',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <fa-icon (click)="plus.emit()" [icon]="iconPlus" />
    <div class="label">{{ value }}</div>
    <fa-icon (click)="minus.emit()" [icon]="iconMinus" />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .label {
        font-size: 2rem;
        font-weight: bold;
      }

      fa-icon {
        cursor: pointer;
        padding: 0 0.5rem;
        font-size: 2.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMinusComponent {
  @Input() value?: string | number;
  @Output() plus = new EventEmitter<void>();
  @Output() minus = new EventEmitter<void>();

  iconMinus = faCaretDown;
  iconPlus = faCaretUp;
}
