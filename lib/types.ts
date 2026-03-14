export type Difficulty = "easy" | "medium" | "hard";

export type SudokuGameState = {
  puzzle: number[][];
  solution: number[][];
  board: number[][];
  startedAt: number;
  elapsedSeconds: number;
  paused: boolean;
  difficulty: Difficulty;
};

export type ScoreRow = {
  id: string;
  user_email: string;
  difficulty: Difficulty;
  completion_seconds: number;
  points: number;
  created_at: string;
};
