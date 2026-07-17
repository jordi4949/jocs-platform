"use client";

import { useEffect, useState } from "react";
import { WORLDS } from "@/data/worlds";
import { WorldCard } from "@/components/WorldCard";
import {
  getActiveWorld,
  getUnlockedWorlds,
  setActiveWorld,
} from "@/lib/storage";
import type { WorldId } from "@/types/worlds";

export function WorldSelector() {
  const [activeWorldId, setActiveWorldId] = useState<WorldId>("classic_arena");
  const [unlockedWorldIds, setUnlockedWorldIds] = useState<WorldId[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setActiveWorldId(getActiveWorld());
    setUnlockedWorldIds(getUnlockedWorlds());
  }, []);

  const selectWorld = (worldId: WorldId) => {
    setActiveWorld(worldId);
    setActiveWorldId(worldId);
    setMessage("Mundo seleccionado.");
  };

  return (
    <section className="grid gap-5">
      {message ? (
        <p className="rounded-lg border border-moss/15 bg-mist px-3 py-2 text-sm font-bold text-ink">
          {message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {WORLDS.map((world) => (
          <WorldCard
            isActive={activeWorldId === world.id}
            isUnlocked={unlockedWorldIds.includes(world.id)}
            key={world.id}
            onSelect={() => selectWorld(world.id)}
            world={world}
          />
        ))}
      </div>
    </section>
  );
}
