"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WorldTheme } from "@/types/worlds";
import { getMusicEnabled, setMusicEnabled } from "@/lib/storage";

type ThemeMusicPlayerProps = {
  world: WorldTheme;
};

export function ThemeMusicPlayer({ world }: ThemeMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSrcRef = useRef<string | null>(null);
  const hasInteractedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [missingFile, setMissingFile] = useState(false);

  const stopAudio = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const playTheme = useCallback(async () => {
    hasInteractedRef.current = true;
    setNeedsInteraction(false);

    if (!world.musicSrc) {
      stopAudio();
      return;
    }

    const exists = await audioExists(world.musicSrc);
    if (!exists) {
      stopAudio();
      setMissingFile(true);
      setMusicEnabled(false);
      setEnabled(false);
      setNeedsInteraction(false);
      return;
    }

    setMissingFile(false);

    try {
      if (!audioRef.current || activeSrcRef.current !== world.musicSrc) {
        stopAudio();
        const audio = new Audio(world.musicSrc);
        audio.loop = true;
        audio.volume = 0.25;
        audio.preload = "auto";
        audioRef.current = audio;
        activeSrcRef.current = world.musicSrc;
      }

      await audioRef.current.play();
    } catch {
      setNeedsInteraction(true);
    }
  }, [stopAudio, world.musicSrc]);

  useEffect(() => {
    const storedEnabled = getMusicEnabled();
    setEnabled(storedEnabled);
    setNeedsInteraction(storedEnabled);
  }, []);

  useEffect(() => {
    setMissingFile(false);
    stopAudio();
    activeSrcRef.current = null;

    if (enabled && hasInteractedRef.current) {
      void playTheme();
    } else if (enabled) {
      setNeedsInteraction(true);
    }
  }, [enabled, playTheme, stopAudio, world.id]);

  useEffect(() => {
    if (!enabled || !needsInteraction || !world.musicSrc) {
      return;
    }

    const handleFirstInteraction = () => {
      void playTheme();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [enabled, needsInteraction, playTheme, world.musicSrc]);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  const toggleMusic = () => {
    if (enabled) {
      stopAudio();
      setMusicEnabled(false);
      setEnabled(false);
      setNeedsInteraction(false);
      return;
    }

    setMusicEnabled(true);
    setEnabled(true);
    void playTheme();
  };

  const label = getButtonLabel({
    enabled,
    missingFile,
    needsInteraction,
    hasMusic: Boolean(world.musicSrc),
  });

  return (
    <button
      className="h-10 rounded-lg border border-ink/15 bg-white px-4 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
      onClick={toggleMusic}
      type="button"
    >
      {label}
    </button>
  );
}

async function audioExists(src: string) {
  try {
    const response = await fetch(src, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

function getButtonLabel({
  enabled,
  missingFile,
  needsInteraction,
  hasMusic,
}: {
  enabled: boolean;
  missingFile: boolean;
  needsInteraction: boolean;
  hasMusic: boolean;
}) {
  if (!hasMusic) {
    return "Sin musica";
  }

  if (missingFile) {
    return "Musica no disponible";
  }

  if (!enabled || needsInteraction) {
    return "Activar musica";
  }

  return "Desactivar musica";
}
