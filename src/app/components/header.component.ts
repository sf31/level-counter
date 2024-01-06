import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="title">Polpetta</div>
    <div class="remove-all" (click)="removeAllPlayers()">
      Remove All Players
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: space-between;
        background-color: #9e9e9e;
        padding: 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private app: AppService) {}

  removeAllPlayers(): void {
    this.app.removeAllPlayers();
  }
}
