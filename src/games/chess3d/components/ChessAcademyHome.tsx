"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CHESS_ACADEMY_CATEGORIES,
  academyLessons,
  getLessonsByCategory,
  type ChessAcademyCategory,
  type ChessAcademyDifficulty,
} from "@/games/chess3d/data/academyLessons";
import {
  createEmptyAcademyProgress,
  readAcademyProgress,
  type ChessAcademyProgress,
} from "@/games/chess3d/data/academyProgress";

const difficultyLabels: Record<ChessAcademyDifficulty, string> = {
  beginner: "Inicial",
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
};

export function ChessAcademyHome() {
  const [progress, setProgress] = useState<ChessAcademyProgress>(() => createEmptyAcademyProgress());
  const totalLessons = academyLessons.length;
  const completedLessons = progress.completedLessonIds.length;
  const groupedLessons = useMemo(
    () =>
      CHESS_ACADEMY_CATEGORIES.map((category) => ({
        category,
        lessons: getLessonsByCategory(category),
        progress: progress.categoryProgress[category],
      })),
    [progress],
  );

  useEffect(() => {
    setProgress(readAcademyProgress());
  }, []);

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-moss">Academia de ajedrez</p>
        <div className="mt-2 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div>
            <h2 className="text-3xl font-black text-ink sm:text-4xl">Aprende por conceptos</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">
              Lecciones cortas con ejemplos en el tablero 3D, pistas, solución y recompensas locales.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-moss/15 bg-mist p-3 text-center">
            <Stat label="Lecciones" value={`${completedLessons}/${totalLessons}`} />
            <Stat label="XP" value={progress.xp} />
            <Stat label="Monedas" value={progress.coins} />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {groupedLessons.map(({ category, lessons, progress: categoryProgress }) => (
          <CategoryBlock
            category={category}
            completedLessonIds={progress.completedLessonIds}
            key={category}
            lessons={lessons}
            progress={categoryProgress}
          />
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-white px-2 py-3">
      <p className="text-lg font-black text-ink">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-moss">{label}</p>
    </div>
  );
}

function CategoryBlock({
  category,
  completedLessonIds,
  lessons,
  progress,
}: {
  category: ChessAcademyCategory;
  completedLessonIds: string[];
  lessons: typeof academyLessons;
  progress?: { completed: number; total: number };
}) {
  const completed = progress?.completed ?? 0;
  const total = progress?.total ?? lessons.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-black text-ink">{category}</h3>
          <p className="mt-1 text-sm font-bold text-ink/60">
            {total > 0 ? `${completed} de ${total} completadas` : "Nuevas lecciones pronto"}
          </p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-mist sm:w-56">
          <div className="h-full rounded-full bg-leaf" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {lessons.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);

            return (
              <article className="rounded-lg border border-moss/15 bg-mist p-4" key={lesson.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">{lesson.concept}</p>
                    <h4 className="mt-1 text-lg font-black text-ink">{lesson.title}</h4>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                      isCompleted ? "bg-leaf text-ink" : "bg-white text-ink/65"
                    }`}
                  >
                    {isCompleted ? "Completada" : "Pendiente"}
                  </span>
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-ink/70">{lesson.shortExplanation}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
                  <span className="rounded-full bg-white px-3 py-1 text-moss">{difficultyLabels[lesson.difficulty]}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-ink/70">+{lesson.rewardXp} XP</span>
                  <span className="rounded-full bg-white px-3 py-1 text-ink/70">+{lesson.rewardCoins} monedas</span>
                </div>
                <Link
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-ink px-4 text-sm font-black text-white transition hover:bg-moss"
                  href={`/game/chess/academy/${lesson.id}`}
                >
                  Aprender
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
