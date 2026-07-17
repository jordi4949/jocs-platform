import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";
import { ProfileClient } from "./profile-client";

export default function ProfilePage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Perfil"
        title="Jugador"
        description="Tu personaje local: nombre, titulo, rango, monedas, estrellas, skin, mundo y cosmeticos."
      >
        <ProfileClient />
      </PagePanel>
    </AppShell>
  );
}
