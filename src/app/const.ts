import { AppState } from './types';
import { version } from '../../package.json';

export const INITIAL_APP_STATE: AppState = {
  parties: [],
  activePartyId: null,
  dismissPwa: null,
};

export const LSK_APP_STATE = 'level-counter-app-state';

export const APP_VERSION = version;

export const PLAYER_COLORS: string[] = [
  '#C62828',
  '#2E7D32',
  '#1565C0',
  '#F9A825',
  '#EF6C00',
  '#6A1B9A',
  '#00838F',
  '#E0E0E0',
  '#37474F',
];
