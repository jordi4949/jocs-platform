import { AppShell } from "@/components/app-shell";
import { ChessGame } from "@/games/chess3d/components/ChessGame";
import Link from "next/link";

export default function ChessPage() {
  return (
    <AppShell>
      <section className="grid gap-4">
        <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-moss">Ajedrez 3D</p>
              <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Ajedrez 3D</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">
                Elige partida local, juega contra bot, entra en la academia o deja el online preparado para más adelante.
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 text-sm font-black text-white transition hover:bg-moss"
              href="/game/chess/academy"
            >
              Academia
            </Link>
          </div>
        </div>
        <ChessGame />
      </section>
    </AppShell>
  );
}
