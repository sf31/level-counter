import { Component, OnDestroy } from '@angular/core';
import { ScreenTitleComponent } from './screen-title.component';
import { NgForOf, NgIf } from '@angular/common';
import { randomIntFromInterval } from '../utils';
import { BtnComponent } from './btn.component';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { BackBtnComponent } from './back-btn.component';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [
    ScreenTitleComponent,
    NgForOf,
    BtnComponent,
    NgIf,
    FontAwesomeModule,
    RouterLink,
    BackBtnComponent,
  ],
  template: `
    <div class="dice-wrapper" (click)="roll()">
      <div class="top">
        <app-screen-title title="Tap to roll" />
      </div>
      <div class="dice">
        <div class="face f-{{ currentFace }}">
          <div class="no-face" *ngIf="currentFace === null">
            <fa-icon [icon]="noFaceIcon" />
          </div>
          <ng-container *ngIf="currentFace">
            <ng-container *ngFor="let item of [].constructor(currentFace)">
              <div class="dot"></div>
            </ng-container>
          </ng-container>
        </div>
      </div>
      <div class="bottom">
        <app-back-btn route="" />
      </div>
    </div>
  `,
  styles: [
    `
      .dice-wrapper {
        height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .top,
      .dice,
      .bottom {
        align-self: center;
        justify-self: center;
        padding: 1rem;
      }

      .no-face {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.5rem;
      }

      .face {
        width: 100px;
        height: 100px;
        background-color: #fff;
        display: grid;
        border-radius: 10px;
      }

      .dot {
        justify-self: center;
        align-self: center;
      }

      .f-1 {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
      }

      .f-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:last-child {
          grid-column: 2;
          grid-row: 2;
        }
      }

      .f-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:nth-child(2) {
          grid-column: 2;
          grid-row: 2;
        }
        & > .dot:last-child {
          grid-column: 3;
          grid-row: 3;
        }
      }

      .f-4 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
      }

      .f-5 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:nth-child(2) {
          grid-column: 3;
          grid-row: 1;
        }
        & > .dot:nth-child(3) {
          grid-column: 2;
          grid-row: 2;
        }
        & > .dot:nth-child(4) {
          grid-column: 1;
          grid-row: 3;
        }
        & > .dot:last-child {
          grid-column: 3;
          grid-row: 3;
        }
      }

      .f-6 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
        & > .dot:first-child {
          grid-column: 1;
          grid-row: 1;
        }
        & > .dot:nth-child(2) {
          grid-column: 3;
          grid-row: 1;
        }
        & > .dot:nth-child(3) {
          grid-column: 1;
          grid-row: 2;
        }
        & > .dot:nth-child(4) {
          grid-column: 3;
          grid-row: 2;
        }
        & > .dot:nth-child(5) {
          grid-column: 1;
          grid-row: 3;
        }
        & > .dot:last-child {
          grid-column: 3;
          grid-row: 3;
        }
      }

      .dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #000;
      }

      @keyframes roll {
        0% {
          transform: rotateX(0deg) rotateY(0deg);
        }
        25% {
          transform: rotateX(0deg) rotateY(90deg);
        }
        50% {
          transform: rotateX(0deg) rotateY(180deg);
        }
        75% {
          transform: rotateX(0deg) rotateY(270deg);
        }
        100% {
          transform: rotateX(0deg) rotateY(360deg);
        }
      }

      .bottom {
        width: 200px;
      }
    `,
  ],
})
export class DiceComponent implements OnDestroy {
  currentFace: number | null = null;
  rollTimer: number | null = null;
  noFaceIcon = faQuestion;

  roll(): void {
    if (this.rollTimer !== null) return;
    let runs = 10;
    this.rollTimer = setInterval(() => {
      this.currentFace = randomIntFromInterval(1, 6);
      if (runs-- === 0) {
        if (this.rollTimer !== null) clearInterval(this.rollTimer);
        this.rollTimer = null;
      }
    }, 70);
  }

  ngOnDestroy(): void {
    if (this.rollTimer !== null) {
      clearInterval(this.rollTimer);
      this.rollTimer = null;
    }
  }
}
