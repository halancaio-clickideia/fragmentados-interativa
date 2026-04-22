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
    level1: { unlocked: true, completed: false, messagePart: "Tô estudando redes hoje," },
    level2: { unlocked: false, completed: false, messagePart: "é massa ver como a mensagem sai do celular" },
    level3: { unlocked: false, completed: false, messagePart: "e chega no outro mesmo" },
    level4: { unlocked: false, completed: false, messagePart: "passando por vários caminhos." },
  }
};
