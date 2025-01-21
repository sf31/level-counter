import { APP_STATE, AppState } from '../types';
import { INITIAL_APP_STATE } from '../const';

export function validateLocalStorage(storageValue: string | null): AppState {
  if (!storageValue) return INITIAL_APP_STATE;
  const appState = APP_STATE.safeParse(JSON.parse(storageValue));
  if (!appState.success) return INITIAL_APP_STATE;
  const dismissPwa = validateDismissPwa(appState.data.dismissPwa);
  return { ...appState.data, dismissPwa };
}

function validateDismissPwa(unix: number | null): number | null {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  // if last dismissed is more than a week ago, reset user choice to trigger the PWA prompt again
  // (yes, I'll get you installed, one way or another :) )
  if (!unix || unix < now - week) return null;
  return unix;
}
