import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { practicalSituations } from "@/academy/german/data/practicalSituations";
import { SituationCard } from "@/academy/german/components/SituationCard";

export default function GermanSituationsPage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
          <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german">
            Volver a Alemán
          </Link>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Situaciones prácticas</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Alemán para usarlo</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">
            Escenarios reales con vocabulario, frases útiles y diálogos preparados para audio.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {practicalSituations.map((situation) => (
            <SituationCard key={situation.id} situation={situation} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
