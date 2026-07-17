import type { WorldId } from "@/types/worlds";

export type AvatarPartCategory = "eyes" | "mouth" | "hair" | "glasses" | "hat" | "accessory";

export type AvatarConfig = {
  eyes: string;
  mouth: string;
  hair: string;
  glasses: string;
  hat: string;
  accessory: string;
  faceColor: string;
};

export type CosmeticItem = {
  id: string;
  category: AvatarPartCategory;
  name: string;
  description: string;
  unlockedByDefault: boolean;
  isFree: boolean;
  color?: string;
  accentColor?: string;
  symbol?: string;
};

export type PlayerTitle = {
  id: string;
  name: string;
  description: string;
  unlockedByDefault: boolean;
  minScore?: number;
};

export type PlayerRank = {
  id: string;
  name: string;
  minScore: number;
  color: string;
  glowColor: string;
};

export type PlayerProfile = {
  name: string;
  selectedTitleId: string;
  avatar: AvatarConfig;
  totalScore: number;
  coins: number;
  stars: number;
  bestScore: number;
  activeSkinId: string;
  activeWorldId: WorldId;
  rankId: string;
};
