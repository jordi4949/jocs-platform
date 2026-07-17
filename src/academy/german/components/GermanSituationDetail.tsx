"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { GermanPracticalSituation } from "@/academy/german/data/practicalSituations";
import { DialoguePlayer } from "@/academy/german/components/DialoguePlayer";
import { completeGermanSituation, getGermanProgress } from "@/lib/storage";

export function GermanSituationDetail({ situation }: { situation: GermanPracticalSituation }) {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCompleted(getGermanProgress().completedSituations.includes(situation.id));
  }, [situation.id]);

  const complete = () => {
    const result = completeGermanSituation(situation.id);
    setCompleted(true);
    setMessage(result.rewarded ? "Situación completada: +6 monedas y +15 XP." : "Esta situación ya estaba completada.");
  };

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german/situations">
          Volver a situaciones
        </Link>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">{situation.setting}</p>
        <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{situation.title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{situation.description}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="grid content-start gap-3">
          <section className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Vocabulario clave</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {situation.keyVocabulary.map((word) => (
                <span className="rounded-full bg-mist px-3 py-1 text-sm font-black text-ink" key={word}>
                  {word}
                </span>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Frases clave</p>
            <div className="mt-3 grid gap-2">
              {situation.keyPhrases.map((phrase) => (
                <p className="rounded-lg bg-mist px-3 py-2 text-sm font-black text-ink" key={phrase}>
                  {phrase}
                </p>
              ))}
            </div>
          </section>
          <button
            className="h-11 rounded-lg bg-ink px-4 text-sm font-black text-white transition disabled:bg-ink/40 enabled:hover:bg-moss"
            disabled={completed}
            onClick={complete}
            type="button"
          >
            {completed ? "Completada" : "Completar situación"}
          </button>
          {message ? <p className="rounded-lg bg-leaf/25 px-3 py-2 text-sm font-bold text-ink">{message}</p> : null}
        </aside>

        <div className="grid gap-4">
          {situation.dialogues.length ? (
            situation.dialogues.map((dialogue) => <DialoguePlayer dialogue={dialogue} key={dialogue.id} />)
          ) : (
            <section className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft">
              <p className="text-lg font-black text-ink">Diálogo próximamente</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">La situación ya está preparada para añadir diálogos y audios reales.</p>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
