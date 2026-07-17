"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { GermanCourseLesson } from "@/academy/german/data/courseLessons";
import { getGermanProgress } from "@/lib/storage";

export function CourseLessonCard({ lesson }: { lesson: GermanCourseLesson }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(getGermanProgress().completedLessons.includes(lesson.id));
  }, [lesson.id]);

  return (
    <article className="rounded-lg border border-moss/15 bg-mist p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Nivel {lesson.level}</p>
          <h3 className="mt-1 text-xl font-black text-ink">{lesson.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${completed ? "bg-leaf text-ink" : "bg-white text-ink/60"}`}>
          {completed ? "Hecha" : "Pendiente"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{lesson.description}</p>
      <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink/70">{lesson.objective}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
        <span className="rounded-full bg-white px-3 py-1 text-moss">+{lesson.rewardXp} XP</span>
        <span className="rounded-full bg-white px-3 py-1 text-moss">+{lesson.rewardCoins} monedas</span>
      </div>
      <Link
        className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-lg bg-ink px-4 text-sm font-black text-white transition hover:bg-moss"
        href={`/academy/german/course/${lesson.id}`}
      >
        Practicar
      </Link>
    </article>
  );
}
