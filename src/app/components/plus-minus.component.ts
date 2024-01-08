import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-plus-minus',
  standalone: true,
  imports: [FontAwesomeModule, NgIf],
  template: `
    <fa-icon (click)="plus.emit()" [icon]="iconPlus" />
    <div class="value">{{ value }}</div>
    <fa-icon (click)="minus.emit()" [icon]="iconMinus" />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .label,
      .value {
        font-size: 1.5rem;
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
  @Input() label?: string;
  @Output() plus = new EventEmitter<void>();
  @Output() minus = new EventEmitter<void>();

  iconMinus = faCaretDown;
  iconPlus = faCaretUp;
}
