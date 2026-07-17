import { getDialoguesBySituation, type GermanAudioDialogue } from "@/academy/german/data/audioDialogues";

export type GermanSituationDifficulty = "beginner" | "easy" | "medium";

export type GermanPracticalSituation = {
  id: string;
  title: string;
  description: string;
  setting: string;
  difficulty: GermanSituationDifficulty;
  dialogues: GermanAudioDialogue[];
  keyVocabulary: string[];
  keyPhrases: string[];
  grammarUsed: string[];
};

const situationSeeds = [
  {
    id: "saludar",
    title: "Saludar",
    description: "Empieza una conversación con confianza.",
    setting: "Patio del colegio",
    difficulty: "beginner" as const,
    keyVocabulary: ["Hallo", "Guten Morgen", "Tschüss"],
    keyPhrases: ["Hallo!", "Wie heißt du?", "Wie alt bist du?"],
    grammarUsed: ["preguntas-basicas", "verbo-heissen", "verbo-sein"],
  },
  {
    id: "presentarse",
    title: "Presentarse",
    description: "Di quién eres, de dónde vienes y dónde vives.",
    setting: "Primer día de clase",
    difficulty: "beginner" as const,
    keyVocabulary: ["Spanien", "Barcelona", "wohnen"],
    keyPhrases: ["Ich komme aus Spanien.", "Ich wohne in Barcelona."],
    grammarUsed: ["presente-basico", "preguntas-basicas"],
  },
  {
    id: "colegio",
    title: "En el colegio",
    description: "Frases para clase, material y asignaturas.",
    setting: "Aula",
    difficulty: "easy" as const,
    keyVocabulary: ["der Stift", "das Buch", "Deutsch"],
    keyPhrases: ["Ich habe einen Stift.", "Wir lernen Deutsch."],
    grammarUsed: ["verbo-haben", "orden-de-la-frase"],
  },
  {
    id: "casa",
    title: "En casa",
    description: "Habla de familia, habitaciones y rutinas sencillas.",
    setting: "Casa",
    difficulty: "easy" as const,
    keyVocabulary: ["zu Hause", "die Familie", "mein Zimmer"],
    keyPhrases: ["Wir sind zu Hause.", "Das ist meine Familie."],
    grammarUsed: ["verbo-sein", "articulos-der-die-das"],
  },
  {
    id: "autobus",
    title: "En el autobús",
    description: "Pide ayuda y habla de ir a un sitio.",
    setting: "Parada de autobús",
    difficulty: "easy" as const,
    keyVocabulary: ["der Bus", "fahren", "die Haltestelle"],
    keyPhrases: ["Ich fahre mit dem Bus.", "Wo ist die Haltestelle?"],
    grammarUsed: ["preguntas-basicas", "orden-de-la-frase"],
  },
  {
    id: "tenis",
    title: "En el tenis",
    description: "Queda para jugar y habla de horarios.",
    setting: "Pista de tenis",
    difficulty: "easy" as const,
    keyVocabulary: ["Tennis", "spielen", "fünf Uhr"],
    keyPhrases: ["Spielst du Tennis?", "Ich spiele Tennis.", "Wir gehen um fünf Uhr."],
    grammarUsed: ["orden-de-la-frase", "presente-basico"],
  },
  {
    id: "futbol",
    title: "En el fútbol",
    description: "Habla de deporte, gustos y negaciones básicas.",
    setting: "Campo de fútbol",
    difficulty: "easy" as const,
    keyVocabulary: ["Fußball", "spielen", "nicht"],
    keyPhrases: ["Ich spiele Fußball.", "Ich spiele nicht Fußball."],
    grammarUsed: ["negacion-mit-nicht", "orden-de-la-frase"],
  },
  {
    id: "tienda",
    title: "En una tienda",
    description: "Pregunta por objetos y entiende respuestas sencillas.",
    setting: "Tienda pequeña",
    difficulty: "medium" as const,
    keyVocabulary: ["bitte", "Wasser", "Euro"],
    keyPhrases: ["Ich möchte das, bitte.", "Was kostet das?"],
    grammarUsed: ["preguntas-basicas", "articulos-der-die-das"],
  },
  {
    id: "restaurante",
    title: "En un restaurante",
    description: "Pide agua o comida de forma educada.",
    setting: "Restaurante",
    difficulty: "easy" as const,
    keyVocabulary: ["Wasser", "bitte", "sehr gern"],
    keyPhrases: ["Was möchtest du?", "Ich möchte Wasser, bitte."],
    grammarUsed: ["preguntas-basicas", "orden-de-la-frase"],
  },
  {
    id: "viaje",
    title: "En un viaje",
    description: "Frases básicas para moverte y decir de dónde eres.",
    setting: "Estación",
    difficulty: "medium" as const,
    keyVocabulary: ["reisen", "fahren", "Spanien"],
    keyPhrases: ["Ich komme aus Spanien.", "Ich fahre mit dem Zug."],
    grammarUsed: ["presente-basico", "preguntas-basicas"],
  },
  {
    id: "amigos",
    title: "Con amigos",
    description: "Preguntas rápidas para gustos, juegos y planes.",
    setting: "Parque",
    difficulty: "easy" as const,
    keyVocabulary: ["Freund", "spielen", "gehen"],
    keyPhrases: ["Kommst du mit?", "Wir gehen zusammen."],
    grammarUsed: ["presente-basico", "orden-de-la-frase"],
  },
];

export const practicalSituations: GermanPracticalSituation[] = situationSeeds.map((situation) => ({
  ...situation,
  dialogues: getDialoguesBySituation(situation.id),
}));

export function getPracticalSituation(situationId: string) {
  return practicalSituations.find((situation) => situation.id === situationId);
}
