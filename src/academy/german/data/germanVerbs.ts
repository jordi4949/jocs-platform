import type { GermanExample } from "@/academy/german/data/grammarTopics";

export type GermanConjugation = {
  pronoun: "ich" | "du" | "er/sie/es" | "wir" | "ihr" | "sie/Sie";
  form: string;
  spanish: string;
  pronunciation: string;
  audioSrc?: string;
};

export type GermanVerb = {
  id: string;
  infinitive: string;
  spanish: string;
  pronunciation: string;
  tense: "presente";
  conjugations: GermanConjugation[];
  examples: GermanExample[];
  audioSrc?: string;
};

export const germanVerbs: GermanVerb[] = [
  {
    id: "sein",
    infinitive: "sein",
    spanish: "ser / estar",
    pronunciation: "zain",
    tense: "presente",
    audioSrc: "/audio/german/sein.mp3",
    conjugations: [
      { pronoun: "ich", form: "bin", spanish: "yo soy/estoy", pronunciation: "ij bin", audioSrc: "/audio/german/ich-bin.mp3" },
      { pronoun: "du", form: "bist", spanish: "tú eres/estás", pronunciation: "du bist", audioSrc: "/audio/german/du-bist.mp3" },
      { pronoun: "er/sie/es", form: "ist", spanish: "él/ella es/está", pronunciation: "ea ist", audioSrc: "/audio/german/er-ist.mp3" },
      { pronoun: "wir", form: "sind", spanish: "nosotros somos/estamos", pronunciation: "via sint", audioSrc: "/audio/german/wir-sind.mp3" },
      { pronoun: "ihr", form: "seid", spanish: "vosotros sois/estáis", pronunciation: "ia zait", audioSrc: "/audio/german/ihr-seid.mp3" },
      { pronoun: "sie/Sie", form: "sind", spanish: "ellos/usted son/están", pronunciation: "zi sint", audioSrc: "/audio/german/sie-sind.mp3" },
    ],
    examples: [
      { german: "Ich bin Jordi.", spanish: "Soy Jordi.", pronunciation: "ij bin Jordi", audioSrc: "/audio/german/ich-bin-jordi.mp3" },
      { german: "Ich bin zwölf Jahre alt.", spanish: "Tengo doce años.", pronunciation: "ij bin tsvölf ya-re alt" },
      { german: "Wir sind zu Hause.", spanish: "Estamos en casa.", pronunciation: "via sint tsu jau-se" },
    ],
  },
  {
    id: "haben",
    infinitive: "haben",
    spanish: "tener",
    pronunciation: "ja-ben",
    tense: "presente",
    audioSrc: "/audio/german/haben.mp3",
    conjugations: [
      { pronoun: "ich", form: "habe", spanish: "yo tengo", pronunciation: "ij ja-be" },
      { pronoun: "du", form: "hast", spanish: "tú tienes", pronunciation: "du hast" },
      { pronoun: "er/sie/es", form: "hat", spanish: "él/ella tiene", pronunciation: "ea hat" },
      { pronoun: "wir", form: "haben", spanish: "nosotros tenemos", pronunciation: "via ja-ben" },
      { pronoun: "ihr", form: "habt", spanish: "vosotros tenéis", pronunciation: "ia japt" },
      { pronoun: "sie/Sie", form: "haben", spanish: "ellos/usted tienen", pronunciation: "zi ja-ben" },
    ],
    examples: [
      { german: "Ich habe einen Stift.", spanish: "Tengo un bolígrafo.", pronunciation: "ij ja-be ai-nen shtift" },
      { german: "Wir haben Deutsch.", spanish: "Tenemos alemán.", pronunciation: "via ja-ben doich" },
    ],
  },
  {
    id: "heissen",
    infinitive: "heißen",
    spanish: "llamarse",
    pronunciation: "jai-sen",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "heiße", spanish: "yo me llamo", pronunciation: "ij jai-se" },
      { pronoun: "du", form: "heißt", spanish: "tú te llamas", pronunciation: "du jaist" },
      { pronoun: "er/sie/es", form: "heißt", spanish: "él/ella se llama", pronunciation: "ea jaist" },
      { pronoun: "wir", form: "heißen", spanish: "nosotros nos llamamos", pronunciation: "via jai-sen" },
      { pronoun: "ihr", form: "heißt", spanish: "vosotros os llamáis", pronunciation: "ia jaist" },
      { pronoun: "sie/Sie", form: "heißen", spanish: "ellos/usted se llaman", pronunciation: "zi jai-sen" },
    ],
    examples: [
      { german: "Ich heiße Jordi.", spanish: "Me llamo Jordi.", pronunciation: "ij jai-se Jordi" },
      { german: "Wie heißt du?", spanish: "¿Cómo te llamas?", pronunciation: "vi jaist du?" },
    ],
  },
  {
    id: "kommen",
    infinitive: "kommen",
    spanish: "venir / proceder de",
    pronunciation: "ko-men",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "komme", spanish: "yo vengo", pronunciation: "ij ko-me" },
      { pronoun: "du", form: "kommst", spanish: "tú vienes", pronunciation: "du komst" },
      { pronoun: "er/sie/es", form: "kommt", spanish: "él/ella viene", pronunciation: "ea komt" },
      { pronoun: "wir", form: "kommen", spanish: "nosotros venimos", pronunciation: "via ko-men" },
      { pronoun: "ihr", form: "kommt", spanish: "vosotros venís", pronunciation: "ia komt" },
      { pronoun: "sie/Sie", form: "kommen", spanish: "ellos/usted vienen", pronunciation: "zi ko-men" },
    ],
    examples: [
      { german: "Ich komme aus Spanien.", spanish: "Soy de España.", pronunciation: "ij ko-me aus shpa-ni-en" },
      { german: "Woher kommst du?", spanish: "¿De dónde eres?", pronunciation: "vo-jea komst du?" },
    ],
  },
  {
    id: "wohnen",
    infinitive: "wohnen",
    spanish: "vivir",
    pronunciation: "vo-nen",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "wohne", spanish: "yo vivo", pronunciation: "ij vo-ne" },
      { pronoun: "du", form: "wohnst", spanish: "tú vives", pronunciation: "du vonst" },
      { pronoun: "er/sie/es", form: "wohnt", spanish: "él/ella vive", pronunciation: "ea vont" },
      { pronoun: "wir", form: "wohnen", spanish: "nosotros vivimos", pronunciation: "via vo-nen" },
      { pronoun: "ihr", form: "wohnt", spanish: "vosotros vivís", pronunciation: "ia vont" },
      { pronoun: "sie/Sie", form: "wohnen", spanish: "ellos/usted viven", pronunciation: "zi vo-nen" },
    ],
    examples: [
      { german: "Ich wohne in Barcelona.", spanish: "Vivo en Barcelona.", pronunciation: "ij vo-ne in Barcelona" },
      { german: "Wo wohnst du?", spanish: "¿Dónde vives?", pronunciation: "vo vonst du?" },
    ],
  },
  {
    id: "gehen",
    infinitive: "gehen",
    spanish: "ir",
    pronunciation: "gue-en",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "gehe", spanish: "yo voy", pronunciation: "ij gue-e" },
      { pronoun: "du", form: "gehst", spanish: "tú vas", pronunciation: "du guest" },
      { pronoun: "er/sie/es", form: "geht", spanish: "él/ella va", pronunciation: "ea guet" },
      { pronoun: "wir", form: "gehen", spanish: "nosotros vamos", pronunciation: "via gue-en" },
      { pronoun: "ihr", form: "geht", spanish: "vosotros vais", pronunciation: "ia guet" },
      { pronoun: "sie/Sie", form: "gehen", spanish: "ellos/usted van", pronunciation: "zi gue-en" },
    ],
    examples: [{ german: "Wir gehen um fünf Uhr.", spanish: "Vamos a las cinco.", pronunciation: "via gue-en um funf ua" }],
  },
  {
    id: "spielen",
    infinitive: "spielen",
    spanish: "jugar",
    pronunciation: "shpi-len",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "spiele", spanish: "yo juego", pronunciation: "ij shpi-le" },
      { pronoun: "du", form: "spielst", spanish: "tú juegas", pronunciation: "du shpil-st" },
      { pronoun: "er/sie/es", form: "spielt", spanish: "él/ella juega", pronunciation: "ea shpilt" },
      { pronoun: "wir", form: "spielen", spanish: "nosotros jugamos", pronunciation: "via shpi-len" },
      { pronoun: "ihr", form: "spielt", spanish: "vosotros jugáis", pronunciation: "ia shpilt" },
      { pronoun: "sie/Sie", form: "spielen", spanish: "ellos/usted juegan", pronunciation: "zi shpi-len" },
    ],
    examples: [{ german: "Ich spiele Tennis.", spanish: "Juego al tenis.", pronunciation: "ij shpi-le tenis" }],
  },
  {
    id: "lernen",
    infinitive: "lernen",
    spanish: "aprender",
    pronunciation: "ler-nen",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "lerne", spanish: "yo aprendo", pronunciation: "ij ler-ne" },
      { pronoun: "du", form: "lernst", spanish: "tú aprendes", pronunciation: "du lernst" },
      { pronoun: "er/sie/es", form: "lernt", spanish: "él/ella aprende", pronunciation: "ea lernt" },
      { pronoun: "wir", form: "lernen", spanish: "nosotros aprendemos", pronunciation: "via ler-nen" },
      { pronoun: "ihr", form: "lernt", spanish: "vosotros aprendéis", pronunciation: "ia lernt" },
      { pronoun: "sie/Sie", form: "lernen", spanish: "ellos/usted aprenden", pronunciation: "zi ler-nen" },
    ],
    examples: [{ german: "Wir lernen Deutsch.", spanish: "Aprendemos alemán.", pronunciation: "via ler-nen doich" }],
  },
  {
    id: "sprechen",
    infinitive: "sprechen",
    spanish: "hablar",
    pronunciation: "shpre-jen",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "spreche", spanish: "yo hablo", pronunciation: "ij shpre-je" },
      { pronoun: "du", form: "sprichst", spanish: "tú hablas", pronunciation: "du shprijst" },
      { pronoun: "er/sie/es", form: "spricht", spanish: "él/ella habla", pronunciation: "ea shprijt" },
      { pronoun: "wir", form: "sprechen", spanish: "nosotros hablamos", pronunciation: "via shpre-jen" },
      { pronoun: "ihr", form: "sprecht", spanish: "vosotros habláis", pronunciation: "ia shprejt" },
      { pronoun: "sie/Sie", form: "sprechen", spanish: "ellos/usted hablan", pronunciation: "zi shpre-jen" },
    ],
    examples: [{ german: "Ich spreche ein bisschen Deutsch.", spanish: "Hablo un poco de alemán.", pronunciation: "ij shpre-je ain bis-jen doich" }],
  },
  {
    id: "fahren",
    infinitive: "fahren",
    spanish: "ir en vehículo",
    pronunciation: "fa-ren",
    tense: "presente",
    conjugations: [
      { pronoun: "ich", form: "fahre", spanish: "yo voy en vehículo", pronunciation: "ij fa-re" },
      { pronoun: "du", form: "fährst", spanish: "tú vas en vehículo", pronunciation: "du ferst" },
      { pronoun: "er/sie/es", form: "fährt", spanish: "él/ella va en vehículo", pronunciation: "ea fert" },
      { pronoun: "wir", form: "fahren", spanish: "nosotros vamos en vehículo", pronunciation: "via fa-ren" },
      { pronoun: "ihr", form: "fahrt", spanish: "vosotros vais en vehículo", pronunciation: "ia fart" },
      { pronoun: "sie/Sie", form: "fahren", spanish: "ellos/usted van en vehículo", pronunciation: "zi fa-ren" },
    ],
    examples: [{ german: "Ich fahre mit dem Bus.", spanish: "Voy en autobús.", pronunciation: "ij fa-re mit dem bus" }],
  },
];

export function getGermanVerb(verbId: string) {
  return germanVerbs.find((verb) => verb.id === verbId);
}
