import Link from "next/link";
import { DialoguePlayer } from "@/academy/german/components/DialoguePlayer";
import { audioDialogues } from "@/academy/german/data/audioDialogues";
import { AppShell } from "@/components/app-shell";

export default function GermanAudiosPage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
          <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german">
            Volver a Alemán
          </Link>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Audios y diálogos</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Escuchar, leer y repetir</h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">
            Los botones intentan reproducir el mp3 real. Si todavía no existe, el navegador lee la frase en alemán automáticamente.
          </p>
        </div>
        {audioDialogues.map((dialogue) => (
          <DialoguePlayer dialogue={dialogue} key={dialogue.id} />
        ))}
      </section>
    </AppShell>
  );
}
