import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AppService } from '../../core/services/app.service';
import { BtnComponent } from '../../shared/components/btn.component';
import { Router } from '@angular/router';
import { ScreenTitleComponent } from '../../shared/components/screen-title.component';
import { BackBtnComponent } from '../../shared/components/back-btn.component';

@Component({
  selector: 'app-reset',
  imports: [BtnComponent, ScreenTitleComponent, BackBtnComponent],
  template: `
    <app-screen-title title="Reset Levels & Gears" />
    <div class="text">
      <p>This will reset all levels and gears for all players</p>
      <p>Are you sure?</p>
    </div>
    <div class="actions">
      <app-back-btn route="" />
      <app-btn (click)="reset()"> Confirm </app-btn>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
      }

      .text {
        text-align: center;
        color: #fff;
        margin: 1rem 0;
      }

      .actions {
        display: flex;
        gap: 2rem;
      }

      app-back-btn,
      app-btn {
        width: 100px;
      }

      .actions app-btn:last-child {
        background-color: #43a047;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetComponent implements OnInit {
  constructor(
    private app: AppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const state = this.app.getStateSnapshot();
    if (!state.activePartyId) {
      this.router.navigate(['/parties'], { replaceUrl: true });
    }
  }

  reset(): void {
    this.app.resetPlayers();
    this.router.navigate([''], { replaceUrl: true }).catch();
  }
}
