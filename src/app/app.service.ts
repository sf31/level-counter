import { Injectable } from '@angular/core';
import { Player, PwaUpdateState } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { PLAYER_COLORS } from './const';
import * as uuid from 'uuid';
import { randomIntFromInterval, validateLocalStorage } from './utils';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _playerList$ = new BehaviorSubject<Player[]>([]);
  private _pwaState = new BehaviorSubject<PwaUpdateState>({
    promptEvent: null,
    isRunningStandalone: window.matchMedia('(display-mode: standalone)')
      .matches,
    updateAvailable: false,
    installPending: false,
  });
  private readonly LSK = 'level-count-app-state';

  constructor(private sw: SwUpdate) {
    const playerListRaw = localStorage.getItem(this.LSK);
    this._playerList$.next(validateLocalStorage(playerListRaw));

    this.sw.versionUpdates.subscribe((e) => {
      if (e.type === 'VERSION_READY')
        this._pwaState.next({
          ...this._pwaState.getValue(),
          updateAvailable: true,
        });
    });
  }

  private setPlayerList(playerList: Player[]): void {
    this._playerList$.next(playerList);
    localStorage.setItem(this.LSK, JSON.stringify(playerList));
  }

  patchPwaState(state: Partial<PwaUpdateState>): void {
    this._pwaState.next({ ...this._pwaState.getValue(), ...state });
  }

  getPwaState(): Observable<PwaUpdateState> {
    return this._pwaState.asObservable();
  }

  getPlayerList(): Observable<Player[]> {
    return this._playerList$.asObservable();
  }

  addPlayer(name: string): void {
    const playersCount = this._playerList$.getValue().length;
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
    this.setPlayerList([...this._playerList$.getValue(), player]);
  }

  removePlayer(player: Player): void {
    const playerList = this._playerList$.getValue();
    const index = playerList.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      playerList.splice(index, 1);
      this.setPlayerList(playerList);
    }
  }

  updatePlayer(player: Player): void {
    const playerList = this._playerList$.getValue();
    const index = playerList.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      playerList[index] = player;
      this.setPlayerList(playerList);
    }
  }

  removeAllPlayers(): void {
    this.setPlayerList([]);
  }

  resetPlayers(): void {
    const playerList = this._playerList$.getValue();
    this.setPlayerList(
      playerList.map((p) => {
        return { ...p, level: 1, gears: 0 };
      }),
    );
  }
}
