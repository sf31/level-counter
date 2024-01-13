import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [],
  template: ` <ng-content /> `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        background-color: #8d6e63;
        padding: 0.5rem;
        border-radius: var(--border-radius-1);
        color: #fff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {
  @Input() width = 'auto';
}
