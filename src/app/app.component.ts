import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {
  constructor(private pwa: PwaService) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event) {
    e.preventDefault();
    this.pwa.patchState({ promptEvent: e as any });
  }
}
