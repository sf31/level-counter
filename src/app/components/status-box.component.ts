import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-box',
  standalone: true,
  imports: [],
  template: ``,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBoxComponent {
  @Input() type: 'success' | 'error' | 'warning' = 'success';
}
