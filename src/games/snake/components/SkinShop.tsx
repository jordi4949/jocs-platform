"use client";

import { useEffect, useState } from "react";
import { SNAKE_SKINS } from "@/data/skins";
import { ShopSkinCard } from "@/games/snake/components/ShopSkinCard";
import {
  getActiveSkinId,
  getCoins,
  getUnlockedSkinIds,
  setActiveSkinId,
  setCoins,
  unlockSkin,
} from "@/lib/storage";

export function SkinShop() {
  const [coins, setLocalCoins] = useState(0);
  const [activeSkinId, setLocalActiveSkinId] = useState("classic_green");
  const [unlockedSkinIds, setLocalUnlockedSkinIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLocalCoins(getCoins());
    setLocalActiveSkinId(getActiveSkinId());
    setLocalUnlockedSkinIds(getUnlockedSkinIds());
  }, []);

  const buySkin = (skinId: string, price: number) => {
    if (coins < price) {
      setMessage("No tienes monedas suficientes.");
      return;
    }

    const nextCoins = coins - price;
    setCoins(nextCoins);
    unlockSkin(skinId);
    setActiveSkinId(skinId);
    setLocalCoins(nextCoins);
    setLocalUnlockedSkinIds(getUnlockedSkinIds());
    setLocalActiveSkinId(skinId);
    setMessage("Skin comprada y seleccionada.");
  };

  const selectSkin = (skinId: string) => {
    setActiveSkinId(skinId);
    setLocalActiveSkinId(skinId);
    setMessage("Skin seleccionada.");
  };

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-moss/15 bg-mist p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-moss">
            Monedas
          </p>
          <p className="mt-1 text-3xl font-black text-ink">{coins}</p>
        </div>
        {message ? (
          <p className="rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink">
            {message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SNAKE_SKINS.map((skin) => {
          const isUnlocked = unlockedSkinIds.includes(skin.id);

          return (
            <ShopSkinCard
              canBuy={coins >= skin.price}
              isActive={activeSkinId === skin.id}
              isUnlocked={isUnlocked}
              key={skin.id}
              onBuy={() => buySkin(skin.id, skin.price)}
              onSelect={() => selectSkin(skin.id)}
              skin={skin}
            />
          );
        })}
      </div>
    </section>
  );
}
