"use client";

import type { SnakeSkin } from "@/data/skins";

type ShopSkinCardProps = {
  skin: SnakeSkin;
  isActive: boolean;
  isUnlocked: boolean;
  canBuy: boolean;
  onBuy: () => void;
  onSelect: () => void;
};

export function ShopSkinCard({
  skin,
  isActive,
  isUnlocked,
  canBuy,
  onBuy,
  onSelect,
}: ShopSkinCardProps) {
  return (
    <article className="grid gap-4 rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-ink">{skin.name}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/65">{skin.description}</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-mist px-3 py-2 text-right">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-moss">
            Precio
          </p>
          <p className="text-base font-black text-ink">{skin.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <span
            className="h-7 w-7 rounded-full"
            key={`${skin.id}-${index}`}
            style={{
              background:
                index === 0
                  ? skin.headColor
                  : `linear-gradient(135deg, ${skin.bodyColor}, ${
                      skin.secondaryColor ?? skin.bodyColor
                    })`,
            }}
          />
        ))}
      </div>

      {isUnlocked ? (
        <button
          className="h-10 rounded-lg border border-ink/15 bg-ink px-4 text-sm font-black text-white transition hover:bg-moss disabled:cursor-default disabled:bg-moss"
          disabled={isActive}
          onClick={onSelect}
          type="button"
        >
          {isActive ? "Seleccionada" : "Seleccionar"}
        </button>
      ) : (
        <button
          aria-disabled={!canBuy}
          className={`h-10 rounded-lg border border-ink/15 bg-white px-4 text-sm font-black text-ink transition hover:border-moss hover:text-moss ${
            canBuy ? "" : "opacity-60"
          }`}
          onClick={onBuy}
          type="button"
        >
          Comprar
        </button>
      )}
    </article>
  );
}
