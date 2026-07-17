"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AudioButton } from "@/academy/german/components/AudioButton";
import { DialoguePlayer } from "@/academy/german/components/DialoguePlayer";
import { audioDialogues } from "@/academy/german/data/audioDialogues";
import { grammarTopics } from "@/academy/german/data/grammarTopics";
import type { GermanCourseLesson } from "@/academy/german/data/courseLessons";
import { completeGermanLesson, getGermanProgress } from "@/lib/storage";

export function GermanCourseLessonDetail({ lesson }: { lesson: GermanCourseLesson }) {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const dialogues = audioDialogues.filter((dialogue) => lesson.dialogueIds.includes(dialogue.id));
  const topics = grammarTopics.filter((topic) => lesson.grammarLinks.includes(topic.id));

  useEffect(() => {
    setCompleted(getGermanProgress().completedLessons.includes(lesson.id));
  }, [lesson.id]);

  const complete = () => {
    const result = completeGermanLesson(lesson.id, lesson.rewardCoins, lesson.rewardXp);
    setCompleted(true);
    setMessage(
      result.rewarded
        ? `Lección completada: +${lesson.rewardCoins} monedas y +${lesson.rewardXp} XP.`
        : "Esta lección ya estaba completada. La recompensa no se repite.",
    );
  };

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german/course">
          Volver al curso
        </Link>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Nivel {lesson.level}</p>
        <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{lesson.title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{lesson.description}</p>
        <p className="mt-4 rounded-lg bg-mist px-4 py-3 text-base font-black text-ink">{lesson.objective}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <section className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Frases útiles</p>
            <div className="mt-3 grid gap-2">
              {lesson.keyPhrases.map((phrase) => (
                <div className="flex flex-col gap-3 rounded-lg bg-mist px-4 py-3 sm:flex-row sm:items-center sm:justify-between" key={phrase}>
                  <p className="text-lg font-black text-ink">{phrase}</p>
                  <div className="flex flex-wrap gap-2">
                    <AudioButton audioId={`${lesson.id}-${phrase}`} text={phrase} />
                    <AudioButton audioId={`${lesson.id}-${phrase}-slow`} label="Lento" rate={0.75} text={phrase} />
                  </div>
                </div>
              ))}
            </div>
          </section>
          {dialogues.map((dialogue) => (
            <DialoguePlayer dialogue={dialogue} key={dialogue.id} />
          ))}
        </div>

        <aside className="grid content-start gap-3">
          <section className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Gramática conectada</p>
            <div className="mt-3 grid gap-2">
              {topics.map((topic) => (
                <Link className="rounded-lg bg-mist px-3 py-2 text-sm font-black text-ink transition hover:bg-leaf/25" href={`/academy/german/grammar/${topic.id}`} key={topic.id}>
                  {topic.title}
                </Link>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Recompensa</p>
            <p className="mt-3 text-2xl font-black text-ink">+{lesson.rewardXp} XP</p>
            <p className="mt-1 text-sm font-bold text-ink/65">+{lesson.rewardCoins} monedas</p>
            <button
              className="mt-4 h-11 w-full rounded-lg bg-ink px-4 text-sm font-black text-white transition disabled:bg-ink/40 enabled:hover:bg-moss"
              disabled={completed}
              onClick={complete}
              type="button"
            >
              {completed ? "Completada" : "Completar lección"}
            </button>
            {message ? <p className="mt-3 rounded-lg bg-leaf/25 px-3 py-2 text-sm font-bold text-ink">{message}</p> : null}
          </section>
        </aside>
      </div>
    </section>
  );
}
