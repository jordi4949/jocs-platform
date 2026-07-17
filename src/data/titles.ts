import type { PlayerTitle } from "@/types/profile";

export const PLAYER_TITLES: PlayerTitle[] = [
  {
    id: "novato",
    name: "Novato",
    description: "El primer titulo para empezar la aventura.",
    unlockedByDefault: true,
    minScore: 0,
  },
  {
    id: "cazabolas",
    name: "Cazabolas",
    description: "Para jugadores que no dejan escapar comida.",
    unlockedByDefault: true,
    minScore: 100,
  },
  {
    id: "block",
    name: "Block!!!",
    description: "Un titulo con energia de arcade.",
    unlockedByDefault: true,
    minScore: 250,
  },
  {
    id: "serpiente_rapida",
    name: "Serpiente rapida",
    description: "Para quien domina el turbo con estilo.",
    unlockedByDefault: false,
    minScore: 600,
  },
  {
    id: "leyenda_io",
    name: "Leyenda IO",
    description: "Reservado para partidas memorables.",
    unlockedByDefault: false,
    minScore: 1200,
  },
];

export const DEFAULT_PLAYER_TITLE_ID = "novato";

export function getPlayerTitleById(titleId: string) {
  return PLAYER_TITLES.find((title) => title.id === titleId) ?? PLAYER_TITLES[0];
}
