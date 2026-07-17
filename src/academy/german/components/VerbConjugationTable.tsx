"use client";

import { useEffect, useState } from "react";
import { AudioButton } from "@/academy/german/components/AudioButton";
import { PronunciationBadge } from "@/academy/german/components/PronunciationBadge";
import type { GermanVerb } from "@/academy/german/data/germanVerbs";
import { getGermanProgress, markGermanVerbStudied } from "@/lib/storage";

export function VerbConjugationTable({ verb }: { verb: GermanVerb }) {
  const [studied, setStudied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setStudied(getGermanProgress().studiedVerbs.includes(verb.id));
  }, [verb.id]);

  const markStudied = () => {
    const result = markGermanVerbStudied(verb.id);
    setStudied(true);
    setMessage(result.rewarded ? "Verbo estudiado: +4 monedas y +10 XP." : "Este verbo ya estaba marcado como estudiado.");
  };

  return (
    <section className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Verbo en presente</p>
          <h3 className="mt-1 text-3xl font-black text-ink">{verb.infinitive}</h3>
          <p className="mt-2 text-base font-bold text-ink/70">{verb.spanish}</p>
          <div className="mt-3">
            <PronunciationBadge pronunciation={verb.pronunciation} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <AudioButton audioId={`verb-${verb.id}`} audioSrc={verb.audioSrc} text={verb.infinitive} />
          <AudioButton audioId={`verb-${verb.id}-slow`} label="Lento" rate={0.75} text={verb.infinitive} />
          <button
            className="h-9 rounded-lg bg-ink px-3 text-xs font-black text-white transition disabled:bg-ink/40 enabled:hover:bg-moss"
            disabled={studied}
            onClick={markStudied}
            type="button"
          >
            {studied ? "Estudiado" : "Marcar estudiado"}
          </button>
        </div>
      </div>

      {message ? <p className="mt-4 rounded-lg bg-leaf/25 px-3 py-2 text-sm font-bold text-ink">{message}</p> : null}

      <div className="mt-4 overflow-hidden rounded-lg border border-moss/15">
        <div className="grid grid-cols-[0.8fr_1fr] gap-2 bg-mist px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-moss sm:grid-cols-[0.7fr_1fr_1.4fr_1fr]">
          <span>Pronombre</span>
          <span>Forma</span>
          <span className="hidden sm:block">Traducción</span>
          <span className="hidden sm:block">Audio</span>
        </div>
        {verb.conjugations.map((conjugation) => (
          <div
            className="grid grid-cols-[0.8fr_1fr] items-center gap-2 border-t border-moss/10 bg-white px-3 py-3 text-sm sm:grid-cols-[0.7fr_1fr_1.4fr_1fr]"
            key={`${verb.id}-${conjugation.pronoun}`}
          >
            <span className="font-black text-ink">{conjugation.pronoun}</span>
            <span className="font-black text-moss">{conjugation.form}</span>
            <span className="col-span-2 text-ink/70 sm:col-span-1">
              {conjugation.spanish}
              <br />
              <span className="text-xs font-bold text-ink/50">{conjugation.pronunciation}</span>
            </span>
            <span className="col-span-2 flex flex-wrap gap-2 sm:col-span-1">
              <AudioButton
                audioId={`${verb.id}-${conjugation.pronoun}`}
                audioSrc={conjugation.audioSrc}
                text={`${conjugation.pronoun} ${conjugation.form}`}
              />
              <AudioButton
                audioId={`${verb.id}-${conjugation.pronoun}-slow`}
                label="Lento"
                rate={0.75}
                text={`${conjugation.pronoun} ${conjugation.form}`}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {verb.examples.map((example, index) => (
          <article className="rounded-lg bg-mist p-4" key={`${verb.id}-example-${index}`}>
            <p className="text-lg font-black text-ink">{example.german}</p>
            <p className="mt-1 text-sm font-bold text-ink/70">{example.spanish}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PronunciationBadge pronunciation={example.pronunciation} />
              <AudioButton audioId={`${verb.id}-example-${index}`} audioSrc={example.audioSrc} text={example.german} />
              <AudioButton audioId={`${verb.id}-example-${index}-slow`} label="Lento" rate={0.75} text={example.german} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
