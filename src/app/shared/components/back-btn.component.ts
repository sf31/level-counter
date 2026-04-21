import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BtnComponent } from './btn.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-btn',
  imports: [BtnComponent],
  template: ` <app-btn (click)="back()"> Back </app-btn> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackBtnComponent {
  route = input<string>();

  constructor(private router: Router) {}

  back(): void {
    this.router.navigate([this.route()], { replaceUrl: true });
  }
}
