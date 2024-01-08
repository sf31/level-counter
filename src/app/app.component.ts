import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {
  constructor(private app: AppService) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: Event) {
    e.preventDefault();
    this.app.patchPwaState({ promptEvent: e as any });
  }

  // public installPWA() {
  //   this.promptEvent?.prompt();
  // }

  // public shouldInstall(): boolean {
  //   return !this.isRunningStandalone() && this.promptEvent;
  // }

  // public isRunningStandalone(): boolean {
  //   return window.matchMedia('(display-mode: standalone)').matches;
  // }
}
