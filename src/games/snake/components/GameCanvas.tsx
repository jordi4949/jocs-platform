"use client";

import { useEffect, useRef } from "react";
import { getSkinById } from "@/data/skins";
import type { SnakeSkin } from "@/data/skins";
import type { Point, SnakeRenderSnapshot } from "@/games/snake/types";

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
  drawBackdrop(context, width, height);
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

function drawBackdrop(context: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = context.createRadialGradient(
    width * 0.5,
    height * 0.4,
    20,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.75,
  );
  gradient.addColorStop(0, "#15281f");
  gradient.addColorStop(0.52, "#0b1714");
  gradient.addColorStop(1, "#050b0a");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
}

function drawWorld(
  context: CanvasRenderingContext2D,
  snapshot: SnakeRenderSnapshot,
  camera: Camera,
) {
  const topLeft = worldToScreen({ x: 0, y: 0 }, camera);
  const worldWidth = snapshot.worldWidth * camera.zoom;
  const worldHeight = snapshot.worldHeight * camera.zoom;

  context.fillStyle = "#0b1713";
  context.fillRect(topLeft.x, topLeft.y, worldWidth, worldHeight);

  context.save();
  context.beginPath();
  context.rect(topLeft.x, topLeft.y, worldWidth, worldHeight);
  context.clip();
  context.fillStyle = "rgba(255,255,255,0.18)";

  const step = 96;
  const dotRadius = Math.max(1, 1.8 * camera.zoom);
  const startX = Math.floor((camera.x - camera.width / camera.zoom / 2) / step) * step;
  const endX = camera.x + camera.width / camera.zoom / 2 + step;
  const startY = Math.floor((camera.y - camera.height / camera.zoom / 2) / step) * step;
  const endY = camera.y + camera.height / camera.zoom / 2 + step;

  for (let x = startX; x <= endX; x += step) {
    for (let y = startY; y <= endY; y += step) {
      const screen = worldToScreen({ x, y }, camera);
      context.beginPath();
      context.arc(screen.x, screen.y, dotRadius, 0, Math.PI * 2);
      context.fill();
    }
  }

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

    context.shadowColor = food.color;
    context.shadowBlur = (food.kind === "death" ? 18 : 10) * camera.zoom;
    context.fillStyle = food.color || snapshot.skin.foodColor || "#f3a469";
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
    drawWorm(context, snapshot, camera, bot.snake, getSkinById(bot.skinId), bot.angle, bot.name);
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
) {
  const [head, ...body] = snake;

  [...body].reverse().forEach((segment, index) => {
    const pulse = 1 - Math.min(index * 0.006, 0.16);
    drawSegment(context, snapshot, camera, segment, skin, snapshot.segmentRadius * pulse, index);
  });

  drawSegment(context, snapshot, camera, head, skin, snapshot.headRadius, 0, true);
  drawEyes(context, snapshot, camera, head, angle);

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
) {
  const center = worldToScreen(segment, camera);
  const scaledRadius = radius * camera.zoom;

  if (!isOnScreen(center, scaledRadius, camera)) {
    return;
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
  context.shadowColor = "#7f1d1d";
  context.shadowBlur = 18 * camera.zoom;
  context.strokeStyle = "#7f1d1d";
  context.lineWidth = dangerWidth;
  context.strokeRect(
    topLeft.x + dangerWidth / 2,
    topLeft.y + dangerWidth / 2,
    worldWidth - dangerWidth,
    worldHeight - dangerWidth,
  );

  context.shadowBlur = 0;
  context.strokeStyle = snapshot.turboActive ? "#f97316" : "#dc2626";
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

function clamp(value: number, min: number, max: number) {
  if (min > max) {
    return value;
  }

  return Math.max(min, Math.min(max, value));
}
