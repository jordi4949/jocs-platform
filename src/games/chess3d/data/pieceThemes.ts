import type { PieceTheme } from "@/games/chess3d/types";

export const PIECE_THEMES: PieceTheme[] = [
  {
    id: "classic",
    name: "Classic",
    white: "#f8fafc",
    whiteAccent: "#d4a95f",
    black: "#111827",
    blackAccent: "#64748b",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    white: "#dbeafe",
    whiteAccent: "#22d3ee",
    black: "#312e81",
    blackAccent: "#a78bfa",
  },
  {
    id: "egypt",
    name: "Egypt",
    white: "#fde68a",
    whiteAccent: "#38bdf8",
    black: "#5c3415",
    blackAccent: "#f59e0b",
  },
  {
    id: "halloween",
    name: "Halloween",
    white: "#fed7aa",
    whiteAccent: "#f97316",
    black: "#111827",
    blackAccent: "#a855f7",
  },
  {
    id: "christmas",
    name: "Christmas",
    white: "#f8fafc",
    whiteAccent: "#dc2626",
    black: "#14532d",
    blackAccent: "#facc15",
  },
  {
    id: "blocks",
    name: "Blocks",
    white: "#e0f2fe",
    whiteAccent: "#f97316",
    black: "#0f172a",
    blackAccent: "#14b8a6",
  },
];

export const DEFAULT_PIECE_THEME = PIECE_THEMES[0];
