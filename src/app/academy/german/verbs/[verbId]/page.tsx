import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { VerbConjugationTable } from "@/academy/german/components/VerbConjugationTable";
import { germanVerbs, getGermanVerb } from "@/academy/german/data/germanVerbs";

export function generateStaticParams() {
  return germanVerbs.map((verb) => ({ verbId: verb.id }));
}

export default async function GermanVerbPage({ params }: { params: Promise<{ verbId: string }> }) {
  const { verbId } = await params;
  const verb = getGermanVerb(verbId);

  if (!verb) {
    notFound();
  }

  return (
    <AppShell>
      <section className="grid gap-4">
        <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german/verbs">
          Volver a verbos
        </Link>
        <VerbConjugationTable verb={verb} />
      </section>
    </AppShell>
  );
}
