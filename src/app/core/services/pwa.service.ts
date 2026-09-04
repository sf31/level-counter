import { Injectable } from '@angular/core';
import { BeforeInstallPromptEvent, PwaUpdateState } from '../../types';
import { BehaviorSubject } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { isRunningStandalone } from '../utils/app.utils';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private readonly initialStandaloneState = isRunningStandalone();
  private readonly pwaState = new BehaviorSubject<PwaUpdateState>({
    promptEvent: null,
    isRunningStandalone: this.initialStandaloneState,
    installStatus: this.initialStandaloneState ? 'installed' : 'unavailable',
    installError: null,
    updateAvailable: false,
    updateError: null,
  });
  readonly state$ = this.pwaState.asObservable();

  constructor(private sw: SwUpdate) {
    if (!this.sw.isEnabled) return;

    this.sw.versionUpdates.subscribe((e) => {
      switch (e.type) {
        case 'VERSION_READY':
          this.patchState({ updateAvailable: true, updateError: null });
          break;
        case 'VERSION_INSTALLATION_FAILED':
          this.patchState({
            updateError: $localize`A new version could not be installed.`,
          });
          break;
      }
    });

    this.sw.unrecoverable.subscribe(() => {
      this.patchState({
        updateError: $localize`The app needs to reload to recover.`,
      });
    });
  }

  captureInstallPrompt(event: BeforeInstallPromptEvent): void {
    const current = this.pwaState.getValue();
    if (current.isRunningStandalone || current.installStatus === 'installed') {
      return;
    }

    event.preventDefault();
    this.patchState({
      promptEvent: event,
      installStatus: 'available',
      installError: null,
    });
  }

  async install(): Promise<void> {
    const current = this.pwaState.getValue();
    const promptEvent = current.promptEvent;
    if (!promptEvent || current.installStatus !== 'available') return;

    this.patchState({ installStatus: 'prompting', installError: null });

    try {
      await promptEvent.prompt();
      this.patchState({ promptEvent: null });
      const choice = await promptEvent.userChoice;

      if (choice.outcome === 'accepted') {
        this.markInstalled();
      } else {
        this.patchState({ installStatus: 'dismissed' });
      }
    } catch {
      this.patchState({
        promptEvent: null,
        installStatus: 'error',
        installError: $localize`Installation could not be completed.`,
      });
    }
  }

  markInstalled(): void {
    this.patchState({
      promptEvent: null,
      isRunningStandalone: isRunningStandalone(),
      installStatus: 'installed',
      installError: null,
    });
  }

  refreshStandaloneState(): void {
    const standalone = isRunningStandalone();
    this.patchState({
      isRunningStandalone: standalone,
      ...(standalone
        ? { promptEvent: null, installStatus: 'installed' as const }
        : {}),
    });
  }

  private patchState(state: Partial<PwaUpdateState>): void {
    this.pwaState.next({ ...this.pwaState.getValue(), ...state });
  }
}
