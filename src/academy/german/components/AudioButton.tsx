"use client";

import { useState } from "react";
import { speakGerman } from "@/academy/german/utils/speech";
import { markGermanAudioListened } from "@/lib/storage";

type AudioState = "idle" | "playing";

type AudioButtonProps = {
  audioId?: string;
  audioSrc?: string;
  label?: string;
  lang?: string;
  rate?: number;
  text: string;
};

function playAudioFile(audioSrc: string) {
  const audio = new Audio(audioSrc);

  return new Promise<void>((resolve, reject) => {
    audio.addEventListener("ended", () => resolve(), { once: true });
    audio.addEventListener("error", () => reject(new Error("No se pudo reproducir el mp3.")), { once: true });
    audio.play().catch(reject);
  });
}

export function AudioButton({ audioId, audioSrc, label = "Escuchar", lang = "de-DE", rate = 1, text }: AudioButtonProps) {
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [message, setMessage] = useState("");

  const playAudio = async () => {
    if (audioState === "playing") {
      return;
    }

    setAudioState("playing");
    setMessage("");

    try {
      if (audioSrc) {
        try {
          await playAudioFile(audioSrc);
        } catch {
          await speakGerman(text, { lang, rate });
        }
      } else {
        await speakGerman(text, { lang, rate });
      }

      if (audioId) {
        markGermanAudioListened(audioId);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Audio no disponible en este navegador.");
    } finally {
      setAudioState("idle");
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        className="h-9 rounded-lg bg-ink px-3 text-xs font-black text-white transition disabled:cursor-wait disabled:bg-ink/40 enabled:hover:bg-moss"
        disabled={audioState === "playing" || !text.trim()}
        onClick={playAudio}
        type="button"
      >
        {audioState === "playing" ? "Sonando" : label}
      </button>
      {message ? <span className="text-xs font-bold text-red-700">{message}</span> : null}
    </span>
  );
}
