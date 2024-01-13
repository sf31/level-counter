import { Injectable } from '@angular/core';
import { AppState, Player, PwaUpdateState } from './types';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { INITIAL_APP_STATE, LSK_APP_STATE, PLAYER_COLORS } from './const';
import * as uuid from 'uuid';
import { randomIntFromInterval, validateLocalStorage } from './utils';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _state = new BehaviorSubject<AppState>(INITIAL_APP_STATE);
  private _pwaState = new BehaviorSubject<PwaUpdateState>({
    promptEvent: null,
    isRunningStandalone: window.matchMedia('(display-mode: standalone)')
      .matches,
    updateAvailable: false,
    installPending: false,
  });

  constructor(private sw: SwUpdate) {
    const playerListRaw = localStorage.getItem(LSK_APP_STATE);
    const state = validateLocalStorage(playerListRaw);
    this.patchState(state);

    this.sw.versionUpdates.subscribe((e) => {
      if (e.type === 'VERSION_READY')
        this._pwaState.next({
          ...this._pwaState.getValue(),
          updateAvailable: true,
        });
    });
  }

  private getPlayerList(): Player[] {
    return this._state.getValue().playerList;
  }

  select$<T extends keyof AppState>(
    field: T,
    distinctFn?: (a: AppState[T], b: AppState[T]) => boolean,
  ): Observable<AppState[typeof field]> {
    const defaultFn = (a: AppState[T], b: AppState[T]) => a === b;
    return this._state.pipe(
      map((state) => state[field]),
      distinctUntilChanged(distinctFn ?? defaultFn),
    );
  }

  patchState(state: Partial<AppState>): void {
    this._state.next({ ...this._state.getValue(), ...state });
    localStorage.setItem(LSK_APP_STATE, JSON.stringify(this._state.getValue()));
  }

  patchPwaState(state: Partial<PwaUpdateState>): void {
    this._pwaState.next({ ...this._pwaState.getValue(), ...state });
  }

  getPwaState$(): Observable<PwaUpdateState> {
    return this._pwaState.asObservable();
  }

  addPlayer(name: string): void {
    const playersCount = this.getPlayerList().length;
    if (playersCount >= PLAYER_COLORS.length)
      throw new Error('Too many players');

    const player: Player = {
      id: uuid.v4(),
      name,
      gender: randomIntFromInterval(0, 10) % 2 === 0 ? 'M' : 'F',
      level: 1,
      gears: 0,
      color: PLAYER_COLORS[playersCount],
    };
    const playerList = [...this.getPlayerList(), player];
    this.patchState({ playerList });
  }

  removePlayer(player: Player): void {
    const playerList = this.getPlayerList();
    const index = playerList.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      playerList.splice(index, 1);
      this.patchState({ playerList: playerList });
    }
  }

  updatePlayer(player: Player): void {
    const playerList = this.getPlayerList();
    const index = playerList.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      playerList[index] = player;
      this.patchState({ playerList: playerList });
    }
  }

  resetPlayers(): void {
    const playerList = this.getPlayerList().map((p) => {
      return { ...p, level: 1, gears: 0 };
    });
    this.patchState({ playerList });
  }
}
