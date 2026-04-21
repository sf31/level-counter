import { z } from 'zod';

const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: z.number().min(1),
  gears: z.number().min(0),
  gender: z.union([z.literal('M'), z.literal('F')]),
  color: z.string(),
});

const partySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  playerList: z.array(playerSchema),
});

export const appStateSchema = z.object({
  parties: z.array(partySchema),
  activePartyId: z.string().nullable(),
  dismissPwa: z.number().nullable(),
});

// Legacy schema for migration from old format
export const legacyAppStateSchema = z.object({
  playerList: z.array(playerSchema),
  dismissPwa: z.number().nullable(),
});

export type AppState = z.infer<typeof appStateSchema>;
export type Party = z.infer<typeof partySchema>;
export type Player = z.infer<typeof playerSchema>;
export type LegacyAppState = z.infer<typeof legacyAppStateSchema>;

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
