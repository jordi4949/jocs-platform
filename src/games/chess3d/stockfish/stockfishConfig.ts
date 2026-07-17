import type { BotDifficulty } from "@/games/chess3d/bot/botTypes";
import type { StockfishLevelConfig } from "@/games/chess3d/stockfish/stockfishTypes";

export const STOCKFISH_SCRIPT_PATH = "/stockfish/stockfish-worker.js";
export const STOCKFISH_WASM_PATH = "/stockfish/stockfish-18-lite-single.wasm";

export const STOCKFISH_TIMEOUT_MS = 3000;

export const STOCKFISH_LEVEL_CONFIG: Partial<Record<BotDifficulty, StockfishLevelConfig>> = {
  very_hard: {
    movetimeMs: 500,
    depth: 6,
    skillLevel: 12,
    timeoutMs: STOCKFISH_TIMEOUT_MS,
  },
  extra_hard: {
    movetimeMs: 1200,
    depth: 10,
    skillLevel: 18,
    timeoutMs: STOCKFISH_TIMEOUT_MS,
  },
};
