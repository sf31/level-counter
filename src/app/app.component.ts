import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
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
