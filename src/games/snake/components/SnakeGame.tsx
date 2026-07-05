"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSkinById } from "@/data/skins";
import {
  createInitialSnakeState,
  HEAD_RADIUS,
  SEGMENT_RADIUS,
  setNextDirection,
  stepSnakeGame,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "@/games/snake/engine/snakeEngine";
import { GameCanvas } from "@/games/snake/components/GameCanvas";
import { GameHUD } from "@/games/snake/components/GameHUD";
import { TouchControls } from "@/games/snake/components/TouchControls";
import type { Direction, SnakeGameState } from "@/games/snake/types";
import {
  addCoins,
  getActiveSkinId,
  getBestScore,
  getCoins,
  setBestScore,
} from "@/lib/storage";

const TURBO_DRAIN_PER_SECOND = 44;
const TURBO_RECHARGE_PER_SECOND = 24;

export function SnakeGame() {
  const [gameState, setGameState] = useState<SnakeGameState>(() => createInitialSnakeState());
  const [coins, setCoins] = useState(0);
  const [bestScore, setStoredBestScore] = useState(0);
  const [activeSkinId, setActiveSkinId] = useState("classic_green");
  const [turboPressed, setTurboPressed] = useState(false);
  const [turboEnergy, setTurboEnergy] = useState(100);

  const gameStateRef = useRef(gameState);
  const turboPressedRef = useRef(turboPressed);
  const turboEnergyRef = useRef(turboEnergy);
  const syncedCoinsEarnedRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    const freshState = createInitialSnakeState();
    syncedCoinsEarnedRef.current = 0;
    gameStateRef.current = freshState;
    lastFrameRef.current = null;
    turboEnergyRef.current = 100;
    setGameState(freshState);
    setTurboPressed(false);
    setTurboEnergy(100);
  }, []);

  const move = useCallback((direction: Direction) => {
    setGameState((currentState) => {
      const nextState = setNextDirection(currentState, direction);
      gameStateRef.current = nextState;
      return nextState;
    });
  }, []);

  useEffect(() => {
    setCoins(getCoins());
    setStoredBestScore(getBestScore());
    setActiveSkinId(getActiveSkinId());
  }, []);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (gameState.score > bestScore) {
      const nextBestScore = setBestScore(gameState.score);
      setStoredBestScore(nextBestScore);
    }
  }, [bestScore, gameState]);

  useEffect(() => {
    turboPressedRef.current = turboPressed;
  }, [turboPressed]);

  useEffect(() => {
    turboEnergyRef.current = turboEnergy;
  }, [turboEnergy]);

  useEffect(() => {
    if (gameState.coinsEarned <= syncedCoinsEarnedRef.current) {
      return;
    }

    const earnedDelta = gameState.coinsEarned - syncedCoinsEarnedRef.current;
    syncedCoinsEarnedRef.current = gameState.coinsEarned;
    setCoins(addCoins(earnedDelta));
  }, [gameState.coinsEarned]);

  useEffect(() => {
    let animationFrameId = 0;

    const tick = (timestamp: number) => {
      const lastFrame = lastFrameRef.current ?? timestamp;
      const deltaSeconds = Math.min((timestamp - lastFrame) / 1000, 0.08);
      lastFrameRef.current = timestamp;

      const canTurbo =
        turboPressedRef.current &&
        turboEnergyRef.current > 0 &&
        gameStateRef.current.status === "playing";

      setTurboEnergy((currentEnergy) => {
        const nextEnergy = canTurbo
          ? currentEnergy - TURBO_DRAIN_PER_SECOND * deltaSeconds
          : currentEnergy + TURBO_RECHARGE_PER_SECOND * deltaSeconds;

        const clampedEnergy = Math.max(0, Math.min(100, nextEnergy));
        turboEnergyRef.current = clampedEnergy;
        return clampedEnergy;
      });

      setGameState((currentState) => {
        const nextState = stepSnakeGame(currentState, deltaSeconds, canTurbo);
        gameStateRef.current = nextState;
        return nextState;
      });

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection(event.key);

      if (direction) {
        event.preventDefault();
        move(direction);
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        setTurboPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setTurboPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [move]);

  const activeSkin = useMemo(() => getSkinById(activeSkinId), [activeSkinId]);
  const turboActive = turboPressed && turboEnergy > 0 && gameState.status === "playing";

  const snapshot = {
    ...gameState,
    worldWidth: WORLD_WIDTH,
    worldHeight: WORLD_HEIGHT,
    segmentRadius: SEGMENT_RADIUS,
    headRadius: HEAD_RADIUS,
    skin: activeSkin,
    bestScore,
    turboActive,
    turboEnergy,
  };

  return (
    <section className="grid gap-4">
      <GameHUD
        bestScore={bestScore}
        botsAlive={gameState.bots.length}
        coins={coins}
        coinsEarned={gameState.coinsEarned}
        onReset={resetGame}
        score={gameState.score}
        skinName={activeSkin.name}
        turboEnergy={turboEnergy}
      />
      <GameCanvas snapshot={snapshot} />
      <TouchControls onDirection={move} onTurboChange={setTurboPressed} />
      <p className="sr-only">
        Flechas o WASD para mover. Espacio para turbo. En movil hay controles tactiles.
      </p>
    </section>
  );
}

function keyToDirection(key: string): Direction | null {
  const normalizedKey = key.toLowerCase();

  if (normalizedKey === "arrowup" || normalizedKey === "w") {
    return "up";
  }
  if (normalizedKey === "arrowdown" || normalizedKey === "s") {
    return "down";
  }
  if (normalizedKey === "arrowleft" || normalizedKey === "a") {
    return "left";
  }
  if (normalizedKey === "arrowright" || normalizedKey === "d") {
    return "right";
  }

  return null;
}
