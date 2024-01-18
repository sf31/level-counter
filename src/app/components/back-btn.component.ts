import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BtnComponent } from './btn.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-btn',
  standalone: true,
  imports: [BtnComponent, RouterLink],
  template: ` <app-btn (click)="back()"> Back </app-btn> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackBtnComponent {
  @Input() route?: string;

  constructor(private router: Router) {}

  back(): void {
    this.router.navigate([this.route], { replaceUrl: true });
  }
}
