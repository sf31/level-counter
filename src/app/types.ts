import { z } from 'zod';

export const PLAYER = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: z.number().min(1),
  gears: z.number().min(0),
  gender: z.union([z.literal('M'), z.literal('F')]),
  color: z.string(),
});

export const APP_STATE = z.object({
  playerList: z.array(PLAYER),
  dismissPwa: z.number().nullable(),
});

export type AppState = z.infer<typeof APP_STATE>;
export type Player = z.infer<typeof PLAYER>;

export type PwaUpdateState = {
  promptEvent:
    | (Event & {
        prompt: () => void;
        userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
        platforms: string[];
      })
    | null;
  isRunningStandalone: boolean;
  updateAvailable: boolean;
  installPending: boolean; // set true when user accepts install prompt
};
