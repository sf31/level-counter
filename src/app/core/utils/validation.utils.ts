import { APP_STATE, AppState, LEGACY_APP_STATE } from '../../types';
import { INITIAL_APP_STATE } from '../../const';
import * as uuid from 'uuid';

export function validateLocalStorage(storageValue: string | null): AppState {
  if (!storageValue) return INITIAL_APP_STATE;

  let parsed: unknown;
  try {
    parsed = JSON.parse(storageValue);
  } catch {
    return INITIAL_APP_STATE;
  }

  // Try parsing as current format first
  const currentResult = APP_STATE.safeParse(parsed);
  if (currentResult.success) {
    const dismissPwa = validateDismissPwa(currentResult.data.dismissPwa);
    return { ...currentResult.data, dismissPwa };
  }

  // Try parsing as legacy format (flat playerList) and migrate
  const legacyResult = LEGACY_APP_STATE.safeParse(parsed);
  if (legacyResult.success) {
    return migrateLegacyState(legacyResult.data);
  }

  return INITIAL_APP_STATE;
}

function migrateLegacyState(
  legacy: import('../../types').LegacyAppState,
): AppState {
  const dismissPwa = validateDismissPwa(legacy.dismissPwa);

  // If there were players, wrap them into a "Default" party
  if (legacy.playerList.length > 0) {
    const defaultParty = {
      id: uuid.v4(),
      name: 'Default',
      playerList: legacy.playerList,
    };
    return {
      parties: [defaultParty],
      activePartyId: defaultParty.id,
      dismissPwa,
    };
  }

  return { parties: [], activePartyId: null, dismissPwa };
}

function validateDismissPwa(unix: number | null): number | null {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  // if last dismissed is more than a week ago, reset user choice to trigger the PWA prompt again
  // (yes, I'll get you installed, one way or another :) )
  if (!unix || unix < now - week) return null;
  return unix;
}
