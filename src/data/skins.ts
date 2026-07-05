export type SegmentShape = "circle";

export type SnakeSkin = {
  id: string;
  name: string;
  description: string;
  price: number;
  unlockedByDefault: boolean;
  headColor: string;
  bodyColor: string;
  secondaryColor?: string;
  foodColor?: string;
  segmentShape: SegmentShape;
};

export const SNAKE_SKINS: SnakeSkin[] = [
  {
    id: "classic_green",
    name: "Classic Green",
    description: "El estilo base: rapido, limpio y facil de leer en la arena.",
    price: 0,
    unlockedByDefault: true,
    headColor: "#9be86f",
    bodyColor: "#55b85f",
    secondaryColor: "#7ed957",
    foodColor: "#f3a469",
    segmentShape: "circle",
  },
  {
    id: "fire_snake",
    name: "Fire Snake",
    description: "Cabeza ardiente y cuerpo naranja para partidas con mas chispa.",
    price: 35,
    unlockedByDefault: false,
    headColor: "#ffd166",
    bodyColor: "#ef476f",
    secondaryColor: "#ff9f1c",
    foodColor: "#ff9f1c",
    segmentShape: "circle",
  },
  {
    id: "ice_snake",
    name: "Ice Snake",
    description: "Azules frios y segmentos suaves para dominar sin hacer ruido.",
    price: 45,
    unlockedByDefault: false,
    headColor: "#c4f1ff",
    bodyColor: "#58a6ff",
    secondaryColor: "#8ecae6",
    foodColor: "#bde0fe",
    segmentShape: "circle",
  },
  {
    id: "robot_snake",
    name: "Robot Snake",
    description: "Segmentos metalicos y precisos con brillo suave.",
    price: 55,
    unlockedByDefault: false,
    headColor: "#e8edf2",
    bodyColor: "#7d8597",
    secondaryColor: "#b8c0cc",
    foodColor: "#80ffdb",
    segmentShape: "circle",
  },
  {
    id: "galaxy_snake",
    name: "Galaxy Snake",
    description: "Una serpiente espacial para guardar como premio especial.",
    price: 80,
    unlockedByDefault: false,
    headColor: "#f0abfc",
    bodyColor: "#7c3aed",
    secondaryColor: "#22d3ee",
    foodColor: "#facc15",
    segmentShape: "circle",
  },
];

export const DEFAULT_SKIN_ID = "classic_green";

export function getSkinById(skinId: string): SnakeSkin {
  return SNAKE_SKINS.find((skin) => skin.id === skinId) ?? SNAKE_SKINS[0];
}
