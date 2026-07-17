import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GermanSituationDetail } from "@/academy/german/components/GermanSituationDetail";
import { getPracticalSituation, practicalSituations } from "@/academy/german/data/practicalSituations";

export function generateStaticParams() {
  return practicalSituations.map((situation) => ({ situationId: situation.id }));
}

export default async function GermanSituationPage({ params }: { params: Promise<{ situationId: string }> }) {
  const { situationId } = await params;
  const situation = getPracticalSituation(situationId);

  if (!situation) {
    notFound();
  }

  return (
    <AppShell>
      <GermanSituationDetail situation={situation} />
    </AppShell>
  );
}
