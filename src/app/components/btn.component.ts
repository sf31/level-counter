import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [],
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      background-color: #9e9e9e;
      padding: 0.5rem;
      border-radius: var(--border-radius-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {}
