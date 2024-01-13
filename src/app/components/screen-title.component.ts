import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-screen-title',
  standalone: true,
  imports: [],
  template: ` {{ title }} `,
  styles: [
    `
      :host {
        color: #fff;
        font-size: 1.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenTitleComponent {
  @Input() title?: string;
}
