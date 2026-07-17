import type { Color, PieceSymbol, Square } from "chess.js";

export type ChessBoardThemeId = "classic" | "galaxy" | "egypt" | "halloween" | "christmas" | "blocks";

export type ChessPieceThemeId = ChessBoardThemeId;

export type BoardTheme = {
  id: ChessBoardThemeId;
  name: string;
  lightSquare: string;
  darkSquare: string;
  selectedSquare: string;
  legalMove: string;
  captureMove: string;
  border: string;
  background: string;
};

export type PieceTheme = {
  id: ChessPieceThemeId;
  name: string;
  white: string;
  whiteAccent: string;
  black: string;
  blackAccent: string;
};

export type ChessPieceModel = {
  id: string;
  square: Square;
  type: PieceSymbol;
  color: Color;
};
