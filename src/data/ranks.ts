import type { PlayerRank } from "@/types/profile";

export const PLAYER_RANKS: PlayerRank[] = [
  {
    id: "bronce",
    name: "Bronce",
    minScore: 0,
    color: "#b9783f",
    glowColor: "rgba(185,120,63,0.28)",
  },
  {
    id: "hierro",
    name: "Hierro",
    minScore: 150,
    color: "#7d8597",
    glowColor: "rgba(125,133,151,0.3)",
  },
  {
    id: "oro",
    name: "Oro",
    minScore: 350,
    color: "#eab308",
    glowColor: "rgba(234,179,8,0.28)",
  },
  {
    id: "amatista",
    name: "Amatista",
    minScore: 700,
    color: "#9333ea",
    glowColor: "rgba(147,51,234,0.25)",
  },
  {
    id: "diamante",
    name: "Diamante",
    minScore: 1100,
    color: "#22d3ee",
    glowColor: "rgba(34,211,238,0.28)",
  },
  {
    id: "legendario_i",
    name: "Legendario I",
    minScore: 1700,
    color: "#f97316",
    glowColor: "rgba(249,115,22,0.3)",
  },
  {
    id: "legendario_ii",
    name: "Legendario II",
    minScore: 2500,
    color: "#ef4444",
    glowColor: "rgba(239,68,68,0.3)",
  },
];

export function getRankForScore(score: number) {
  return PLAYER_RANKS.reduce((currentRank, rank) => (score >= rank.minScore ? rank : currentRank), PLAYER_RANKS[0]);
}

export function getRankById(rankId: string) {
  return PLAYER_RANKS.find((rank) => rank.id === rankId) ?? PLAYER_RANKS[0];
}
