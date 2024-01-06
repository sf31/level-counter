import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <div class="title">Polpetta</div>
    <div class="add-player" (click)="addPlayer()">Add Player</div>
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

  addPlayer(): void {
    const rnd = Math.floor(Math.random() * 100);
    this.app.addPlayer(`Player ${rnd}`, rnd % 2 === 0 ? 'M' : 'F');
  }

  removeAllPlayers(): void {
    this.app.removeAllPlayers();
  }
}
