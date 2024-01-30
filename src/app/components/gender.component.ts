import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Player } from '../types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-gender',
  standalone: true,
  imports: [FontAwesomeModule, NgIf],
  template: `
    <div class="icon" [class.active]="player?.gender === 'M'">
      <fa-icon [icon]="iconMale" />
    </div>
    <div class="icon" [class.active]="player?.gender === 'F'">
      <fa-icon [icon]="iconFemale" />
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        background-color: #c9c9c9;
        border-radius: 30px;
        width: fit-content;
      }

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        padding: 0.4rem;
      }

      .active {
        background-color: #818181;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderComponent {
  @Input() player?: Player;
  iconMale = faMars;
  iconFemale = faVenus;
}
