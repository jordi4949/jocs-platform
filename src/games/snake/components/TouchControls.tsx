"use client";

import type { ReactNode } from "react";
import type { Direction } from "@/games/snake/types";

type TouchControlsProps = {
  onDirection: (direction: Direction) => void;
  onTurboChange: (isPressed: boolean) => void;
};

export function TouchControls({ onDirection, onTurboChange }: TouchControlsProps) {
  return (
    <>
      <div className="fixed bottom-5 left-4 z-30 grid grid-cols-3 gap-2 sm:bottom-6 sm:left-6">
        <span />
        <ControlButton label="Arriba" onPress={() => onDirection("up")}>
          {"\u2191"}
        </ControlButton>
        <span />
        <ControlButton label="Izquierda" onPress={() => onDirection("left")}>
          {"\u2190"}
        </ControlButton>
        <ControlButton label="Abajo" onPress={() => onDirection("down")}>
          {"\u2193"}
        </ControlButton>
        <ControlButton label="Derecha" onPress={() => onDirection("right")}>
          {"\u2192"}
        </ControlButton>
      </div>

      <button
        aria-label="Turbo"
        className="fixed bottom-6 right-4 z-30 h-24 w-24 touch-none rounded-full border-2 border-[#fff2bd] bg-[#ffd166] text-xs font-black uppercase tracking-[0.12em] text-[#291e02] shadow-soft active:scale-95 sm:right-6"
        onPointerCancel={() => onTurboChange(false)}
        onPointerDown={(event) => {
          event.preventDefault();
          onTurboChange(true);
        }}
        onPointerLeave={() => onTurboChange(false)}
        onPointerUp={() => onTurboChange(false)}
        type="button"
      >
        Turbo
      </button>
    </>
  );
}

function ControlButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="grid h-16 w-16 touch-none place-items-center rounded-lg border-2 border-white/30 bg-[#101c18]/95 text-3xl font-black text-white shadow-soft active:scale-95 sm:h-[4.5rem] sm:w-[4.5rem]"
      onPointerDown={(event) => {
        event.preventDefault();
        onPress();
      }}
      type="button"
    >
      {children}
    </button>
  );
}
