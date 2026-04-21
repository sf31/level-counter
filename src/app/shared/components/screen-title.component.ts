import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-screen-title',
  imports: [],
  template: ` {{ title() }} `,
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
  title = input<string>();
}
