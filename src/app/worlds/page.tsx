import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";
import { WorldSelector } from "@/components/WorldSelector";

export default function WorldsPage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Mundos"
        title="Tematicas de la arena"
        description="Selecciona el mundo activo para cambiar el aspecto del mapa, la comida, las decoraciones y la musica preparada."
      >
        <WorldSelector />
      </PagePanel>
    </AppShell>
  );
}
