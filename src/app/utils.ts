import { AppState, Player } from './types';
import { INITIAL_APP_STATE } from './const';

export function isRunningStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function validateLocalStorage(storageValue: string | null): AppState {
  // TODO add stricter validation
  try {
    if (!storageValue) return INITIAL_APP_STATE;
    const parsed = JSON.parse(storageValue);
    const playerList = validatePlayerList(parsed['playerList']);
    const dismissPwa = validateDismissPwa(parsed['dismissPwa']);
    return { playerList, dismissPwa };
  } catch (error) {
    console.log(error);
    return INITIAL_APP_STATE;
  }
}

export function validatePlayerList(storageValue: any): Player[] {
  if (!storageValue) return [];
  if (!Array.isArray(storageValue)) return [];
  for (const player of storageValue) {
    try {
      validateString(player.id);
      validateString(player.name);
      validateNumber(player.level);
      validateNumber(player.gears);
      validateGender(player.gender);
      validateString(player.color);
    } catch (error) {
      return [];
    }
  }

  return storageValue;
}

function validateString(value: any): void {
  if (typeof value !== 'string' || value.length === 0)
    throw new Error('Invalid string');
}

function validateNumber(value: any): void {
  if (typeof value !== 'number' || value < 0) throw new Error('Invalid number');
}

function validateGender(value: any): void {
  if (value !== 'M' && value !== 'F') throw Error('Invalid gender');
}

function validateDismissPwa(value: any): number | null {
  if (!value) return null;
  const parsed = parseInt(value);
  if (isNaN(parsed)) return null;
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  // if last dismissed is more than a week ago, reset user choice to trigger the PWA prompt again
  // (yes, I'll get you installed, one way or another :) )
  if (parsed < now - week) return null;
  return parsed;
}
