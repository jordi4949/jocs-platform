export type GermanExample = {
  german: string;
  spanish: string;
  pronunciation: string;
  audioSrc?: string;
};

export type GermanGrammarTopic = {
  id: string;
  title: string;
  explanationShort: string;
  explanationDetailed: string;
  examples: GermanExample[];
  relatedLessons: string[];
  relatedSituations: string[];
};

export const grammarTopics: GermanGrammarTopic[] = [
  {
    id: "pronombres-personales",
    title: "Pronombres personales",
    explanationShort: "Son las palabras para decir yo, tú, él, nosotros y ellos.",
    explanationDetailed:
      "Los pronombres te dicen quién hace la acción. En alemán son muy importantes porque el verbo cambia según la persona.",
    examples: [
      { german: "ich", spanish: "yo", pronunciation: "ij", audioSrc: "/audio/german/ich.mp3" },
      { german: "du", spanish: "tú", pronunciation: "du", audioSrc: "/audio/german/du.mp3" },
      { german: "wir", spanish: "nosotros", pronunciation: "via", audioSrc: "/audio/german/wir.mp3" },
    ],
    relatedLessons: ["presentarse"],
    relatedSituations: ["saludar", "presentarse"],
  },
  {
    id: "presente-basico",
    title: "Presente básico",
    explanationShort: "El presente sirve para hablar de lo que eres, tienes o haces ahora.",
    explanationDetailed:
      "Muchos verbos alemanes cambian la terminación en presente. Primero aprende frases completas y luego mira el patrón.",
    examples: [
      { german: "Ich wohne in Barcelona.", spanish: "Vivo en Barcelona.", pronunciation: "ij vo-ne in Barcelona" },
      { german: "Wir lernen Deutsch.", spanish: "Aprendemos alemán.", pronunciation: "via ler-nen doich" },
    ],
    relatedLessons: ["decir-de-donde-eres", "colegio"],
    relatedSituations: ["presentarse", "colegio"],
  },
  {
    id: "preguntas-basicas",
    title: "Preguntas básicas",
    explanationShort: "Muchas preguntas empiezan con una palabra como Wie, Wo o Was.",
    explanationDetailed:
      "En alemán, el verbo suele ir muy pronto en la pregunta. Practica preguntas enteras para interiorizar el ritmo.",
    examples: [
      { german: "Wie heißt du?", spanish: "¿Cómo te llamas?", pronunciation: "vi jaist du?" },
      { german: "Wo wohnst du?", spanish: "¿Dónde vives?", pronunciation: "vo vonst du?" },
      { german: "Was möchtest du?", spanish: "¿Qué quieres?", pronunciation: "vas moj-test du?" },
    ],
    relatedLessons: ["saludos", "preguntas-basicas"],
    relatedSituations: ["saludar", "restaurante"],
  },
  {
    id: "orden-de-la-frase",
    title: "Orden de la frase",
    explanationShort: "En frases normales, el verbo suele ir en segunda posición.",
    explanationDetailed:
      "La idea base es: persona o tema, verbo, resto de la información. En preguntas cortas, muchas veces el verbo va primero o después de la palabra interrogativa.",
    examples: [
      { german: "Ich spiele Tennis.", spanish: "Juego al tenis.", pronunciation: "ij shpi-le tenis" },
      { german: "Spielst du Tennis?", spanish: "¿Juegas al tenis?", pronunciation: "shpil-st du tenis?" },
    ],
    relatedLessons: ["colegio", "preguntas-basicas"],
    relatedSituations: ["tenis", "colegio"],
  },
  {
    id: "articulos-der-die-das",
    title: "Artículos der/die/das",
    explanationShort: "Der, die y das son como el/la, pero dependen del género alemán.",
    explanationDetailed:
      "Conviene aprender cada nombre con su artículo. No siempre coincide con el español, así que trata el artículo como parte de la palabra.",
    examples: [
      { german: "der Vater", spanish: "el padre", pronunciation: "dea fa-ter" },
      { german: "die Mutter", spanish: "la madre", pronunciation: "di mu-ter" },
      { german: "das Buch", spanish: "el libro", pronunciation: "das buj" },
    ],
    relatedLessons: ["familia", "colegio"],
    relatedSituations: ["casa", "colegio"],
  },
  {
    id: "negacion-mit-nicht",
    title: "Negación con nicht",
    explanationShort: "Nicht sirve para negar muchas frases: no soy, no voy, no juego.",
    explanationDetailed:
      "Nicht suele colocarse cerca de lo que quieres negar. En esta fase basta con reconocerlo en frases sencillas.",
    examples: [
      { german: "Ich spiele nicht Fußball.", spanish: "No juego al fútbol.", pronunciation: "ij shpi-le nij fus-bal" },
      { german: "Das ist nicht mein Buch.", spanish: "Ese no es mi libro.", pronunciation: "das ist nij main buj" },
    ],
    relatedLessons: ["mini-conversacion-completa"],
    relatedSituations: ["futbol", "colegio"],
  },
  {
    id: "verbo-sein",
    title: "Verbo sein",
    explanationShort: "Sein significa ser o estar.",
    explanationDetailed:
      "Es uno de los verbos más importantes. Lo usas para nombre, edad, estado y ubicación en muchas frases del nivel 1.",
    examples: [
      { german: "Ich bin Jordi.", spanish: "Soy Jordi.", pronunciation: "ij bin Jordi" },
      { german: "Ich bin zwölf Jahre alt.", spanish: "Tengo doce años.", pronunciation: "ij bin tsvölf ya-re alt" },
    ],
    relatedLessons: ["decir-la-edad", "verbos-basicos"],
    relatedSituations: ["saludar", "presentarse"],
  },
  {
    id: "verbo-haben",
    title: "Verbo haben",
    explanationShort: "Haben significa tener.",
    explanationDetailed:
      "Lo usarás para hablar de familia, objetos, material de clase y cosas que necesitas.",
    examples: [
      { german: "Ich habe einen Stift.", spanish: "Tengo un bolígrafo.", pronunciation: "ij ja-be ai-nen shtift" },
      { german: "Hast du einen Stift?", spanish: "¿Tienes un bolígrafo?", pronunciation: "hast du ai-nen shtift?" },
    ],
    relatedLessons: ["familia", "colegio", "verbos-basicos"],
    relatedSituations: ["colegio", "casa"],
  },
  {
    id: "verbo-heissen",
    title: "Verbo heißen",
    explanationShort: "Heißen significa llamarse.",
    explanationDetailed:
      "Es el verbo principal para presentarte. La letra ß suena como una s fuerte.",
    examples: [
      { german: "Ich heiße Jordi.", spanish: "Me llamo Jordi.", pronunciation: "ij jai-se Jordi" },
      { german: "Wie heißt du?", spanish: "¿Cómo te llamas?", pronunciation: "vi jaist du?" },
    ],
    relatedLessons: ["presentarse", "verbos-basicos"],
    relatedSituations: ["saludar", "presentarse"],
  },
];

export function getGrammarTopic(topicId: string) {
  return grammarTopics.find((topic) => topic.id === topicId);
}
