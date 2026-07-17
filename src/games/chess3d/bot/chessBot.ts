import { Chess, type Move } from "chess.js";
import { applyMove, evaluateMove, evaluatePosition, orderMoves, PIECE_VALUES } from "@/games/chess3d/bot/botEvaluation";
import type { BotConfig, BotDifficulty, BotMoveResult, BotSearchState } from "@/games/chess3d/bot/botTypes";
import { analyzePositionWithStockfish, getStockfishOptionsForDifficulty } from "@/games/chess3d/stockfish/stockfishClient";

const DEFAULT_TIME_LIMIT_MS: Record<BotDifficulty, number> = {
  easy: 40,
  intermediate: 60,
  hard: 100,
  very_hard: 650,
  extra_hard: 900,
};

const DIFFICULTY_LABELS: Record<BotDifficulty, string> = {
  easy: "Fácil",
  intermediate: "Intermedio",
  hard: "Difícil",
  very_hard: "Muy difícil",
  extra_hard: "Extra difícil",
};

export function getBotMove(chess: Chess, difficultyOrConfig: BotDifficulty | BotConfig): BotMoveResult {
  const config = typeof difficultyOrConfig === "string" ? { difficulty: difficultyOrConfig } : difficultyOrConfig;

  if (config.difficulty === "easy") {
    return getRandomMove(chess);
  }

  if (config.difficulty === "intermediate") {
    return getIntermediateMove(chess);
  }

  if (config.difficulty === "hard") {
    return getHardMove(chess);
  }

  const depth = config.maxDepth ?? (config.difficulty === "extra_hard" ? 3 : 2);
  const maxCandidates = config.difficulty === "extra_hard" ? 16 : 22;
  return getMinimaxMove(chess, config.difficulty, depth, maxCandidates, config.timeLimitMs);
}

export async function getBotMoveWithStockfish(chess: Chess, difficulty: BotDifficulty): Promise<BotMoveResult> {
  if (difficulty !== "very_hard" && difficulty !== "extra_hard") {
    return getBotMove(chess, difficulty);
  }

  try {
    const options = getStockfishOptionsForDifficulty(difficulty);

    if (!options) {
      return getBotMove(chess, difficulty);
    }

    const analysis = await analyzePositionWithStockfish(chess.fen(), options);
    const move = getMoveFromUci(chess, analysis.bestMove);

    if (!move) {
      throw new Error(`Stockfish devolvió una jugada ilegal: ${analysis.bestMove}`);
    }

    return {
      move,
      score: analysis.evaluation ?? 0,
      nodes: 0,
      difficulty,
      engine: "stockfish",
      reason: `Stockfish ${DIFFICULTY_LABELS[difficulty]} (${options.depth ? `profundidad ${options.depth}` : `${options.movetimeMs} ms`})`,
    };
  } catch (error) {
    const fallback = getBotMove(chess, difficulty);
    return {
      ...fallback,
      engine: "local",
      reason: `${fallback.reason}. Stockfish no está disponible, usando bot avanzado local.`,
      fallbackReason: error instanceof Error ? error.message : "Stockfish falló sin detalle.",
    };
  }
}

export function getRandomMove(chess: Chess): BotMoveResult {
  const moves = chess.moves({ verbose: true });
  const captures = moves.filter((move) => move.captured);
  const quietMoves = moves.filter((move) => !move.captured);
  const movePool = quietMoves.length > 0 && Math.random() < 0.68 ? quietMoves : captures.length ? captures : moves;
  const move = pickRandom(movePool);

  return createResult(move, "easy", 0, 1, "Movimiento legal casi aleatorio");
}

export function getIntermediateMove(chess: Chess): BotMoveResult {
  const moves = chess.moves({ verbose: true });
  const botColor = chess.turn();
  const scoredMoves = moves.map((move) => {
    const nextChess = applyMove(chess, move);
    let score = Math.random() * 18;

    if (nextChess.isCheckmate()) {
      score += 100000;
    } else if (nextChess.isCheck()) {
      score += 120;
    }

    if (move.captured) {
      score += PIECE_VALUES[move.captured] + Math.random() * 40;
    }

    score += evaluateMove(chess, move, botColor) * 0.04;
    return { move, score };
  });
  const bestMoves = getTopMoves(scoredMoves, 4);
  const move = pickRandom(bestMoves)?.move ?? pickRandom(moves);

  return createResult(move, "intermediate", 0, moves.length, "Prioriza capturas y jaques simples");
}

