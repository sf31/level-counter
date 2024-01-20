import { Injectable } from '@angular/core';
import { AppState, Player } from './types';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { INITIAL_APP_STATE, LSK_APP_STATE, PLAYER_COLORS } from './const';
import * as uuid from 'uuid';
import { randomIntFromInterval, validateLocalStorage } from './utils';
import {
  removeElementFromArray,
  upsertElementInArray,
} from './utils/array.utils';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _state = new BehaviorSubject<AppState>(INITIAL_APP_STATE);

  constructor() {
    const playerListRaw = localStorage.getItem(LSK_APP_STATE);
    const state = validateLocalStorage(playerListRaw);
    this.patchState(state);
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

  addPlayer(name: string): void {
    const playersCount = this.getPlayerList().length;
    const color = getFirstAvailableColor(this.getPlayerList());
    if (playersCount >= PLAYER_COLORS.length || !color)
      throw new Error('Too many players');

    const player: Player = {
      id: uuid.v4(),
      name,
      gender: randomIntFromInterval(0, 10) % 2 === 0 ? 'M' : 'F',
      level: 1,
      gears: 0,
      color,
    };
    const playerList = [...this.getPlayerList(), player];
    this.patchState({ playerList });
  }

  removePlayer(player: Player): void {
    this.patchState({
      playerList: removeElementFromArray(this.getPlayerList(), player, 'id'),
    });
  }

  updatePlayer(player: Player): void {
    this.patchState({
      playerList: upsertElementInArray(this.getPlayerList(), player, 'id'),
    });
  }

  resetPlayers(): void {
    const playerList = this.getPlayerList().map((p) => {
      return { ...p, level: 1, gears: 0 };
    });
    this.patchState({ playerList });
  }
}

function getFirstAvailableColor(playerList: Player[]): string | null {
  const availableColors = PLAYER_COLORS.filter(
    (c) => !playerList.find((p) => p.color === c),
  );
  return availableColors.length > 0 ? availableColors[0] : null;
}
