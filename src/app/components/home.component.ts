import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PlayerComponent } from './player.component';
import { Observable } from 'rxjs';
import { Player } from '../types';
import { AppService } from '../app.service';
import { BtnComponent } from './btn.component';
import {
  faCog,
  faDice,
  faDownLong,
  faRotateLeft,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RemovePlayerComponent } from './remove-player.component';
import { IconBtnComponent } from './icon-btn.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PlayerComponent,
    RouterLink,
    BtnComponent,
    FontAwesomeModule,
    PlayerComponent,
    RemovePlayerComponent,
    IconBtnComponent,
  ],
  template: `
    <ng-container *ngIf="playerList$ | async as list">
      <div class="actions">
        <app-icon-btn routerLink="add-player" [icon]="iconAddPlayer" />
        <app-icon-btn routerLink="remove-player" [icon]="iconRemovePlayer" />
        <div class="fill-remaining-space"></div>
        <!--        <app-icon-btn [icon]="iconDice" />-->
        <!--        <div class="fill-remaining-space"></div>-->
        <!--        <app-icon-btn routerLink="pwa" color="red" [icon]="iconPwa" />-->
        <app-icon-btn routerLink="reset" [icon]="iconReset" />
      </div>

      <div class="player-list">
        <app-player *ngFor="let player of list" [player]="player" />
      </div>

      <div class="no-player" *ngIf="list.length === 0">
        <div>Mmmh...</div>
        <div>No one here yet!</div>
        <div>Use <fa-icon [icon]="iconAddPlayer" /> above to start</div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      :host {
        height: 100dvh;
        overflow: hidden;
      }

      .actions {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        gap: 0.5rem;
      }

      .player-list {
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
      }

      .no-player {
        text-align: center;
        font-size: 1.5rem;
        color: #fff;
        padding: 3rem 1rem;
      }

      .no-player > div:first-child {
        font-size: 2.5rem;
      }

      .no-player > div {
        margin: 2rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  playerList$: Observable<Player[]>;
  iconSettings = faCog;
  iconAddPlayer = faUserPlus;
  iconRemovePlayer = faUserMinus;
  iconDice = faDice;
  iconReset = faRotateLeft;
  iconPwa = faDownLong;

  constructor(private app: AppService) {
    this.playerList$ = this.app.select$('playerList');
  }
}
