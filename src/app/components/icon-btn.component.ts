import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-icon-btn',
  imports: [FontAwesomeModule],
  template: `
    @if (icon) {
      <div class="icon-btn" [style.background-color]="color">
        <fa-icon [icon]="icon" />
      </div>
    }
    `,
  styles: [
    `
      .icon-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--border-radius-1);
        color: #fff;
        background-color: #8d6e63;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconBtnComponent {
  @Input() icon?: IconDefinition;
  @Input() color?: string;
}
