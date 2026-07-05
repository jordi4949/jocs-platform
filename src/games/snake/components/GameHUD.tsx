"use client";

type GameHUDProps = {
  score: number;
  coins: number;
  coinsEarned: number;
  bestScore: number;
  botsAlive: number;
  skinName: string;
  turboEnergy: number;
  onReset: () => void;
};

export function GameHUD({
  score,
  coins,
  coinsEarned,
  bestScore,
  botsAlive,
  skinName,
  turboEnergy,
  onReset,
}: GameHUDProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 xl:grid-cols-6">
        <HudStat label="Puntos" value={score} />
        <HudStat label="Monedas" value={coins} />
        <HudStat label="Partida" value={`+${coinsEarned}`} />
        <HudStat label="Mejor" value={bestScore} />
        <HudStat label="Bots" value={botsAlive} />
        <HudStat label="Skin" value={skinName} />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-10 min-w-32 flex-1 overflow-hidden rounded-lg border border-white/10 bg-[#0c1713] lg:w-40">
          <div
            className="h-full bg-[#ffd166] transition-[width]"
            style={{ width: `${turboEnergy}%` }}
          />
        </div>
        <button
          className="h-10 rounded-lg border border-ink/15 bg-white px-4 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
          onClick={onReset}
          type="button"
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}

function HudStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0c1713] px-3 py-2 text-white">
      <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className="mt-1 truncate text-base font-black">{value}</p>
    </div>
  );
}
