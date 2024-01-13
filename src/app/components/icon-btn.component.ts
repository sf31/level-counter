import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BtnComponent } from './btn.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-icon-btn',
  standalone: true,
  imports: [BtnComponent, FontAwesomeModule, NgIf],
  template: `
    <div class="icon-btn" *ngIf="icon" [style.background-color]="color">
      <fa-icon [icon]="icon" />
    </div>
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
