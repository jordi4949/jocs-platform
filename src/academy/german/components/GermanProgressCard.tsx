"use client";

import { useEffect, useMemo, useState } from "react";
import { courseLessons } from "@/academy/german/data/courseLessons";
import { practicalSituations } from "@/academy/german/data/practicalSituations";
import { germanVerbs } from "@/academy/german/data/germanVerbs";
import { getGermanProgress, type GermanProgress } from "@/lib/storage";

const emptyProgress: GermanProgress = {
  completedLessons: [],
  completedSituations: [],
  studiedVerbs: [],
  listenedAudios: [],
  xp: 0,
  coins: 0,
};

export function GermanProgressCard() {
  const [progress, setProgress] = useState<GermanProgress>(emptyProgress);

  useEffect(() => {
    setProgress(getGermanProgress());
  }, []);

  const completion = useMemo(() => {
    const total = courseLessons.length + practicalSituations.length + germanVerbs.length;
    const completed = progress.completedLessons.length + progress.completedSituations.length + progress.studiedVerbs.length;
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [progress]);

  return (
    <section className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Progreso</p>
          <h3 className="mt-1 text-2xl font-black text-ink">{completion.percent}% del prototipo</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:w-80">
          <Stat label="XP" value={progress.xp} />
          <Stat label="Monedas" value={progress.coins} />
          <Stat label="Audios" value={progress.listenedAudios.length} />
        </div>
      </div>
      <div className="mt-4 h-4 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-leaf" style={{ width: `${completion.percent}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold text-ink/65">
        {completion.completed} de {completion.total} actividades marcadas.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-mist px-2 py-3">
      <p className="text-xl font-black text-ink">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.12em] text-moss">{label}</p>
    </div>
  );
}
