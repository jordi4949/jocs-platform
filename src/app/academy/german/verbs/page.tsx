import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { germanVerbs } from "@/academy/german/data/germanVerbs";
import { PronunciationBadge } from "@/academy/german/components/PronunciationBadge";

export default function GermanVerbsPage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
          <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german">
            Volver a Alemán
          </Link>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Verbos</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Conjugaciones que vas a usar</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">
            Presente básico con traducción, pronunciación aproximada, ejemplos y audio preparado.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {germanVerbs.map((verb) => (
            <Link
              className="rounded-lg border border-moss/15 bg-mist p-4 transition hover:border-moss hover:bg-white"
              href={`/academy/german/verbs/${verb.id}`}
              key={verb.id}
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">{verb.tense}</p>
              <h3 className="mt-1 text-2xl font-black text-ink">{verb.infinitive}</h3>
              <p className="mt-2 text-sm font-bold text-ink/70">{verb.spanish}</p>
              <div className="mt-3">
                <PronunciationBadge pronunciation={verb.pronunciation} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
