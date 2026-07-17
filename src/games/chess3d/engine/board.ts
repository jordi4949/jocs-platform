import type { Chess, Move, Square } from "chess.js";
import type { ChessPieceModel } from "@/games/chess3d/types";

export const BOARD_FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const BOARD_RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export function getSquare(fileIndex: number, rankIndex: number) {
  return `${BOARD_FILES[fileIndex]}${BOARD_RANKS[rankIndex]}` as Square;
}

export function squareToPosition(square: Square): [number, number, number] {
  const fileIndex = BOARD_FILES.indexOf(square[0] as (typeof BOARD_FILES)[number]);
  const rankIndex = BOARD_RANKS.indexOf(square[1] as (typeof BOARD_RANKS)[number]);

  return [fileIndex - 3.5, 0, 3.5 - rankIndex];
}

export function positionToSquare(x: number, z: number) {
  const fileIndex = Math.round(x + 3.5);
  const rankIndex = Math.round(3.5 - z);

  if (fileIndex < 0 || fileIndex > 7 || rankIndex < 0 || rankIndex > 7) {
    return null;
  }

  return getSquare(fileIndex, rankIndex);
}

export function getPiecesFromGame(game: Chess): ChessPieceModel[] {
  const board = game.board();
  const pieces: ChessPieceModel[] = [];

  board.forEach((rank, rankRowIndex) => {
    rank.forEach((piece, fileIndex) => {
      if (!piece) {
        return;
      }

      const rankIndex = 7 - rankRowIndex;
      const square = getSquare(fileIndex, rankIndex);
      pieces.push({
        id: `${piece.color}-${piece.type}-${square}`,
        square,
        type: piece.type,
        color: piece.color,
      });
    });
  });

  return pieces;
}

export function getGameStatus(game: Chess) {
  if (game.isCheckmate()) {
    return "Jaque mate";
  }

  if (game.isDraw()) {
    return "Tablas";
  }

  if (game.isCheck()) {
    return "Jaque";
  }

  return "Jugando";
}

export function getMoveSquares(moves: Move[]) {
  return new Set(moves.map((move) => move.to));
}

export function getCaptureSquares(moves: Move[]) {
  return new Set(moves.filter((move) => move.captured).map((move) => move.to));
}
