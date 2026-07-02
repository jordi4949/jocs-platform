import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

export default function ShopPage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Tienda"
        title="Aspectos y mejoras"
        description="Espacio preparado para skins, colores y objetos desbloqueables cuando el juego tenga progresión."
      />
    </AppShell>
  );
}
