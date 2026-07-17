"use client";

import type { WorldTheme } from "@/types/worlds";

type WorldCardProps = {
  world: WorldTheme;
  isActive: boolean;
  isUnlocked: boolean;
  onSelect: () => void;
};

export function WorldCard({ world, isActive, isUnlocked, onSelect }: WorldCardProps) {
  return (
    <article
      className={`grid gap-4 rounded-lg border bg-white p-4 shadow-soft ${
        isActive ? "border-moss ring-4 ring-leaf/20" : "border-moss/15"
      }`}
    >
      <WorldPreview world={world} />

      <div className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-ink">{world.name}</h3>
            <p className="mt-1 text-sm leading-6 text-ink/65">{world.description}</p>
          </div>
          {isActive ? (
            <span className="rounded-lg border border-moss/20 bg-mist px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-moss">
              Activo
            </span>
          ) : null}
        </div>

        <button
          className="h-10 rounded-lg border border-ink/15 bg-ink px-4 text-sm font-black text-white transition hover:bg-moss disabled:cursor-default disabled:bg-moss/70"
          disabled={!isUnlocked || isActive}
          onClick={onSelect}
          type="button"
        >
          {isActive ? "Seleccionado" : isUnlocked ? "Seleccionar" : `Bloqueado ${world.price ?? ""}`}
        </button>
      </div>
    </article>
  );
}

function WorldPreview({ world }: { world: WorldTheme }) {
  return (
    <div
      className="relative h-32 overflow-hidden rounded-lg border border-ink/10"
      style={{ backgroundColor: world.backgroundColor }}
    >
      {world.ambienceImage || world.backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${world.ambienceImage ?? world.backgroundImage}")`,
            opacity: world.ambienceOpacity ?? 0.32,
          }}
        />
      ) : null}
      {world.tileTexture ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${world.tileTexture}")`,
            backgroundRepeat: "repeat",
            backgroundSize: `${Math.max(48, (world.tileSize ?? 280) / 4)}px auto`,
            opacity: world.tileOpacity ?? 1,
          }}
        />
      ) : null}
      {world.ambienceImage || world.backgroundImage || world.tileTexture ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: world.overlayColor ?? "transparent",
            opacity: world.overlayOpacity ?? 0,
          }}
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${world.gridColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "22px 22px",
        }}
      />
      <PreviewDecorations world={world} />
      <div
        className="absolute inset-2 rounded-lg border-4"
        style={{ borderColor: world.borderColor }}
      />
      <div className="absolute bottom-5 left-5 flex gap-1.5">
        {world.foodColors.slice(0, 4).map((color, index) => (
          <span
            className="h-3 w-3 rounded-full border border-white/35"
            key={`${world.id}-food-${index}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewDecorations({ world }: { world: WorldTheme }) {
  if (world.decorationType === "desert") {
    return (
      <>
        <span className="absolute bottom-8 right-12 h-10 w-3 rounded-t-full bg-[#2f6f3e]" />
        <span className="absolute bottom-9 right-8 h-6 w-2 rounded-t-full bg-[#2f6f3e]" />
        <span className="absolute bottom-0 left-12 h-12 w-36 rounded-t-[100%] bg-[#f2c078]/70" />
      </>
    );
  }

  if (world.decorationType === "alien") {
    return (
      <>
        <span className="absolute left-10 top-7 h-11 w-16 rounded-full border-4 border-[#84cc16]/45" />
        <span className="absolute right-12 top-8 text-2xl font-black text-[#bef264]">?</span>
        <span className="absolute bottom-7 right-20 h-7 w-7 rounded-full bg-[#67e8f9]/50" />
      </>
    );
  }

  if (world.decorationType === "galaxy") {
    return (
      <>
        <span className="absolute left-8 top-5 h-1.5 w-1.5 rounded-full bg-white" />
        <span className="absolute left-28 top-16 h-2 w-2 rounded-full bg-[#67e8f9]" />
        <span className="absolute right-10 top-7 h-10 w-10 rounded-full bg-[#8b5cf6]" />
        <span className="absolute right-8 top-11 h-1 w-14 rotate-[-18deg] rounded-full bg-[#f0abfc]/65" />
      </>
    );
  }

  if (world.decorationType === "festive") {
    return (
      <>
        <span className="absolute left-10 top-7 h-2 w-2 rounded-full bg-[#ef4444]" />
        <span className="absolute left-24 top-12 h-2 w-5 rotate-12 bg-[#22c55e]" />
        <span className="absolute right-16 top-8 h-2 w-2 rounded-full bg-[#facc15]" />
        <span className="absolute bottom-8 right-10 h-3 w-3 rounded-full bg-white" />
      </>
    );
  }

  if (world.decorationType === "monochrome") {
    return (
      <>
        <span className="absolute left-9 top-7 h-12 w-12 rounded-full border-4 border-black/60" />
        <span className="absolute right-14 bottom-8 h-12 w-12 bg-black/70" />
      </>
    );
  }

  if (world.decorationType === "blocks") {
    return (
      <>
        <span className="absolute left-8 top-8 h-9 w-9 bg-[#14b8a6]" />
        <span className="absolute left-16 top-16 h-7 w-7 bg-[#eab308]" />
        <span className="absolute right-12 top-10 h-12 w-12 bg-[#f97316]" />
      </>
    );
  }

  return (
    <span
      className="absolute right-12 top-9 h-14 w-14 rounded-full border-4"
      style={{ borderColor: world.accentColor }}
    />
  );
}
