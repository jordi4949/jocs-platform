export type SpeakGermanOptions = {
  lang?: string;
  rate?: number;
};

export function speakGerman(text: string, options: SpeakGermanOptions = {}) {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {
    return Promise.reject(new Error("Audio no disponible en este navegador."));
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "de-DE";
  utterance.rate = options.rate ?? 1;

  const germanVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("de"));
  if (germanVoice) {
    utterance.voice = germanVoice;
  }

  return new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Audio no disponible en este navegador."));

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}
