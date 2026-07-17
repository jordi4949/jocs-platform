import type { Chess, Color, Move } from "chess.js";

export type BotDifficulty = "easy" | "intermediate" | "hard" | "very_hard" | "extra_hard";

export type BotConfig = {
  difficulty: BotDifficulty;
  maxDepth?: number;
  timeLimitMs?: number;
};

export type BotMoveResult = {
  move: Move | null;
  score: number;
  nodes: number;
  difficulty: BotDifficulty;
  engine: "local" | "stockfish";
  reason: string;
  fallbackReason?: string;
};

export type BotSearchState = {
  botColor: Color;
  deadline: number;
  nodes: number;
  timedOut: boolean;
};

export type BotMovePicker = (chess: Chess) => BotMoveResult;
