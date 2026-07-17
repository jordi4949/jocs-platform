export type GermanCourseLesson = {
  id: string;
  level: number;
  title: string;
  description: string;
  objective: string;
  keyPhrases: string[];
  grammarLinks: string[];
  dialogueIds: string[];
  rewardCoins: number;
  rewardXp: number;
};

export const courseLessons: GermanCourseLesson[] = [
  {
    id: "saludos",
    level: 1,
    title: "Saludos",
    description: "Aprende a saludar, despedirte y sonar amable desde el primer minuto.",
    objective: "Reconocer y usar saludos básicos en una conversación corta.",
    keyPhrases: ["Hallo!", "Guten Morgen!", "Tschüss!", "Bis bald!"],
    grammarLinks: ["preguntas-basicas"],
    dialogueIds: ["saludar-nombre-edad"],
    rewardCoins: 8,
    rewardXp: 20,
  },
  {
    id: "presentarse",
    level: 1,
    title: "Presentarse",
    description: "Di tu nombre y pregunta el nombre de otra persona.",
    objective: "Usar Ich heiße... y Wie heißt du? con seguridad.",
    keyPhrases: ["Ich heiße Jordi.", "Wie heißt du?", "Freut mich!"],
    grammarLinks: ["verbo-heissen", "pronombres-personales"],
    dialogueIds: ["saludar-nombre-edad"],
    rewardCoins: 8,
    rewardXp: 20,
  },
  {
    id: "decir-la-edad",
    level: 1,
    title: "Decir la edad",
    description: "Cuenta tu edad y pregunta la edad de otra persona.",
    objective: "Formar frases con Ich bin ... Jahre alt.",
    keyPhrases: ["Wie alt bist du?", "Ich bin zwölf Jahre alt.", "Und du?"],
    grammarLinks: ["verbo-sein", "presente-basico"],
    dialogueIds: ["saludar-nombre-edad"],
    rewardCoins: 8,
    rewardXp: 20,
  },
  {
    id: "decir-de-donde-eres",
    level: 1,
    title: "Decir de dónde eres",
    description: "Explica de qué país o ciudad vienes y dónde vives.",
    objective: "Usar Ich komme aus... e Ich wohne in...",
    keyPhrases: ["Woher kommst du?", "Ich komme aus Spanien.", "Ich wohne in Barcelona."],
    grammarLinks: ["preguntas-basicas", "presente-basico"],
    dialogueIds: ["presentarse-origen"],
    rewardCoins: 10,
    rewardXp: 25,
  },
  {
    id: "familia",
    level: 1,
    title: "Familia",
    description: "Habla de personas cercanas con frases sencillas.",
    objective: "Nombrar familiares y decir quién tienes en casa.",
    keyPhrases: ["Das ist meine Mutter.", "Ich habe einen Bruder.", "Meine Familie ist klein."],
    grammarLinks: ["articulos-der-die-das", "verbo-haben"],
    dialogueIds: ["presentarse-origen"],
    rewardCoins: 10,
    rewardXp: 25,
  },
  {
    id: "colegio",
    level: 1,
    title: "Colegio",
    description: "Usa frases útiles para clase, material y asignaturas.",
    objective: "Pedir y entender objetos básicos del colegio.",
    keyPhrases: ["Ich habe einen Stift.", "Wir lernen Deutsch.", "Das ist mein Buch."],
    grammarLinks: ["verbo-haben", "orden-de-la-frase"],
    dialogueIds: ["im-klassenzimmer"],
    rewardCoins: 10,
    rewardXp: 25,
  },
  {
    id: "numeros-1-20",
    level: 1,
    title: "Números del 1 al 20",
    description: "Aprende números para edades, horas y pequeñas compras.",
    objective: "Reconocer y decir números frecuentes hasta veinte.",
    keyPhrases: ["eins", "zwei", "drei", "zwölf", "zwanzig"],
    grammarLinks: ["presente-basico"],
    dialogueIds: ["saludar-nombre-edad", "tenis-amigos"],
    rewardCoins: 10,
    rewardXp: 25,
  },
  {
    id: "verbos-basicos",
    level: 1,
    title: "Verbos básicos: sein, haben, heißen",
    description: "Tres verbos que aparecen en casi todas las conversaciones iniciales.",
    objective: "Distinguir ser/estar, tener y llamarse en presente.",
    keyPhrases: ["Ich bin...", "Ich habe...", "Ich heiße..."],
    grammarLinks: ["verbo-sein", "verbo-haben", "verbo-heissen"],
    dialogueIds: ["saludar-nombre-edad", "im-klassenzimmer"],
    rewardCoins: 12,
    rewardXp: 30,
  },
  {
    id: "preguntas-basicas",
    level: 1,
    title: "Preguntas básicas",
    description: "Pregunta nombre, edad, origen y gustos con patrones fáciles.",
    objective: "Crear preguntas cortas cambiando el orden del verbo.",
    keyPhrases: ["Wie heißt du?", "Wo wohnst du?", "Spielst du Tennis?"],
    grammarLinks: ["preguntas-basicas", "orden-de-la-frase"],
    dialogueIds: ["presentarse-origen", "tenis-amigos"],
    rewardCoins: 12,
    rewardXp: 30,
  },
  {
    id: "mini-conversacion-completa",
    level: 1,
    title: "Mini conversación completa",
    description: "Une saludos, nombre, edad, origen y una actividad.",
    objective: "Mantener una conversación de 6 a 8 frases sencillas.",
    keyPhrases: ["Hallo!", "Ich heiße...", "Ich bin zwölf Jahre alt.", "Ich spiele Tennis."],
    grammarLinks: ["verbo-sein", "verbo-heissen", "preguntas-basicas"],
    dialogueIds: ["saludar-nombre-edad", "presentarse-origen", "tenis-amigos"],
    rewardCoins: 15,
    rewardXp: 40,
  },
];

export function getCourseLesson(lessonId: string) {
  return courseLessons.find((lesson) => lesson.id === lessonId);
}
