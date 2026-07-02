import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

export default function ProfilePage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Perfil"
        title="Jugador"
        description="Página base para avatar, progreso, estadísticas y preferencias de la cuenta familiar."
      />
    </AppShell>
  );
}
