"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { GermanPracticalSituation } from "@/academy/german/data/practicalSituations";
import { getGermanProgress } from "@/lib/storage";

const difficultyLabels = {
  beginner: "Inicial",
  easy: "Fácil",
  medium: "Media",
};

export function SituationCard({ situation }: { situation: GermanPracticalSituation }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(getGermanProgress().completedSituations.includes(situation.id));
  }, [situation.id]);

  return (
    <article className="rounded-lg border border-moss/15 bg-mist p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">{situation.setting}</p>
          <h3 className="mt-1 text-xl font-black text-ink">{situation.title}</h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink/65">{difficultyLabels[situation.difficulty]}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{situation.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {situation.keyVocabulary.slice(0, 4).map((word) => (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-moss" key={word}>
            {word}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className={`text-xs font-black ${completed ? "text-moss" : "text-ink/50"}`}>
          {completed ? "Completada" : `${situation.dialogues.length} diálogos`}
        </span>
        <Link className="rounded-lg bg-ink px-4 py-2 text-sm font-black text-white transition hover:bg-moss" href={`/academy/german/situations/${situation.id}`}>
          Abrir
        </Link>
      </div>
    </article>
  );
}
