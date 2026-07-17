export type GermanDialogueLine = {
  speaker: string;
  german: string;
  spanish: string;
  pronunciation: string;
  audioSrc?: string;
  keyPhraseIds: string[];
};

export type GermanAudioDialogue = {
  id: string;
  title: string;
  situationId: string;
  level: number;
  speakers: string[];
  lines: GermanDialogueLine[];
  fullAudioSrc?: string;
  slowAudioSrc?: string;
  normalAudioSrc?: string;
};

export const audioDialogues: GermanAudioDialogue[] = [
  {
    id: "saludar-nombre-edad",
    title: "Saludar y decir tu nombre",
    situationId: "saludar",
    level: 1,
    speakers: ["Mia", "Jordi"],
    fullAudioSrc: "/audio/german/saludar-nombre-edad.mp3",
    slowAudioSrc: "/audio/german/saludar-nombre-edad-slow.mp3",
    normalAudioSrc: "/audio/german/saludar-nombre-edad-normal.mp3",
    lines: [
      {
        speaker: "Mia",
        german: "Hallo! Wie heißt du?",
        spanish: "Hola, ¿cómo te llamas?",
        pronunciation: "ja-lo, vi jaist du?",
        audioSrc: "/audio/german/hallo-wie-heisst-du.mp3",
        keyPhraseIds: ["hallo", "wie-heisst-du"],
      },
      {
        speaker: "Jordi",
        german: "Ich heiße Jordi.",
        spanish: "Me llamo Jordi.",
        pronunciation: "ij jai-se Jordi",
        audioSrc: "/audio/german/ich-heisse-jordi.mp3",
        keyPhraseIds: ["ich-heisse"],
      },
      {
        speaker: "Mia",
        german: "Wie alt bist du?",
        spanish: "¿Cuántos años tienes?",
        pronunciation: "vi alt bist du?",
        audioSrc: "/audio/german/wie-alt-bist-du.mp3",
        keyPhraseIds: ["wie-alt-bist-du"],
      },
      {
        speaker: "Jordi",
        german: "Ich bin zwölf Jahre alt.",
        spanish: "Tengo doce años.",
        pronunciation: "ij bin tsvölf ya-re alt",
        audioSrc: "/audio/german/ich-bin-zwoelf-jahre-alt.mp3",
        keyPhraseIds: ["ich-bin", "jahre-alt"],
      },
    ],
  },
  {
    id: "presentarse-origen",
    title: "Presentarse y decir de dónde eres",
    situationId: "presentarse",
    level: 1,
    speakers: ["Ben", "Jordi"],
    fullAudioSrc: "/audio/german/presentarse-origen.mp3",
    lines: [
      {
        speaker: "Ben",
        german: "Woher kommst du?",
        spanish: "¿De dónde eres?",
        pronunciation: "vo-jea komst du?",
        audioSrc: "/audio/german/woher-kommst-du.mp3",
        keyPhraseIds: ["woher-kommst-du"],
      },
      {
        speaker: "Jordi",
        german: "Ich komme aus Spanien.",
        spanish: "Soy de España.",
        pronunciation: "ij ko-me aus shpa-ni-en",
        audioSrc: "/audio/german/ich-komme-aus-spanien.mp3",
        keyPhraseIds: ["ich-komme-aus"],
      },
      {
        speaker: "Ben",
        german: "Wo wohnst du?",
        spanish: "¿Dónde vives?",
        pronunciation: "vo vonst du?",
        audioSrc: "/audio/german/wo-wohnst-du.mp3",
        keyPhraseIds: ["wo-wohnst-du"],
      },
      {
        speaker: "Jordi",
        german: "Ich wohne in Barcelona.",
        spanish: "Vivo en Barcelona.",
        pronunciation: "ij vo-ne in Barcelona",
        audioSrc: "/audio/german/ich-wohne-in-barcelona.mp3",
        keyPhraseIds: ["ich-wohne"],
      },
    ],
  },
  {
    id: "im-klassenzimmer",
    title: "En el colegio",
    situationId: "colegio",
    level: 1,
    speakers: ["Lehrerin", "Jordi"],
    fullAudioSrc: "/audio/german/im-klassenzimmer.mp3",
    lines: [
      {
        speaker: "Lehrerin",
        german: "Guten Morgen! Hast du einen Stift?",
        spanish: "¡Buenos días! ¿Tienes un bolígrafo?",
        pronunciation: "gu-ten mor-guen, hast du ai-nen shtift?",
        audioSrc: "/audio/german/hast-du-einen-stift.mp3",
        keyPhraseIds: ["guten-morgen", "hast-du"],
      },
      {
        speaker: "Jordi",
        german: "Ja, ich habe einen Stift.",
        spanish: "Sí, tengo un bolígrafo.",
        pronunciation: "ya, ij ja-be ai-nen shtift",
        audioSrc: "/audio/german/ich-habe-einen-stift.mp3",
        keyPhraseIds: ["ich-habe"],
      },
      {
        speaker: "Lehrerin",
        german: "Sehr gut. Wir lernen Deutsch.",
        spanish: "Muy bien. Aprendemos alemán.",
        pronunciation: "zea gut, via ler-nen doich",
        audioSrc: "/audio/german/wir-lernen-deutsch.mp3",
        keyPhraseIds: ["wir-lernen"],
      },
    ],
  },
  {
    id: "tenis-amigos",
    title: "Quedar para jugar al tenis",
    situationId: "tenis",
    level: 1,
    speakers: ["Lena", "Jordi"],
    fullAudioSrc: "/audio/german/tenis-amigos.mp3",
    lines: [
      {
        speaker: "Lena",
        german: "Spielst du Tennis?",
        spanish: "¿Juegas al tenis?",
        pronunciation: "shpil-st du tenis?",
        audioSrc: "/audio/german/spielst-du-tennis.mp3",
        keyPhraseIds: ["spielst-du"],
      },
      {
        speaker: "Jordi",
        german: "Ja, ich spiele Tennis.",
        spanish: "Sí, juego al tenis.",
        pronunciation: "ya, ij shpi-le tenis",
        audioSrc: "/audio/german/ich-spiele-tennis.mp3",
        keyPhraseIds: ["ich-spiele"],
      },
      {
        speaker: "Lena",
        german: "Wir gehen um fünf Uhr.",
        spanish: "Vamos a las cinco.",
        pronunciation: "via gue-en um funf ua",
        audioSrc: "/audio/german/wir-gehen-um-fuenf-uhr.mp3",
        keyPhraseIds: ["wir-gehen"],
      },
    ],
  },
  {
    id: "im-restaurant",
    title: "Pedir algo en un restaurante",
    situationId: "restaurante",
    level: 1,
    speakers: ["Kellner", "Jordi"],
    fullAudioSrc: "/audio/german/im-restaurant.mp3",
    lines: [
      {
        speaker: "Kellner",
        german: "Was möchtest du?",
        spanish: "¿Qué quieres?",
        pronunciation: "vas moj-test du?",
        audioSrc: "/audio/german/was-moechtest-du.mp3",
        keyPhraseIds: ["was-moechtest-du"],
      },
      {
        speaker: "Jordi",
        german: "Ich möchte Wasser, bitte.",
        spanish: "Quiero agua, por favor.",
        pronunciation: "ij moj-te va-ser, bi-te",
        audioSrc: "/audio/german/ich-moechte-wasser-bitte.mp3",
        keyPhraseIds: ["ich-moechte", "bitte"],
      },
      {
        speaker: "Kellner",
        german: "Sehr gern.",
        spanish: "Con mucho gusto.",
        pronunciation: "zea guern",
        audioSrc: "/audio/german/sehr-gern.mp3",
        keyPhraseIds: ["sehr-gern"],
      },
    ],
  },
];

export function getAudioDialogue(dialogueId: string) {
  return audioDialogues.find((dialogue) => dialogue.id === dialogueId);
}

export function getDialoguesBySituation(situationId: string) {
  return audioDialogues.filter((dialogue) => dialogue.situationId === situationId);
}
