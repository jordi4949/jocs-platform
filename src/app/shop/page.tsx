import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";
import { SkinShop } from "@/games/snake/components/SkinShop";

export default function ShopPage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Tienda"
        title="Aspectos y mejoras"
        description="Compra y selecciona skins con las monedas ganadas jugando en local."
      >
        <SkinShop />
      </PagePanel>
    </AppShell>
  );
}
