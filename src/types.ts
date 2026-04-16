export type GameState = 'intro' | 'explanation' | 'menu' | 'level1' | 'level2' | 'level3' | 'level4' | 'final_reassembly' | 'final';

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  messagePart: string;
}

export interface GameProgress {
  levels: {
    [key: string]: LevelProgress;
  };
}

export const INITIAL_PROGRESS: GameProgress = {
  levels: {
    level1: { unlocked: true, completed: false, messagePart: "A internet " },
    level2: { unlocked: true, completed: false, messagePart: "funciona " },
    level3: { unlocked: true, completed: false, messagePart: "enviando " },
    level4: { unlocked: true, completed: false, messagePart: "pacotes!" },
  }
};
