import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

const cards = [
  ["Snake", "Primera arena preparada para el futuro juego tipo Slither/Snake."],
  ["Misiones", "Objetivos diarios y retos familiares para añadir más adelante."],
  ["Ranking", "Base visual para puntuaciones y competición amistosa."],
];

export default function HomePage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Inicio"
        title="Base lista para la primera partida"
        description="Esta fase deja la plataforma protegida, navegable y preparada para desplegar. El juego completo vendrá después."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {cards.map(([title, description]) => (
            <article
              className="rounded-lg border border-moss/15 bg-mist p-4"
              key={title}
            >
              <h3 className="text-lg font-black text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">{description}</p>
            </article>
          ))}
        </div>
      </PagePanel>
    </AppShell>
  );
}
