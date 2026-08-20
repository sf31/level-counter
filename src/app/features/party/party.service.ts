import { Injectable } from '@angular/core';
import { AppService } from '../../core/services/app.service';
import { Party, Player } from '../../types';
import * as uuid from 'uuid';
import {
  removeElementFromArray,
  upsertElementInArray,
} from '../../core/utils/array.utils';
import { Router } from '@angular/router';
import { randomIntFromInterval } from '../../core/utils/app.utils';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  constructor(
    private app: AppService,
    private router: Router,
  ) {}

  createParty(
    name: string,
    players: readonly Pick<Player, 'name' | 'color'>[],
  ): Party {
    const state = this.app.getStateSnapshot();
    const party: Party = {
      id: uuid.v4(),
      name,
      playerList: players.map((player) => ({
        id: uuid.v4(),
        name: player.name,
        gender: randomIntFromInterval(0, 10) % 2 === 0 ? 'M' : 'F',
        level: 1,
        gears: 0,
        color: player.color,
      })),
    };
    const parties = [...state.parties, party];
    this.app.patchState({ parties, activePartyId: party.id });
    return party;
  }

  removeParty(party: Party): void {
    const state = this.app.getStateSnapshot();
    const parties = removeElementFromArray(state.parties, party, 'id');
    const isActive = state.activePartyId === party.id;
    this.app.patchState({
      parties,
      ...(isActive ? { activePartyId: parties[0]?.id ?? null } : {}),
    });

    if (isActive) {
      this.router.navigate(['/parties'], { replaceUrl: true });
    }
  }

  renameParty(partyId: string, newName: string): void {
    const state = this.app.getStateSnapshot();
    const party = state.parties.find((p) => p.id === partyId);
    if (!party) return;

    const updated = { ...party, name: newName };
    const parties = upsertElementInArray(state.parties, updated, 'id');
    this.app.patchState({ parties });
  }

  switchParty(partyId: string): void {
    this.app.patchState({ activePartyId: partyId });
    this.router.navigate([''], { replaceUrl: true });
  }
}
