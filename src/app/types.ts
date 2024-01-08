export type Player = {
  id: string;
  name: string;
  level: number;
  gears: number;
  gender: 'M' | 'F';
  color: string;
};

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
