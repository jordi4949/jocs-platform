import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { grammarTopics } from "@/academy/german/data/grammarTopics";
import { GrammarTopicCard } from "@/academy/german/components/GrammarTopicCard";

export default function GermanGrammarPage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
          <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german">
            Volver a Alemán
          </Link>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Gramática</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Apoyo claro, no castigo</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">
            Temas cortos conectados con diálogos, situaciones y frases reales del curso.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {grammarTopics.map((topic) => (
            <GrammarTopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
