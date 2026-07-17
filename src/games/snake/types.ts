import type { SnakeSkin } from "@/data/skins";
import type { WorldTheme } from "@/types/worlds";

export type Direction = "up" | "down" | "left" | "right";

export type Point = {
  x: number;
  y: number;
};

export type Food = Point & {
  id: number;
  color: string;
  radius: number;
  value: number;
  coinValue: number;
  kind: "normal" | "death";
};

export type SnakeGameStatus = "ready" | "playing" | "game-over";

export type BotDifficulty = "easy" | "medium" | "hard";

export type BotHeadType = "circle" | "image";

export type BotPersonality = "normal" | "aggressive" | "smart";

export type BotSnake = {
  id: number;
  name: string;
  difficulty: BotDifficulty;
  personality: BotPersonality;
  headType: BotHeadType;
  headImage?: string;
  soundSrc?: string;
  bodyColor?: string;
  secondaryColor?: string;
  skinId: string;
  snake: Point[];
  angle: number;
  targetAngle: number;
  wanderTimer: number;
};

export type Portal = Point & {
  id: number;
  pairId: number;
  radius: number;
  color: string;
};

export type SnakeGameState = {
  snake: Point[];
  bots: BotSnake[];
  food: Food[];
  portals: Portal[];
  playerPortalCooldown: number;
  playerInvulnerableTimer: number;
  portalMessageTimer: number;
  direction: Direction;
  nextDirection: Direction;
  angle: number;
  targetAngle: number;
  score: number;
  coinsEarned: number;
  status: SnakeGameStatus;
};

export type SnakeRenderSnapshot = SnakeGameState & {
  worldWidth: number;
  worldHeight: number;
  segmentRadius: number;
  headRadius: number;
  skin: SnakeSkin;
  worldTheme: WorldTheme;
  bestScore: number;
  turboActive: boolean;
  turboEnergy: number;
};
