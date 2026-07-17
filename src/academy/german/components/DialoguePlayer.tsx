"use client";

import { useState } from "react";
import { AudioButton } from "@/academy/german/components/AudioButton";
import { DialogueLine } from "@/academy/german/components/DialogueLine";
import type { GermanAudioDialogue } from "@/academy/german/data/audioDialogues";

export function DialoguePlayer({ dialogue }: { dialogue: GermanAudioDialogue }) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showPronunciation, setShowPronunciation] = useState(true);
  const dialogueText = dialogue.lines.map((line) => line.german).join(" ");

  return (
    <section className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Diálogo</p>
          <h3 className="mt-1 text-2xl font-black text-ink">{dialogue.title}</h3>
          <p className="mt-2 text-sm font-bold text-ink/60">
            Nivel {dialogue.level} · {dialogue.speakers.join(" + ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AudioButton audioId={`${dialogue.id}-full`} audioSrc={dialogue.fullAudioSrc ?? dialogue.normalAudioSrc} text={dialogueText} />
          <AudioButton audioId={`${dialogue.id}-slow`} audioSrc={dialogue.slowAudioSrc} label="Lento" rate={0.75} text={dialogueText} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="h-10 rounded-lg border border-moss/20 bg-mist px-4 text-sm font-black text-ink transition hover:border-moss hover:bg-white"
          onClick={() => setShowTranslation((current) => !current)}
          type="button"
        >
          {showTranslation ? "Ocultar traducción" : "Ver traducción"}
        </button>
        <button
          className="h-10 rounded-lg border border-moss/20 bg-mist px-4 text-sm font-black text-ink transition hover:border-moss hover:bg-white"
          onClick={() => setShowPronunciation((current) => !current)}
          type="button"
        >
          {showPronunciation ? "Ocultar pronunciación" : "Ver pronunciación"}
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {dialogue.lines.map((line, index) => (
          <DialogueLine
            key={`${dialogue.id}-${line.speaker}-${index}`}
            line={line}
            showPronunciation={showPronunciation}
            showTranslation={showTranslation}
          />
        ))}
      </div>
    </section>
  );
}
