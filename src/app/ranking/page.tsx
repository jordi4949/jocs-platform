import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

export default function RankingPage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Ranking"
        title="Mejores partidas"
        description="Marcador inicial para futuras puntuaciones, récords personales y clasificación familiar."
      />
    </AppShell>
  );
}
