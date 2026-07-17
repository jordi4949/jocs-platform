import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

const cards = [
  ["/game/snake", "Snake", "Arena local tipo Slither/Snake con bots, skins, mundos y monedas."],
  ["/game/chess", "Ajedrez 3D", "Primera partida local con tablero 3D, reglas legales y turnos."],
  ["/academy/german", "Alemán", "Curso familiar con situaciones reales, diálogos, verbos y progreso local."],
  ["/missions", "Misiones", "Objetivos diarios y retos familiares para anadir mas adelante."],
  ["/ranking", "Ranking", "Base visual para puntuaciones y competicion amistosa."],
];

export default function HomePage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Inicio"
        title="Base lista para jugar"
        description="Plataforma local con juegos, progreso visual y zonas preparadas para crecer."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([href, title, description]) => (
            <Link
              className="rounded-lg border border-moss/15 bg-mist p-4 transition hover:border-moss hover:bg-white"
              href={href}
              key={href}
            >
              <h3 className="text-lg font-black text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">{description}</p>
            </Link>
          ))}
        </div>
      </PagePanel>
    </AppShell>
  );
}
