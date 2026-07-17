"use client";

import { useEffect, useRef } from "react";
import { getSkinById } from "@/data/skins";
import type { SnakeSkin } from "@/data/skins";
import type { BotSnake, Point, SnakeRenderSnapshot } from "@/games/snake/types";
import type { WorldDecorationKind } from "@/types/worlds";

type GameCanvasProps = {
  snapshot: SnakeRenderSnapshot;
};

type Camera = {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
};

type CachedImage = {
  image: HTMLImageElement;
  failed: boolean;
};

const botHeadImageCache = new Map<string, CachedImage>();
const worldBackgroundImageCache = new Map<string, CachedImage>();
const BOT_IMAGE_HEAD_SCALE = 3;
const DEFAULT_DESERT_DECORATIONS: WorldDecorationKind[] = [
  "cactus",
  "rock",
  "bones",
  "dry_bush",
  "small_dune",
  "oasis",
];

export function GameCanvas({ snapshot }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    snapshotRef.current = snapshot;
    drawGame(canvasRef.current, snapshot);
  }, [snapshot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      drawGame(canvas, snapshotRef.current);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let animationFrameId = 0;

    const drawFrame = () => {
      drawGame(canvasRef.current, snapshotRef.current);
      animationFrameId = window.requestAnimationFrame(drawFrame);
    };

    animationFrameId = window.requestAnimationFrame(drawFrame);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative h-[min(76vh,820px)] min-h-[430px] w-full overflow-hidden rounded-lg border border-white/10 bg-[#07100d] shadow-soft sm:min-h-[520px]">
      <canvas
        aria-label="Arena de Snake"
        className="h-full w-full touch-none"
        ref={canvasRef}
      />
      {snapshot.status === "game-over" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 p-4">
          <div className="rounded-lg border border-white/15 bg-[#111b18]/92 px-6 py-5 text-center text-white shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/60">
              Game Over
            </p>
            <p className="mt-2 text-4xl font-black">{snapshot.score}</p>
            <p className="mt-2 text-sm font-bold text-white/60">Pulsa Reiniciar para volver</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function drawGame(canvas: HTMLCanvasElement | null, snapshot: SnakeRenderSnapshot) {
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const camera = createCamera(snapshot, width, height);

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  drawBackdrop(context, width, height, snapshot);
  drawWorld(context, snapshot, camera);
  drawPortals(context, snapshot, camera);
  drawFood(context, snapshot, camera);
  drawBots(context, snapshot, camera);
  drawSnake(context, snapshot, camera);
  drawWorldBorder(context, snapshot, camera);
  drawPortalMessage(context, snapshot, width);
}

function createCamera(snapshot: SnakeRenderSnapshot, width: number, height: number): Camera {
  const head = snapshot.snake[0];
  const zoom = Math.max(0.48, Math.min(0.9, Math.min(width / 1240, height / 820)));
  const visibleWorldWidth = width / zoom;
  const visibleWorldHeight = height / zoom;

  return {
    x: clamp(head.x, visibleWorldWidth / 2, snapshot.worldWidth - visibleWorldWidth / 2),
    y: clamp(head.y, visibleWorldHeight / 2, snapshot.worldHeight - visibleWorldHeight / 2),
    zoom,
    width,
    height,
  };
}

function drawBackdrop(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  snapshot: SnakeRenderSnapshot,
) {
  context.fillStyle = snapshot.worldTheme.backgroundColor;
  context.fillRect(0, 0, width, height);

  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.4,
    20,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.75,
  );
  gradient.addColorStop(0, snapshot.worldTheme.accentColor);
  gradient.addColorStop(0.52, snapshot.worldTheme.backgroundColor);
  gradient.addColorStop(1, "#050b0a");

  context.save();
  context.globalAlpha = 0.44;
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.restore();
}

function drawWorld(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const topLeft = worldToScreen({ x: 0, y: 0 }, camera);
  const worldWidth = snapshot.worldWidth * camera.zoom;
  const worldHeight = snapshot.worldHeight * camera.zoom;

  context.fillStyle = snapshot.worldTheme.backgroundColor;
  context.fillRect(topLeft.x, topLeft.y, worldWidth, worldHeight);

  context.save();
  context.beginPath();
  context.rect(topLeft.x, topLeft.y, worldWidth, worldHeight);
  context.clip();

  const ambienceDrawn = drawWorldAmbienceImage(context, snapshot, camera);
  const tileDrawn = drawWorldTileTexture(context, snapshot, camera);
  drawWorldOverlay(context, snapshot, topLeft, worldWidth, worldHeight, tileDrawn || ambienceDrawn);

  const step = 96;
  const dotRadius = Math.max(1, 1.8 * camera.zoom);
  const startX = Math.floor((camera.x - camera.width / camera.zoom / 2) / step) * step;
  const endX = camera.x + camera.width / camera.zoom / 2 + step;
  const startY = Math.floor((camera.y - camera.height / camera.zoom / 2) / step) * step;
  const endY = camera.y + camera.height / camera.zoom / 2 + step;

  context.save();
  context.globalAlpha = tileDrawn || ambienceDrawn ? 0.28 : 1;
  context.fillStyle = snapshot.worldTheme.gridColor;

  for (let x = startX; x <= endX; x += step) {
    for (let y = startY; y <= endY; y += step) {
      const screen = worldToScreen({ x, y }, camera);
      context.beginPath();
      context.arc(screen.x, screen.y, dotRadius, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.restore();
  drawWorldDecorations(context, snapshot, camera, startX, endX, startY, endY);
  drawWorldVignette(context, snapshot, topLeft, worldWidth, worldHeight);
  context.restore();
}

function drawWorldTileTexture(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const image = getCachedWorldImage(snapshot.worldTheme.tileTexture);

  if (!image || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return false;
  }

  drawRepeatedWorldImage(context, image, snapshot, camera);
  return true;
}

function drawWorldAmbienceImage(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  if ((snapshot.worldTheme.ambienceOpacity ?? 0.18) <= 0) {
    return false;
  }

  const image = getCachedWorldImage(snapshot.worldTheme.ambienceImage);

  if (!image || !image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return false;
  }

  drawCoveredWorldImage(context, image, snapshot, camera);
  return true;
}

function drawCoveredWorldImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const scale = Math.max(camera.width / image.naturalWidth, camera.height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale * 1.18;
  const drawHeight = image.naturalHeight * scale * 1.18;
  const parallaxStrength = snapshot.worldTheme.parallaxSpeed ?? 0.26;
  const progressX = snapshot.worldWidth > 0 ? camera.x / snapshot.worldWidth : 0.5;
  const progressY = snapshot.worldHeight > 0 ? camera.y / snapshot.worldHeight : 0.5;
  const overflowX = Math.max(0, drawWidth - camera.width);
  const overflowY = Math.max(0, drawHeight - camera.height);
  const x = (camera.width - drawWidth) / 2 - (progressX - 0.5) * overflowX * parallaxStrength;
  const y = (camera.height - drawHeight) / 2 - (progressY - 0.5) * overflowY * parallaxStrength;

  context.save();
  context.globalAlpha = clamp(snapshot.worldTheme.ambienceOpacity ?? 0.18, 0, 1);
  context.drawImage(image, x, y, drawWidth, drawHeight);
  context.restore();
}

function drawRepeatedWorldImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const tileWorldWidth = snapshot.worldTheme.tileSize ?? 420;
  const tileWorldHeight = tileWorldWidth * (image.naturalHeight / image.naturalWidth);
  const visibleWorldWidth = camera.width / camera.zoom;
  const visibleWorldHeight = camera.height / camera.zoom;
  const startX = Math.floor((camera.x - visibleWorldWidth / 2) / tileWorldWidth) * tileWorldWidth;
  const endX = camera.x + visibleWorldWidth / 2 + tileWorldWidth;
  const startY = Math.floor((camera.y - visibleWorldHeight / 2) / tileWorldHeight) * tileWorldHeight;
  const endY = camera.y + visibleWorldHeight / 2 + tileWorldHeight;

  context.save();
  context.globalAlpha = clamp(snapshot.worldTheme.tileOpacity ?? 1, 0, 1);

  for (let x = startX; x <= endX; x += tileWorldWidth) {
    for (let y = startY; y <= endY; y += tileWorldHeight) {
      const screen = worldToScreen({ x, y }, camera);
      const drawWidth = tileWorldWidth * camera.zoom;
      const drawHeight = tileWorldHeight * camera.zoom;
      const tileX = Math.round(x / tileWorldWidth);
      const tileY = Math.round(y / tileWorldHeight);
      const flipX = Math.abs(tileX + tileY) % 2 === 1;
      const flipY = Math.abs(tileX * 3 + tileY) % 3 === 1;

      context.save();
      context.translate(screen.x + (flipX ? drawWidth : 0), screen.y + (flipY ? drawHeight : 0));
      context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      context.drawImage(image, 0, 0, drawWidth, drawHeight);
      context.restore();
    }
  }

  context.restore();
}

function drawWorldOverlay(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  topLeft: Point,
  worldWidth: number,
  worldHeight: number,
  imageDrawn: boolean,
) {
  if (!imageDrawn || !snapshot.worldTheme.overlayColor || !snapshot.worldTheme.overlayOpacity) {
    return;
  }

  context.save();
  context.globalAlpha = clamp(snapshot.worldTheme.overlayOpacity, 0, 0.85);
  context.fillStyle = snapshot.worldTheme.overlayColor;
  context.fillRect(topLeft.x, topLeft.y, worldWidth, worldHeight);
  context.restore();
}

function drawWorldVignette(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  topLeft: Point,
  worldWidth: number,
  worldHeight: number,
) {
  if (!snapshot.worldTheme.vignette) {
    return;
  }

  const centerX = topLeft.x + worldWidth / 2;
  const centerY = topLeft.y + worldHeight / 2;
  const radius = Math.max(worldWidth, worldHeight) * 0.55;
  const gradient = context.createRadialGradient(centerX, centerY, radius * 0.24, centerX, centerY, radius);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.72, "rgba(0,0,0,0.08)");
  gradient.addColorStop(1, "rgba(0,0,0,0.32)");

  context.save();
  context.fillStyle = gradient;
  context.fillRect(topLeft.x, topLeft.y, worldWidth, worldHeight);
  context.restore();
}

function drawWorldDecorations(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
  startX: number,
  endX: number,
  startY: number,
  endY: number,
) {
  const type = snapshot.worldTheme.decorationType;

  if (type === "classic") {
    return;
  }

  if (type === "desert") {
    drawDesertDecorations(context, snapshot, camera, startX, endX, startY, endY);
    return;
  }

  const step = type === "galaxy" || type === "festive" ? 260 : 420;

  for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
    for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
      const seed = seededRandom(x, y, 11);
      if (seed < 0.34) {
        continue;
      }

      const point = {
        x: x + 70 + seededRandom(x, y, 19) * (step - 140),
        y: y + 70 + seededRandom(x, y, 23) * (step - 140),
      };
      const screen = worldToScreen(point, camera);
      const size = (18 + seededRandom(x, y, 31) * 42) * camera.zoom;

      if (!isOnScreen(screen, size * 2, camera)) {
        continue;
      }

      if (type === "alien") {
        drawAlienDecoration(context, screen, size, snapshot.worldTheme.accentColor);
      } else if (type === "galaxy") {
        drawGalaxyDecoration(context, screen, size, snapshot.worldTheme.accentColor, seed);
      } else if (type === "festive") {
        drawFestiveDecoration(context, screen, size, snapshot.worldTheme.accentColor, seed);
      } else if (type === "monochrome") {
        drawMonochromeDecoration(context, screen, size);
      } else if (type === "blocks") {
        drawBlocksDecoration(context, screen, size, snapshot.worldTheme.accentColor, seed);
      }
    }
  }
}

function drawDesertDecorations(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
  startX: number,
  endX: number,
  startY: number,
  endY: number,
) {
  const step = 360;
  const kinds = snapshot.worldTheme.decorationKinds?.length
    ? snapshot.worldTheme.decorationKinds
    : DEFAULT_DESERT_DECORATIONS;

  for (let x = Math.floor(startX / step) * step; x <= endX; x += step) {
    for (let y = Math.floor(startY / step) * step; y <= endY; y += step) {
      const densitySeed = seededRandom(x, y, 101);
      if (densitySeed < 0.28) {
        continue;
      }

      const point = {
        x: x + 58 + seededRandom(x, y, 107) * (step - 116),
        y: y + 58 + seededRandom(x, y, 109) * (step - 116),
      };
      const screen = worldToScreen(point, camera);
      const kindSeed = seededRandom(x, y, 113);
      let kind = kinds[Math.floor(kindSeed * kinds.length)] ?? "small_dune";

      if (kind === "oasis" && seededRandom(x, y, 127) < 0.82) {
        kind = kinds.includes("small_dune") ? "small_dune" : "rock";
      }

      const worldSize = kind === "oasis"
        ? 90 + seededRandom(x, y, 131) * 62
        : 34 + seededRandom(x, y, 131) * 52;
      const size = worldSize * camera.zoom;

      if (!isOnScreen(screen, size * 2.6, camera)) {
        continue;
      }

      drawDesertDecoration(context, screen, size, kind, seededRandom(x, y, 137));
    }
  }
}

function drawDesertDecoration(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  kind: WorldDecorationKind,
  seed: number,
) {
  if (kind === "cactus") {
    drawDesertCactus(context, center, size, seed);
  } else if (kind === "rock") {
    drawDesertRock(context, center, size, seed);
  } else if (kind === "bones") {
    drawDesertBones(context, center, size, seed);
  } else if (kind === "dry_bush") {
    drawDesertDryBush(context, center, size, seed);
  } else if (kind === "oasis") {
    drawDesertOasis(context, center, size, seed);
  } else {
    drawDesertDune(context, center, size, seed);
  }
}

function drawDesertDune(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  seed: number,
) {
  context.save();
  context.translate(center.x, center.y);
  context.rotate((seed - 0.5) * 0.8);
  context.globalAlpha = 0.38;
  context.fillStyle = "#f6c982";
  context.beginPath();
  context.ellipse(0, size * 0.08, size * 1.35, size * 0.34, 0, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 0.28;
  context.strokeStyle = "#9a5d24";
  context.lineWidth = Math.max(1, size * 0.05);
  context.beginPath();
  context.arc(-size * 0.08, 0, size * 0.9, 0.12, Math.PI - 0.22);
  context.stroke();
  context.restore();
}

function drawDesertCactus(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  seed: number,
) {
  context.save();
  context.translate(center.x, center.y);
  context.rotate((seed - 0.5) * 0.25);
  context.globalAlpha = 0.82;
  context.strokeStyle = "#2f5d37";
  context.lineWidth = Math.max(4, size * 0.18);
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(0, size * 0.62);
  context.lineTo(0, -size * 0.68);
  context.moveTo(0, -size * 0.1);
  context.lineTo(-size * 0.42, -size * 0.1);
  context.lineTo(-size * 0.42, -size * 0.36);
  context.moveTo(0, size * 0.1);
  context.lineTo(size * 0.4, size * 0.1);
  context.lineTo(size * 0.4, -size * 0.16);
  context.stroke();

  context.strokeStyle = "rgba(255,255,255,0.22)";
  context.lineWidth = Math.max(1, size * 0.035);
  context.beginPath();
  context.moveTo(size * 0.08, size * 0.48);
  context.lineTo(size * 0.08, -size * 0.52);
  context.stroke();
  context.restore();
}

function drawDesertRock(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  seed: number,
) {
  const colors = ["#8b735f", "#6f6258", "#9b6b43"];

  context.save();
  context.translate(center.x, center.y);
  context.rotate(seed * Math.PI);
  context.globalAlpha = 0.72;

  for (let index = 0; index < 3; index += 1) {
    context.fillStyle = colors[(Math.floor(seed * 10) + index) % colors.length];
    context.beginPath();
    context.ellipse(
      (index - 1) * size * 0.3,
      seededRandom(center.x, center.y, index + 151) * size * 0.18,
      size * (0.28 + index * 0.08),
      size * 0.22,
      index * 0.28,
      0,
      Math.PI * 2,
    );
    context.fill();
  }

  context.restore();
}

function drawDesertBones(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  seed: number,
) {
  context.save();
  context.translate(center.x, center.y);
  context.rotate((seed - 0.5) * Math.PI);
  context.globalAlpha = 0.7;
  context.strokeStyle = "#fff1c7";
  context.fillStyle = "#fff1c7";
  context.lineWidth = Math.max(2, size * 0.07);
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-size * 0.48, 0);
  context.lineTo(size * 0.48, 0);
  context.moveTo(-size * 0.18, -size * 0.2);
  context.lineTo(size * 0.18, size * 0.2);
  context.stroke();

  [-0.52, 0.52].forEach((offset) => {
    context.beginPath();
    context.arc(size * offset, -size * 0.08, Math.max(2, size * 0.09), 0, Math.PI * 2);
    context.arc(size * offset, size * 0.08, Math.max(2, size * 0.09), 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawDesertDryBush(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  seed: number,
) {
  context.save();
  context.translate(center.x, center.y);
  context.rotate(seed * Math.PI);
  context.globalAlpha = 0.58;
  context.strokeStyle = "#7c4a22";
  context.lineWidth = Math.max(1, size * 0.045);
  context.lineCap = "round";

  for (let index = 0; index < 7; index += 1) {
    const angle = (Math.PI * 2 * index) / 7 + seed;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(Math.cos(angle) * size * 0.48, Math.sin(angle) * size * 0.32);
    context.stroke();
  }

  context.restore();
}

function drawDesertOasis(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  seed: number,
) {
  context.save();
  context.translate(center.x, center.y);
  context.rotate((seed - 0.5) * 0.45);
  context.globalAlpha = 0.72;
  context.fillStyle = "#38bdf8";
  context.beginPath();
  context.ellipse(0, 0, size * 0.74, size * 0.42, 0, 0, Math.PI * 2);
  context.fill();

  context.globalAlpha = 0.62;
  context.strokeStyle = "#4d7c0f";
  context.lineWidth = Math.max(3, size * 0.08);
  context.stroke();

  context.strokeStyle = "#8b5a2b";
  context.lineWidth = Math.max(2, size * 0.04);
  context.lineCap = "round";
  [-0.52, 0.52].forEach((side) => {
    context.beginPath();
    context.moveTo(size * side, -size * 0.18);
    context.lineTo(size * side * 1.15, -size * 0.58);
    context.stroke();

    context.fillStyle = "#3f7d2d";
    context.beginPath();
    context.ellipse(size * side * 1.18, -size * 0.62, size * 0.22, size * 0.08, side * 0.8, 0, Math.PI * 2);
    context.ellipse(size * side * 1.02, -size * 0.58, size * 0.2, size * 0.08, -side * 0.6, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

function drawAlienDecoration(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  accentColor: string,
) {
  context.save();
  context.globalAlpha = 0.5;
  context.fillStyle = "#0f1d12";
  context.strokeStyle = accentColor;
  context.lineWidth = Math.max(1, size * 0.08);
  context.beginPath();
  context.ellipse(center.x, center.y, size * 1.2, size * 0.72, 0.22, 0, Math.PI * 2);
  context.fill();
  context.stroke();

  context.globalAlpha = 0.7;
  context.beginPath();
  context.moveTo(center.x - size * 0.45, center.y);
  context.lineTo(center.x, center.y - size * 0.42);
  context.lineTo(center.x + size * 0.45, center.y);
  context.lineTo(center.x, center.y + size * 0.42);
  context.closePath();
  context.stroke();
  context.restore();
}

function drawGalaxyDecoration(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  accentColor: string,
  seed: number,
) {
  context.save();
  context.globalAlpha = 0.8;

  if (seed > 0.78) {
    context.fillStyle = "#8b5cf6";
    context.beginPath();
    context.arc(center.x, center.y, size * 0.65, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = accentColor;
    context.lineWidth = Math.max(1, size * 0.08);
    context.beginPath();
    context.ellipse(center.x, center.y, size, size * 0.28, -0.35, 0, Math.PI * 2);
    context.stroke();
  } else {
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.arc(center.x, center.y, Math.max(1.4, size * 0.1), 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = accentColor;
    context.lineWidth = Math.max(1, size * 0.05);
    context.beginPath();
    context.moveTo(center.x - size * 0.32, center.y);
    context.lineTo(center.x + size * 0.32, center.y);
    context.moveTo(center.x, center.y - size * 0.32);
    context.lineTo(center.x, center.y + size * 0.32);
    context.stroke();
  }

  context.restore();
}

function drawFestiveDecoration(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  accentColor: string,
  seed: number,
) {
  const colors = ["#ef4444", "#22c55e", "#facc15", accentColor, "#ffffff"];
  context.save();
  context.globalAlpha = 0.7;
  context.fillStyle = colors[Math.floor(seed * colors.length) % colors.length];
  context.translate(center.x, center.y);
  context.rotate(seed * Math.PI);
  context.fillRect(-size * 0.18, -size * 0.18, size * 0.72, size * 0.22);
  context.restore();
}

function drawMonochromeDecoration(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
) {
  context.save();
  context.globalAlpha = 0.38;
  context.strokeStyle = "#111111";
  context.lineWidth = Math.max(1, size * 0.07);
  context.beginPath();
  context.arc(center.x, center.y, size * 0.82, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#111111";
  context.fillRect(center.x - size * 0.32, center.y - size * 0.32, size * 0.64, size * 0.64);
  context.restore();
}

function drawBlocksDecoration(
  context: CanvasRenderingContext2D,
  center: Point,
  size: number,
  accentColor: string,
  seed: number,
) {
  const colors = [accentColor, "#14b8a6", "#eab308", "#f43f5e"];
  context.save();
  context.globalAlpha = 0.46;
  context.fillStyle = colors[Math.floor(seed * colors.length) % colors.length];
  context.fillRect(center.x - size * 0.5, center.y - size * 0.5, size, size);
  context.strokeStyle = "rgba(255,255,255,0.45)";
  context.lineWidth = Math.max(1, size * 0.07);
  context.strokeRect(center.x - size * 0.5, center.y - size * 0.5, size, size);
  context.restore();
}

function drawFood(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  snapshot.food.forEach((food) => {
    const center = worldToScreen(food, camera);
    const radius = food.radius * camera.zoom;

    if (!isOnScreen(center, radius, camera)) {
      return;
    }

    const foodColor = getFoodColor(snapshot, food);

    context.shadowColor = foodColor;
    context.shadowBlur = (food.kind === "death" ? 18 : 10) * camera.zoom;
    context.fillStyle = foodColor;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.fill();

    if (food.kind === "death") {
      context.fillStyle = "rgba(255,255,255,0.62)";
      context.beginPath();
      context.arc(center.x - radius * 0.25, center.y - radius * 0.25, radius * 0.32, 0, Math.PI * 2);
      context.fill();
    }

    context.shadowBlur = 0;
  });
}

function drawPortals(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const spin = Date.now() / 560;

  snapshot.portals.forEach((portal) => {
    const center = worldToScreen(portal, camera);
    const radius = portal.radius * camera.zoom;

    if (!isOnScreen(center, radius * 1.8, camera)) {
      return;
    }

    const gradient = context.createRadialGradient(
      center.x,
      center.y,
      radius * 0.12,
      center.x,
      center.y,
      radius,
    );
    gradient.addColorStop(0, "#020617");
    gradient.addColorStop(0.58, "#05040a");
    gradient.addColorStop(1, portal.color);

    context.save();
    context.shadowColor = portal.color;
    context.shadowBlur = 22 * camera.zoom;
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, Math.PI * 2);
    context.fill();

    context.lineWidth = Math.max(2, 4 * camera.zoom);
    context.strokeStyle = portal.color;
    context.stroke();

    context.translate(center.x, center.y);
    context.rotate(spin + portal.id);
    context.strokeStyle = "rgba(255,255,255,0.5)";
    context.lineWidth = Math.max(1, 2 * camera.zoom);

    for (let index = 0; index < 3; index += 1) {
      context.beginPath();
      context.arc(0, 0, radius * (0.38 + index * 0.16), index * 1.35, index * 1.35 + Math.PI * 1.15);
      context.stroke();
    }

    context.restore();
  });
}

function drawBots(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  snapshot.bots.forEach((bot) => {
    drawWorm(
      context,
      snapshot,
      camera,
      bot.snake,
      getBotSkin(bot),
      bot.angle,
      bot.name,
      bot,
    );
  });
}

function drawSnake(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  drawWorm(context, snapshot, camera, snapshot.snake, snapshot.skin, snapshot.angle);

  if (snapshot.playerInvulnerableTimer > 0) {
    const head = worldToScreen(snapshot.snake[0], camera);
    context.save();
    context.strokeStyle = "rgba(34,211,238,0.72)";
    context.lineWidth = Math.max(2, 4 * camera.zoom);
    context.shadowColor = "#22d3ee";
    context.shadowBlur = 18 * camera.zoom;
    context.beginPath();
    context.arc(head.x, head.y, snapshot.headRadius * 1.7 * camera.zoom, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  }
}

function drawWorm(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
  snake: Point[],
  skin: SnakeSkin,
  angle: number,
  name?: string,
  bot?: BotSnake,
) {
  const [head, ...body] = snake;

  [...body].reverse().forEach((segment, index) => {
    const pulse = 1 - Math.min(index * 0.006, 0.16);
    drawSegment(context, snapshot, camera, segment, skin, snapshot.segmentRadius * pulse, index);
  });

  const imageDrawn = drawSegment(context, snapshot, camera, head, skin, snapshot.headRadius, 0, true, angle, bot);

  if (!imageDrawn) {
    drawEyes(context, snapshot, camera, head, angle);
  }

  if (name) {
    drawBotName(context, camera, head, name, snapshot.headRadius);
  }
}

function drawSegment(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
  segment: Point,
  skin: SnakeSkin,
  radius: number,
  index: number,
  isHead = false,
  angle = 0,
  bot?: BotSnake,
) {
  const center = worldToScreen(segment, camera);
  const scaledRadius = radius * camera.zoom;

  if (!isOnScreen(center, scaledRadius, camera)) {
    return false;
  }

  if (isHead && bot?.headType === "image" && bot.headImage) {
    const image = getCachedBotHeadImage(bot.headImage);

    if (image && image.complete && image.naturalWidth > 0) {
      drawImageHead(context, image, center, scaledRadius, angle);
      return true;
    }
  }

  const color = isHead ? skin.headColor : skin.bodyColor;
  const secondaryColor = skin.secondaryColor;
  const fill = secondaryColor
    ? createSegmentGradient(context, center, scaledRadius, color, secondaryColor, index)
    : color;

  context.fillStyle = fill;
  context.beginPath();
  context.arc(center.x, center.y, scaledRadius, 0, Math.PI * 2);
  context.fill();

  if (isHead) {
    context.strokeStyle = "rgba(255,255,255,0.22)";
    context.lineWidth = Math.max(1, scaledRadius * 0.08);
    context.stroke();
  }

  return false;
}

function createSegmentGradient(
  context: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  color: string,
  secondaryColor: string,
  index: number,
) {
  const gradient = context.createLinearGradient(
    center.x - radius,
    center.y - radius,
    center.x + radius,
    center.y + radius,
  );
  const swap = index % 2 === 0;
  gradient.addColorStop(0, swap ? color : secondaryColor);
  gradient.addColorStop(1, swap ? secondaryColor : color);
  return gradient;
}

function getBotSkin(bot: BotSnake): SnakeSkin {
  const skin = getSkinById(bot.skinId);

  return {
    ...skin,
    bodyColor: bot.bodyColor ?? skin.bodyColor,
    secondaryColor: bot.secondaryColor ?? skin.secondaryColor,
  };
}

function getCachedBotHeadImage(src: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const cachedImage = botHeadImageCache.get(src);

  if (cachedImage) {
    return cachedImage.failed ? null : cachedImage.image;
  }

  const image = new Image();
  botHeadImageCache.set(src, { image, failed: false });
  image.onload = () => {
    botHeadImageCache.set(src, { image, failed: false });
  };
  image.onerror = () => {
    botHeadImageCache.set(src, { image, failed: true });
  };
  image.src = src;

  return image;
}

function getCachedWorldImage(src: string | undefined) {
  if (!src || typeof window === "undefined") {
    return null;
  }

  const cachedImage = worldBackgroundImageCache.get(src);

  if (cachedImage) {
    return cachedImage.failed ? null : cachedImage.image;
  }

  const image = new Image();
  worldBackgroundImageCache.set(src, { image, failed: false });
  image.onload = () => {
    worldBackgroundImageCache.set(src, { image, failed: false });
  };
  image.onerror = () => {
    worldBackgroundImageCache.set(src, { image, failed: true });
  };
  image.src = src;

  return image;
}

function drawImageHead(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  center: Point,
  radius: number,
  angle: number,
) {
  const imageRadius = radius * BOT_IMAGE_HEAD_SCALE;
  const size = imageRadius * 2;

  context.save();
  context.translate(center.x, center.y);
  context.rotate(angle);
  context.beginPath();
  context.arc(0, 0, imageRadius, 0, Math.PI * 2);
  context.clip();
  context.drawImage(image, -size / 2, -size / 2, size, size);
  context.restore();

  context.save();
  context.strokeStyle = "rgba(255,255,255,0.26)";
  context.lineWidth = Math.max(1, imageRadius * 0.08);
  context.beginPath();
  context.arc(center.x, center.y, imageRadius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawEyes(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
  head: Point,
  angle: number,
) {
  const center = worldToScreen(head, camera);
  const forward = { x: Math.cos(angle), y: Math.sin(angle) };
  const side = { x: -forward.y, y: forward.x };
  const eyeForward = snapshot.headRadius * 0.34 * camera.zoom;
  const eyeSide = snapshot.headRadius * 0.35 * camera.zoom;
  const eyeRadius = Math.max(2.4, snapshot.headRadius * 0.15 * camera.zoom);
  const pupilRadius = Math.max(1.1, eyeRadius * 0.42);
  const eyes = [
    {
      x: center.x + forward.x * eyeForward + side.x * eyeSide,
      y: center.y + forward.y * eyeForward + side.y * eyeSide,
    },
    {
      x: center.x + forward.x * eyeForward - side.x * eyeSide,
      y: center.y + forward.y * eyeForward - side.y * eyeSide,
    },
  ];

  context.fillStyle = "#ffffff";
  eyes.forEach((eye) => {
    context.beginPath();
    context.arc(eye.x, eye.y, eyeRadius, 0, Math.PI * 2);
    context.fill();
  });

  context.fillStyle = "#07100d";
  eyes.forEach((eye) => {
    context.beginPath();
    context.arc(
      eye.x + forward.x * eyeRadius * 0.35,
      eye.y + forward.y * eyeRadius * 0.35,
      pupilRadius,
      0,
      Math.PI * 2,
    );
    context.fill();
  });
}

function drawBotName(
  context: CanvasRenderingContext2D,
  camera: Camera,
  head: Point,
  name: string,
  headRadius: number,
) {
  const center = worldToScreen(head, camera);
  const y = center.y - (headRadius + 18) * camera.zoom;

  if (!isOnScreen({ x: center.x, y }, 48, camera)) {
    return;
  }

  context.save();
  context.font = `700 ${Math.max(11, 14 * camera.zoom)}px Arial, sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineWidth = 3;
  context.strokeStyle = "rgba(0,0,0,0.65)";
  context.fillStyle = "rgba(255,255,255,0.92)";
  context.strokeText(name, center.x, y);
  context.fillText(name, center.x, y);
  context.restore();
}

function drawWorldBorder(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const topLeft = worldToScreen({ x: 0, y: 0 }, camera);
  const worldWidth = snapshot.worldWidth * camera.zoom;
  const worldHeight = snapshot.worldHeight * camera.zoom;
  const dangerWidth = Math.max(10, 16 * camera.zoom);
  const innerWidth = Math.max(2, 4 * camera.zoom);

  context.save();
  context.shadowColor = snapshot.worldTheme.borderColor;
  context.shadowBlur = 18 * camera.zoom;
  context.strokeStyle = snapshot.worldTheme.borderColor;
  context.lineWidth = dangerWidth;
  context.strokeRect(
    topLeft.x + dangerWidth / 2,
    topLeft.y + dangerWidth / 2,
    worldWidth - dangerWidth,
    worldHeight - dangerWidth,
  );

  context.shadowBlur = 0;
  context.strokeStyle = snapshot.turboActive ? snapshot.worldTheme.accentColor : snapshot.worldTheme.borderColor;
  context.lineWidth = innerWidth;
  context.strokeRect(
    topLeft.x + dangerWidth,
    topLeft.y + dangerWidth,
    worldWidth - dangerWidth * 2,
    worldHeight - dangerWidth * 2,
  );
  context.restore();
}

function drawPortalMessage(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  width: number,
) {
  if (snapshot.portalMessageTimer <= 0) {
    return;
  }

  context.save();
  context.globalAlpha = Math.min(1, snapshot.portalMessageTimer);
  context.font = "700 14px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "top";
  context.fillStyle = "rgba(226,232,240,0.92)";
  context.strokeStyle = "rgba(2,6,23,0.85)";
  context.lineWidth = 4;
  context.strokeText("Portal usado", width / 2, 16);
  context.fillText("Portal usado", width / 2, 16);
  context.restore();
}

function worldToScreen(point: Point, camera: Camera) {
  return {
    x: (point.x - camera.x) * camera.zoom + camera.width / 2,
    y: (point.y - camera.y) * camera.zoom + camera.height / 2,
  };
}

function isOnScreen(point: Point, radius: number, camera: Camera) {
  return (
    point.x + radius >= 0 &&
    point.y + radius >= 0 &&
    point.x - radius <= camera.width &&
    point.y - radius <= camera.height
  );
}

function getFoodColor(snapshot: SnakeRenderSnapshot, food: { id: number; color: string; kind: string }) {
  if (food.kind === "death") {
    return food.color;
  }

  const colors = snapshot.worldTheme.foodColors.length
    ? snapshot.worldTheme.foodColors
    : [snapshot.skin.foodColor ?? "#f3a469"];

  return colors[Math.abs(food.id) % colors.length] ?? snapshot.skin.foodColor ?? "#f3a469";
}

function seededRandom(x: number, y: number, salt: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function clamp(value: number, min: number, max: number) {
  if (min > max) {
    return value;
  }

  return Math.max(min, Math.min(max, value));
}
