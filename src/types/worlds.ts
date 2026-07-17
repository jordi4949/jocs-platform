export type WorldId =
  | "classic_arena"
  | "desert_world"
  | "alien_world"
  | "galaxy_world"
  | "festive_world"
  | "black_white_world"
  | "blocks_world";

export type WorldDecorationType =
  | "classic"
  | "desert"
  | "alien"
  | "galaxy"
  | "festive"
  | "monochrome"
  | "blocks";

export type WorldDecorationKind =
  | "cactus"
  | "rock"
  | "bones"
  | "dry_bush"
  | "small_dune"
  | "oasis";

export type WorldThemeStyle =
  | "classic"
  | "warm"
  | "neon"
  | "cosmic"
  | "celebration"
  | "monochrome"
  | "geometric";

export type WorldBackgroundMode = "cover" | "repeat" | "parallax";

export type WorldParallaxLayer = {
  image: string;
  speed: number;
  opacity?: number;
};

export type WorldTheme = {
  id: WorldId;
  name: string;
  description: string;
  unlockedByDefault: boolean;
  price?: number;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundImages?: string[];
  backgroundMode?: WorldBackgroundMode;
  tileTexture?: string;
  tileSize?: number;
  tileOpacity?: number;
  ambienceImage?: string;
  ambienceOpacity?: number;
  parallaxSpeed?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  vignette?: boolean;
  parallaxLayers?: WorldParallaxLayer[];
  gridColor: string;
  borderColor: string;
  foodColors: string[];
  accentColor: string;
  decorationType: WorldDecorationType;
  decorationKinds?: WorldDecorationKind[];
  musicSrc?: string;
  hazards?: string[];
  themeStyle: WorldThemeStyle;
};
