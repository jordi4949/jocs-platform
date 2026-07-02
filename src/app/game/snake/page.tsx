import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

export default function SnakePage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Juego"
        title="Snake"
        description="Pantalla reservada para construir el juego. De momento solo confirma navegación, protección de rutas y diseño móvil."
      >
        <div className="aspect-square w-full max-w-md rounded-lg border-4 border-ink bg-ink p-3">
          <div className="grid h-full grid-cols-8 grid-rows-8 gap-1">
            {Array.from({ length: 64 }).map((_, index) => (
              <div
                className={
                  index === 18 || index === 19 || index === 20
                    ? "rounded bg-leaf"
                    : index === 45
                      ? "rounded bg-peach"
                      : "rounded bg-white/10"
                }
                key={index}
              />
            ))}
          </div>
        </div>
      </PagePanel>
    </AppShell>
  );
}