export function getHardMove(chess: Chess): BotMoveResult {
  const moves = chess.moves({ verbose: true });
  const botColor = chess.turn();
  const scoredMoves = moves.map((move) => {
    const nextChess = applyMove(chess, move);
    let score = evaluateMove(chess, move, botColor);

    if (nextChess.isCheckmate()) {
      score += 100000;
    }

    score -= moveHangsMaterialPenalty(nextChess, move);
    score += Math.random() * 8;
    return { move, score };
  });
  const bestMove = scoredMoves.sort((a, b) => b.score - a.score)[0];

  return createResult(bestMove?.move ?? null, "hard", bestMove?.score ?? 0, moves.length, "Evaluación básica de material y desarrollo");
}

export function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  state: BotSearchState,
  maxCandidates: number,
): number {
  state.nodes += 1;

  if (Date.now() > state.deadline) {
    state.timedOut = true;
    return evaluatePosition(chess, state.botColor);
  }

  if (depth === 0 || chess.isGameOver()) {
    return evaluatePosition(chess, state.botColor);
  }

  const legalMoves = orderMoves(chess, chess.moves({ verbose: true }), state.botColor, maxCandidates);

  if (maximizing) {
    let bestScore = -Infinity;

    for (const move of legalMoves) {
      const nextChess = applyMove(chess, move);
      bestScore = Math.max(bestScore, minimax(nextChess, depth - 1, alpha, beta, false, state, maxCandidates));
      alpha = Math.max(alpha, bestScore);

      if (beta <= alpha || state.timedOut) {
        break;
      }
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (const move of legalMoves) {
    const nextChess = applyMove(chess, move);
    bestScore = Math.min(bestScore, minimax(nextChess, depth - 1, alpha, beta, true, state, maxCandidates));
    beta = Math.min(beta, bestScore);

    if (beta <= alpha || state.timedOut) {
      break;
    }
  }

  return bestScore;
}

export { orderMoves, evaluatePosition };

function getMinimaxMove(
  chess: Chess,
  difficulty: BotDifficulty,
  depth: number,
  maxCandidates: number,
  timeLimitMs = DEFAULT_TIME_LIMIT_MS[difficulty],
): BotMoveResult {
  const botColor = chess.turn();
  const state: BotSearchState = {
    botColor,
    deadline: Date.now() + timeLimitMs,
    nodes: 0,
    timedOut: false,
  };
  const moves = orderMoves(chess, chess.moves({ verbose: true }), botColor, maxCandidates);
  let bestMove = moves[0] ?? null;
  let bestScore = -Infinity;

  for (const move of moves) {
    const nextChess = applyMove(chess, move);
    const score = minimax(nextChess, depth - 1, -Infinity, Infinity, false, state, maxCandidates);

    if (score > bestScore || !bestMove) {
      bestScore = score;
      bestMove = move;
    }

    if (state.timedOut) {
      break;
    }
  }

  return createResult(
    bestMove,
    difficulty,
    Number.isFinite(bestScore) ? bestScore : 0,
    state.nodes,
    state.timedOut
      ? `${DIFFICULTY_LABELS[difficulty]} con límite de tiempo y mejor jugada encontrada`
      : `${DIFFICULTY_LABELS[difficulty]} con minimax profundidad ${depth} y alpha-beta`,
  );
}

function moveHangsMaterialPenalty(chessAfterMove: Chess, move: Move) {
  const opponentMoves = chessAfterMove.moves({ verbose: true });
  const recapture = opponentMoves.find((opponentMove) => opponentMove.to === move.to && opponentMove.captured === move.piece);

  if (!recapture) {
    return 0;
  }

  const movedPieceValue = PIECE_VALUES[move.promotion ?? move.piece];
  const capturedValue = move.captured ? PIECE_VALUES[move.captured] : 0;
  return Math.max(0, movedPieceValue - capturedValue) * 0.75;
}

function getTopMoves<T extends { score: number }>(moves: T[], count: number) {
  return [...moves].sort((a, b) => b.score - a.score).slice(0, count);
}

function pickRandom<T>(items: T[]) {
  if (!items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function getMoveFromUci(chess: Chess, uciMove: string) {
  const from = uciMove.slice(0, 2);
  const to = uciMove.slice(2, 4);
  const promotion = uciMove.slice(4, 5) || undefined;
  const nextChess = new Chess(chess.fen());

  try {
    return nextChess.move({ from, to, promotion });
  } catch {
    return null;
  }
}

function createResult(move: Move | null, difficulty: BotDifficulty, score: number, nodes: number, reason: string): BotMoveResult {
  return {
    move,
    score,
    nodes,
    difficulty,
    engine: "local",
    reason,
  };
}
