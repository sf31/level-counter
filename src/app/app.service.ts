import { Injectable } from '@angular/core';
import { Player } from './types';
import { BehaviorSubject, Observable } from 'rxjs';
import { PLAYER_COLORS } from './const';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _playerList = new BehaviorSubject<Player[]>([]);
  private readonly LSK = 'level-count-app-state';

  constructor() {
    const playerList = localStorage.getItem(this.LSK);
    if (playerList) this._playerList.next(JSON.parse(playerList));
  }

  getPlayerList(): Observable<Player[]> {
    return this._playerList.asObservable();
  }

  private setPlayerList(playerList: Player[]): void {
    this._playerList.next(playerList);
    localStorage.setItem(this.LSK, JSON.stringify(playerList));
  }

  addPlayer(playerName: string, gender: 'M' | 'F'): void {
    const playersCount = this._playerList.getValue().length;
    const existingPlayer = this.getPlayer(playerName);
    if (existingPlayer) throw new Error('Player already exists');
    if (playersCount >= PLAYER_COLORS.length)
      throw new Error('Too many players');

    const player: Player = {
      name: playerName,
      gender,
      level: 1,
      color: PLAYER_COLORS[playersCount],
    };
    this.setPlayerList([...this._playerList.getValue(), player]);
  }

  removePlayer(player: Player): void {
    const playerList = this._playerList.getValue();
    const index = playerList.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      playerList.splice(index, 1);
      this.setPlayerList(playerList);
    }
  }

  updatePlayer(player: Player): void {
    const playerList = this._playerList.getValue();
    const index = playerList.findIndex((p) => p.name === player.name);
    if (index !== -1) {
      playerList[index] = player;
      this.setPlayerList(playerList);
    }
  }

  removeAllPlayers(): void {
    this.setPlayerList([]);
  }

  private getPlayer(name: string): Player | null {
    const playerList = this._playerList.getValue();
    return playerList.find((p) => p.name === name) || null;
  }
}
