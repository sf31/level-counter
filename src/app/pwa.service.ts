import { Injectable } from '@angular/core';
import { PwaUpdateState } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { isRunningStandalone } from './utils';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private _pwaState = new BehaviorSubject<PwaUpdateState>({
    promptEvent: null,
    isRunningStandalone: isRunningStandalone(),
    updateAvailable: false,
    installPending: false,
  });

  constructor(private sw: SwUpdate) {
    this.sw.versionUpdates.subscribe((e) => {
      if (e.type === 'VERSION_READY')
        this._pwaState.next({
          ...this._pwaState.getValue(),
          updateAvailable: true,
        });
    });
  }

  getState$(): Observable<PwaUpdateState> {
    return this._pwaState.asObservable();
  }

  patchState(state: Partial<PwaUpdateState>): void {
    this._pwaState.next({ ...this._pwaState.getValue(), ...state });
  }

  updateIsRunningStandalone(): void {
    this._pwaState.next({
      ...this._pwaState.getValue(),
      isRunningStandalone: isRunningStandalone(),
    });
  }
}
