import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-floating-btn',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <div class="floating-btn">
      <fa-icon [icon]="icon" />
    </div>
  `,
  styles: [
    `
      .floating-btn {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        width: 3.8rem;
        height: 3.8rem;
        border-radius: 50%;
        background-color: #9e9e9e;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.7rem;
        box-shadow:
          0 3px 6px rgba(0, 0, 0, 0.16),
          0 3px 6px rgba(0, 0, 0, 0.23);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingBtnComponent {
  @Input() icon: IconDefinition = faPlus;
}
