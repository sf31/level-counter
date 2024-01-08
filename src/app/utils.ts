import { Player } from './types';

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function validateLocalStorage(storageValue: any): Player[] {
  // TODO add stricter validation
  if (!storageValue) return [];
  const parsed = JSON.parse(storageValue);
  if (!Array.isArray(parsed)) return [];
  for (const player of parsed) {
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

  return parsed;
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
