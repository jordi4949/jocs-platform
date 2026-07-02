import { AppShell } from "@/components/app-shell";
import { PagePanel } from "@/components/page-panel";

export default function MissionsPage() {
  return (
    <AppShell>
      <PagePanel
        eyebrow="Misiones"
        title="Retos familiares"
        description="Aquí vivirán las misiones diarias, objetivos por puntuación y pequeños desafíos para jugar juntos."
      />
    </AppShell>
  );
}
