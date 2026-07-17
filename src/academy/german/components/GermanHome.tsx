import Link from "next/link";
import { audioDialogues } from "@/academy/german/data/audioDialogues";
import { courseLessons } from "@/academy/german/data/courseLessons";
import { germanVerbs } from "@/academy/german/data/germanVerbs";
import { grammarTopics } from "@/academy/german/data/grammarTopics";
import { practicalSituations } from "@/academy/german/data/practicalSituations";
import { GermanProgressCard } from "@/academy/german/components/GermanProgressCard";

const sections = [
  {
    href: "/academy/german/course",
    title: "Ruta del curso",
    description: "Nivel 1 ordenado desde saludos hasta una mini conversación completa.",
    stat: `${courseLessons.length} lecciones`,
  },
  {
    href: "/academy/german/situations",
    title: "Situaciones prácticas",
    description: "Colegio, casa, deporte, restaurante, viajes y conversaciones familiares.",
    stat: `${practicalSituations.length} situaciones`,
  },
  {
    href: "/academy/german/grammar",
    title: "Gramática",
    description: "Apoyo claro y conectado con frases reales, sin convertirlo en tostón.",
    stat: `${grammarTopics.length} temas`,
  },
  {
    href: "/academy/german/verbs",
    title: "Verbos y conjugaciones",
    description: "Verbos básicos con presente, traducción y pronunciación aproximada.",
    stat: `${germanVerbs.length} verbos`,
  },
  {
    href: "/academy/german/audios",
    title: "Audios y diálogos",
    description: "Estructura preparada para audios completos, lentos y frase por frase.",
    stat: `${audioDialogues.length} diálogos`,
  },
];

export function GermanHome() {
  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-moss">Academia de Alemán</p>
        <div className="mt-2 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <h2 className="text-3xl font-black text-ink sm:text-4xl">Deutsch para empezar de verdad</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">
              Curso local y familiar con ruta clara, situaciones reales, conversaciones, pronunciación aproximada,
              verbos y progreso guardado en este navegador.
            </p>
          </div>
          <div className="rounded-lg border border-moss/15 bg-mist p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Modo prototipo</p>
            <p className="mt-2 text-sm font-bold leading-6 text-ink/70">
              Preparado para audios reales, vídeos, reconocimiento de voz, conversación guiada y profesor IA en fases futuras.
            </p>
          </div>
        </div>
      </div>

      <GermanProgressCard />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            className="rounded-lg border border-moss/15 bg-white/85 p-5 shadow-soft transition hover:border-moss hover:bg-white"
            href={section.href}
            key={section.href}
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">{section.stat}</p>
            <h3 className="mt-2 text-2xl font-black text-ink">{section.title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/70">{section.description}</p>
            <span className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 text-sm font-black text-white">
              Entrar
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
