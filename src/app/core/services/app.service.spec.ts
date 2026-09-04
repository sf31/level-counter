import { LSK_APP_STATE } from '../../const';
import { AppState, Player } from '../../types';
import { AppService } from './app.service';

describe('AppService', () => {
  const activePlayer: Player = {
    id: 'active-player',
    name: 'Active player',
    gender: 'M',
    level: 7,
    gears: 3,
    color: '#C62828',
  };
  const targetPlayer: Player = {
    id: 'target-player',
    name: 'Target player',
    gender: 'F',
    level: 5,
    gears: 2,
    color: '#2E7D32',
  };

  let service: AppService;

  beforeEach(() => {
    const state: AppState = {
      activePartyId: 'active-party',
      dismissPwa: null,
      parties: [
        {
          id: 'active-party',
          name: 'Active party',
          playerList: [activePlayer],
        },
        {
          id: 'target-party',
          name: 'Target party',
          playerList: [targetPlayer],
        },
      ],
    };
    localStorage.setItem(LSK_APP_STATE, JSON.stringify(state));
    service = new AppService();
  });

  afterEach(() => localStorage.removeItem(LSK_APP_STATE));

  it('adds a player to the requested party rather than the active party', () => {
    service.addPlayer('target-party', 'New player');

    const state = service.getStateSnapshot();
    expect(state.parties[0].playerList).toEqual([activePlayer]);
    expect(state.parties[1].playerList.map((player) => player.name)).toEqual([
      'Target player',
      'New player',
    ]);
  });

  it('removes a player from the requested party rather than the active party', () => {
    service.removePlayer('target-party', targetPlayer);

    const state = service.getStateSnapshot();
    expect(state.parties[0].playerList).toEqual([activePlayer]);
    expect(state.parties[1].playerList).toEqual([]);
  });

  it('resets players in the requested party rather than the active party', () => {
    service.resetPlayers('target-party');

    const state = service.getStateSnapshot();
    expect(state.parties[0].playerList).toEqual([activePlayer]);
    expect(state.parties[1].playerList[0]).toEqual({
      ...targetPlayer,
      level: 1,
      gears: 0,
    });
  });
});
