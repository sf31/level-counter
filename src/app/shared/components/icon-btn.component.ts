import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-icon-btn',
  imports: [FontAwesomeModule],
  template: `
    @if (icon()) {
      <div class="icon-btn" [style.background-color]="color()">
        <fa-icon [icon]="icon()!" />
      </div>
    }
  `,
  styles: [
    `
      .icon-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--touch-target);
        height: var(--touch-target);
        border-radius: var(--border-radius-1);
        color: var(--color-text);
        background-color: var(--color-surface);
        cursor: pointer;
        transition: opacity var(--duration-fast);
      }

      .icon-btn:active {
        opacity: 0.8;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconBtnComponent {
  icon = input<IconDefinition>();
  color = input<string>();
}
