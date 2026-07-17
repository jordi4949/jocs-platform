import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { courseLessons } from "@/academy/german/data/courseLessons";
import { CourseLessonCard } from "@/academy/german/components/CourseLessonCard";
import { GermanProgressCard } from "@/academy/german/components/GermanProgressCard";

export default function GermanCoursePage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
          <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german">
            Volver a Alemán
          </Link>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Ruta del curso</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Nivel 1: empezar desde cero</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">
            Una ruta ordenada para pasar de saludos sueltos a una mini conversación completa.
          </p>
        </div>
        <GermanProgressCard />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {courseLessons.map((lesson) => (
            <CourseLessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
