import { Chess, type Color, type Move, type PieceSymbol, type Square } from "chess.js";

export const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

const CENTER_SQUARES = new Set<Square>(["d4", "e4", "d5", "e5"]);
const EXTENDED_CENTER_SQUARES = new Set<Square>(["c3", "d3", "e3", "f3", "c4", "f4", "c5", "f5", "c6", "d6", "e6", "f6"]);
const STARTING_MINOR_PIECES = new Set<Square>(["b1", "g1", "c1", "f1", "b8", "g8", "c8", "f8"]);

export function evaluatePosition(chess: Chess, botColor: Color = chess.turn()) {
  if (chess.isCheckmate()) {
    return chess.turn() === botColor ? -100000 : 100000;
  }

  if (chess.isDraw()) {
    return 0;
  }

  return evaluateMaterial(chess, botColor) + evaluateActivity(chess, botColor) + evaluateKingSafety(chess, botColor);
}

export function evaluateMove(chess: Chess, move: Move, botColor: Color) {
  const nextChess = applyMove(chess, move);
  const mover = chess.turn();
  let score = evaluatePosition(nextChess, botColor);

  if (move.captured) {
    score += colorMultiplier(mover, botColor) * (PIECE_VALUES[move.captured] + capturedWithCheapPieceBonus(move));
  }

  if (nextChess.isCheck()) {
    score += colorMultiplier(mover, botColor) * 55;
  }

  if (CENTER_SQUARES.has(move.to)) {
    score += colorMultiplier(mover, botColor) * 28;
  } else if (EXTENDED_CENTER_SQUARES.has(move.to)) {
    score += colorMultiplier(mover, botColor) * 12;
  }

  if (isDevelopmentMove(move)) {
    score += colorMultiplier(mover, botColor) * 18;
  }

  return score;
}

export function orderMoves(chess: Chess, moves: Move[], botColor: Color, maxCandidates = moves.length) {
  return [...moves]
    .sort((a, b) => scoreMoveForOrdering(chess, b, botColor) - scoreMoveForOrdering(chess, a, botColor))
    .slice(0, maxCandidates);
}

export function applyMove(chess: Chess, move: Move) {
  const nextChess = new Chess(chess.fen());
  nextChess.move({ from: move.from, to: move.to, promotion: move.promotion ?? "q" });
  return nextChess;
}

function evaluateMaterial(chess: Chess, botColor: Color) {
  let score = 0;

  chess.board().forEach((rank) => {
    rank.forEach((piece) => {
      if (!piece) {
        return;
      }

      score += colorMultiplier(piece.color, botColor) * PIECE_VALUES[piece.type];
    });
  });

  return score;
}

function evaluateActivity(chess: Chess, botColor: Color) {
  let score = 0;
  const board = chess.board();

  board.forEach((rank, rankRowIndex) => {
    rank.forEach((piece, fileIndex) => {
      if (!piece) {
        return;
      }

      const rankIndex = 7 - rankRowIndex;
      const square = `${String.fromCharCode(97 + fileIndex)}${rankIndex + 1}` as Square;
      const multiplier = colorMultiplier(piece.color, botColor);

      if (CENTER_SQUARES.has(square)) {
        score += multiplier * 22;
      } else if (EXTENDED_CENTER_SQUARES.has(square)) {
        score += multiplier * 9;
      }

      if ((piece.type === "n" || piece.type === "b") && !STARTING_MINOR_PIECES.has(square)) {
        score += multiplier * 14;
      }

      if (piece.type === "p") {
        const advance = piece.color === "w" ? rankIndex : 7 - rankIndex;
        score += multiplier * Math.max(0, advance - 1) * 4;
      }
    });
  });

  const turn = chess.turn();
  const mobility = chess.moves({ verbose: true }).length;
  score += colorMultiplier(turn, botColor) * mobility * 2;

  return score;
}

function evaluateKingSafety(chess: Chess, botColor: Color) {
  if (!chess.isCheck()) {
    return 0;
  }

  return chess.turn() === botColor ? -45 : 45;
}

function scoreMoveForOrdering(chess: Chess, move: Move, botColor: Color) {
  let score = 0;

  if (move.captured) {
    score += PIECE_VALUES[move.captured] * 10 - PIECE_VALUES[move.piece];
  }

  if (move.promotion) {
    score += PIECE_VALUES[move.promotion] - PIECE_VALUES.p;
  }

  const nextChess = applyMove(chess, move);

  if (nextChess.isCheckmate()) {
    score += 100000;
  } else if (nextChess.isCheck()) {
    score += 600;
  }

  if (CENTER_SQUARES.has(move.to)) {
    score += 90;
  } else if (EXTENDED_CENTER_SQUARES.has(move.to)) {
    score += 30;
  }

  score += Math.round(evaluatePosition(nextChess, botColor) / 20);
  return score;
}

function capturedWithCheapPieceBonus(move: Move) {
  return Math.max(0, PIECE_VALUES[move.captured ?? "p"] - PIECE_VALUES[move.piece]) * 0.35;
}

function isDevelopmentMove(move: Move) {
  return (move.piece === "n" || move.piece === "b") && STARTING_MINOR_PIECES.has(move.from);
}

function colorMultiplier(color: Color, botColor: Color) {
  return color === botColor ? 1 : -1;
}
