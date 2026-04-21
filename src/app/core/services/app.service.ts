import { Injectable } from '@angular/core';
import { AppState, Party, Player } from '../../types';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';
import { INITIAL_APP_STATE, LSK_APP_STATE, PLAYER_COLORS } from '../../const';
import * as uuid from 'uuid';
import {
  removeElementFromArray,
  upsertElementInArray,
} from '../utils/array.utils';
import { validateLocalStorage } from '../utils/validation.utils';
import { randomIntFromInterval } from '../utils/app.utils';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _state = new BehaviorSubject<AppState>(INITIAL_APP_STATE);

  /** The currently active party (or undefined if none selected). */
  activeParty$: Observable<Party | undefined>;

  /** The player list of the active party (empty array if no active party). */
  activePlayerList$: Observable<Player[]>;

  constructor() {
    const raw = localStorage.getItem(LSK_APP_STATE);
    const state = validateLocalStorage(raw);
    this.patchState(state);

    this.activeParty$ = this._state.pipe(
      map((s) => s.parties.find((p) => p.id === s.activePartyId)),
      distinctUntilChanged(),
    );

    this.activePlayerList$ = this.activeParty$.pipe(
      map((party) => party?.playerList ?? []),
      distinctUntilChanged(),
    );
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

  getStateSnapshot(): AppState {
    return this._state.getValue();
  }

  patchState(state: Partial<AppState>): void {
    this._state.next({ ...this._state.getValue(), ...state });
    localStorage.setItem(LSK_APP_STATE, JSON.stringify(this._state.getValue()));
  }

  // ── Player methods (operate on active party) ────────────────────────

  addPlayer(name: string): void {
    const party = this.getActiveParty();
    if (!party) return;

    const color = getFirstAvailableColor(party.playerList);
    if (party.playerList.length >= PLAYER_COLORS.length || !color)
      throw new Error('Too many players');

    const player: Player = {
      id: uuid.v4(),
      name,
      gender: randomIntFromInterval(0, 10) % 2 === 0 ? 'M' : 'F',
      level: 1,
      gears: 0,
      color,
    };

    this.updateActiveParty({
      ...party,
      playerList: [...party.playerList, player],
    });
  }

  removePlayer(player: Player): void {
    const party = this.getActiveParty();
    if (!party) return;

    this.updateActiveParty({
      ...party,
      playerList: removeElementFromArray(party.playerList, player, 'id'),
    });
  }

  updatePlayer(player: Player): void {
    const party = this.getActiveParty();
    if (!party) return;

    this.updateActiveParty({
      ...party,
      playerList: upsertElementInArray(party.playerList, player, 'id'),
    });
  }

  resetPlayers(): void {
    const party = this.getActiveParty();
    if (!party) return;

    this.updateActiveParty({
      ...party,
      playerList: party.playerList.map((p) => ({ ...p, level: 1, gears: 0 })),
    });
  }

  // ── Internal helpers ────────────────────────────────────────────────

  private getActiveParty(): Party | undefined {
    const state = this._state.getValue();
    return state.parties.find((p) => p.id === state.activePartyId);
  }

  private updateActiveParty(updatedParty: Party): void {
    const state = this._state.getValue();
    const parties = upsertElementInArray(state.parties, updatedParty, 'id');
    this.patchState({ parties });
  }
}

function getFirstAvailableColor(playerList: Player[]): string | null {
  const availableColors = PLAYER_COLORS.filter(
    (c) => !playerList.find((p) => p.color === c),
  );
  return availableColors.length > 0 ? availableColors[0] : null;
}
