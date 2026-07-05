import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";
import { SnakeGame } from "@/games/snake/components/SnakeGame";

export default function SnakePage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Juego"
        title="Snake"
        description="Primera arena local con puntuacion, monedas, skins y controles tactiles."
      >
        <SnakeGame />
      </PagePanel>
    </AppShell>
  );
}
