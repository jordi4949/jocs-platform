"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chess, type Color, type Move, type Square } from "chess.js";
import { DEFAULT_BOARD_THEME } from "@/games/chess3d/data/boardThemes";
import { DEFAULT_PIECE_THEME } from "@/games/chess3d/data/pieceThemes";
import { getGameStatus, getPiecesFromGame } from "@/games/chess3d/engine/board";
import { getBotMoveWithStockfish } from "@/games/chess3d/bot/chessBot";
import type { BotDifficulty, BotMoveResult } from "@/games/chess3d/bot/botTypes";
import { ChessScene } from "@/games/chess3d/components/ChessScene";

type ChessMode = "menu" | "local" | "bot_setup" | "bot";

const difficultyLabels: Record<BotDifficulty, string> = {
  easy: "Fácil",
  intermediate: "Intermedio",
  hard: "Difícil",
  very_hard: "Muy difícil",
  extra_hard: "Extra difícil",
};

const difficultyDescriptions: Record<BotDifficulty, string> = {
  easy: "Movimientos legales casi aleatorios y errores frecuentes.",
  intermediate: "Busca capturas y jaques simples, pero todavía se despista.",
  hard: "Evalúa material, desarrollo y centro con una mirada táctica corta.",
  very_hard: "Stockfish con fuerza moderada y fallback local si no carga.",
  extra_hard: "Stockfish con más tiempo de cálculo y fallback local si no carga.",
};

export function ChessGame() {
  const [mode, setMode] = useState<ChessMode>("menu");
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [playerColor, setPlayerColor] = useState<Color>("w");
  const [difficulty, setDifficulty] = useState<BotDifficulty>("easy");
  const [botThinking, setBotThinking] = useState(false);
  const [lastBotMove, setLastBotMove] = useState<BotMoveResult | null>(null);

  const isBotMode = mode === "bot";
  const isPlayerTurn = !isBotMode || game.turn() === playerColor;
  const canInteract = (mode === "local" || (isBotMode && isPlayerTurn)) && !botThinking && !game.isGameOver();
  const allowedColor = isBotMode ? playerColor : game.turn();
  const pieces = useMemo(() => getPiecesFromGame(game), [game]);
  const legalMoves = useMemo<Move[]>(() => {
    if (!selectedSquare || !canInteract) {
      return [];
    }

    return game.moves({ square: selectedSquare, verbose: true });
  }, [canInteract, game, selectedSquare]);
  const history = useMemo(() => game.history({ verbose: true }), [game]);
  const status = getGameStatus(game);
  const turnLabel = game.turn() === "w" ? "Blancas" : "Negras";
  const stockfishRequested = difficulty === "very_hard" || difficulty === "extra_hard";
  const engineLabel = !isBotMode
    ? "Sin bot"
    : lastBotMove?.engine === "stockfish"
      ? "Stockfish"
      : stockfishRequested
        ? lastBotMove?.fallbackReason
          ? "Bot local (fallback)"
          : "Stockfish"
        : "Bot local";

  useEffect(() => {
    if (!isBotMode || game.isGameOver() || game.turn() === playerColor || botThinking) {
      return;
    }

    setBotThinking(true);
    setSelectedSquare(null);

    const delay = 500 + Math.floor(Math.random() * 401);
    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      void getBotMoveWithStockfish(new Chess(game.fen()), difficulty)
        .then((result) => {
          if (cancelled) {
            return;
          }

          setGame((currentGame) => {
            if (currentGame.isGameOver() || currentGame.turn() === playerColor || !result.move) {
              return currentGame;
            }

            const nextGame = new Chess(currentGame.fen());
            nextGame.move({ from: result.move.from, to: result.move.to, promotion: result.move.promotion ?? "q" });
            return nextGame;
          });

          setLastBotMove(result);
          setBotThinking(false);
        })
        .catch(() => {
          if (!cancelled) {
            setBotThinking(false);
          }
        });
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [difficulty, game, isBotMode, playerColor]);

  const selectOrMove = (square: Square) => {
    if (!canInteract) {
      return;
    }

    const clickedPiece = game.get(square);

    if (!selectedSquare) {
      if (clickedPiece?.color === allowedColor) {
        setSelectedSquare(square);
      }
      return;
    }

    const nextGame = new Chess(game.fen());

    try {
      const move = nextGame.move({ from: selectedSquare, to: square, promotion: "q" });

      if (move) {
        setGame(nextGame);
        setSelectedSquare(null);
        setLastBotMove(null);
        return;
      }
    } catch {
      // chess.js sigue siendo la fuente de verdad para movimientos legales.
    }

    if (clickedPiece?.color === allowedColor) {
      setSelectedSquare(square);
      return;
    }

    setSelectedSquare(null);
  };

  const startLocalGame = () => {
    setMode("local");
    resetBoard();
  };

  const startBotGame = () => {
    setMode("bot");
    resetBoard();
  };

  const resetBoard = () => {
    setGame(new Chess());
    setSelectedSquare(null);
    setBotThinking(false);
    setLastBotMove(null);
  };

  const changeMode = () => {
    setMode("menu");
    resetBoard();
  };

  if (mode === "menu") {
    return (
      <section className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ModeCard
            description="Dos personas juegan en el mismo dispositivo con el tablero 3D actual."
            label="Modo clásico"
            onClick={startLocalGame}
            title="Jugar local 2 jugadores"
          />
          <ModeCard
            description="Elige color y dificultad para jugar una partida legal contra el bot."
            label="Nuevo"
            onClick={() => setMode("bot_setup")}
            title="Jugar contra bot"
          />
          <Link
            className="rounded-lg border border-moss/15 bg-white/85 p-5 shadow-soft transition hover:border-moss hover:bg-white"
            href="/game/chess/academy"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Aprender</p>
            <h3 className="mt-2 text-2xl font-black text-ink">Academia de Ajedrez</h3>
            <p className="mt-3 text-sm leading-6 text-ink/70">Conceptos, tácticas, mates y finales con posiciones guiadas.</p>
          </Link>
          <div className="rounded-lg border border-moss/15 bg-white/60 p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Futuro</p>
            <h3 className="mt-2 text-2xl font-black text-ink/50">Online próximamente</h3>
            <p className="mt-3 text-sm leading-6 text-ink/45">Reservado para una fase futura, sin Socket.IO todavía.</p>
          </div>
        </div>
      </section>
    );
  }

  if (mode === "bot_setup") {
    return (
      <section className="grid gap-4 rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <div>
          <button className="text-sm font-black text-moss transition hover:text-ink" onClick={() => setMode("menu")} type="button">
            Volver a modos
          </button>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Contra bot</p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Configura la partida</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SetupPanel title="Elegir color">
            <SegmentedButton active={playerColor === "w"} label="Blancas" onClick={() => setPlayerColor("w")} />
            <SegmentedButton active={playerColor === "b"} label="Negras" onClick={() => setPlayerColor("b")} />
          </SetupPanel>

          <SetupPanel title="Elegir dificultad">
            {(Object.keys(difficultyLabels) as BotDifficulty[]).map((level) => (
              <button
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  difficulty === level ? "border-moss bg-leaf/25" : "border-moss/15 bg-white hover:border-moss"
                }`}
                key={level}
                onClick={() => setDifficulty(level)}
                type="button"
              >
                <span className="block text-base font-black text-ink">{difficultyLabels[level]}</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-ink/60">{difficultyDescriptions[level]}</span>
              </button>
            ))}
          </SetupPanel>
        </div>

        <button
          className="h-12 rounded-lg bg-ink px-4 text-sm font-black text-white transition hover:bg-moss"
          onClick={startBotGame}
          type="button"
        >
          Empezar partida
        </button>
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <ChessScene
        boardTheme={DEFAULT_BOARD_THEME}
        legalMoves={legalMoves}
        onSquareClick={selectOrMove}
        pieceTheme={DEFAULT_PIECE_THEME}
        pieces={pieces}
        selectedSquare={selectedSquare}
      />

      <aside className="grid content-start gap-3">
        <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">HUD</p>
          <div className="mt-3 grid gap-2 text-sm font-bold text-ink/70">
            <HudRow label="Modo" value={mode === "local" ? "Local 2 jugadores" : "Contra bot"} />
            {isBotMode ? (
              <>
                <HudRow label="Dificultad" value={difficultyLabels[difficulty]} />
                <HudRow label="Motor" value={engineLabel} />
                <HudRow label="Tu color" value={playerColor === "w" ? "Blancas" : "Negras"} />
              </>
            ) : null}
            <HudRow label="Turno" value={turnLabel} />
            <HudRow label="Estado" value={status} />
            <HudRow label="Jaque" value={game.isCheck() ? "Sí" : "No"} />
          </div>
          {botThinking ? (
            <p className="mt-3 rounded-lg bg-peach/25 px-3 py-2 text-sm font-black text-ink">
              {stockfishRequested ? "Stockfish está pensando..." : "El bot está pensando..."}
            </p>
          ) : null}
          {selectedSquare ? (
            <p className="mt-3 rounded-lg bg-mist px-3 py-2 text-sm font-black text-ink">
              Seleccionada: {selectedSquare.toUpperCase()}
            </p>
          ) : null}
          {lastBotMove?.move ? (
            <p className="mt-3 rounded-lg bg-mist px-3 py-2 text-sm font-bold leading-6 text-ink/70">
              Bot: <span className="font-black text-ink">{lastBotMove.move.san}</span>
              <br />
              {lastBotMove.reason}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="h-11 rounded-lg bg-ink px-4 text-sm font-black text-white transition hover:bg-moss"
            onClick={resetBoard}
            type="button"
          >
            Reiniciar
          </button>
          <button
            className="h-11 rounded-lg border border-moss/20 bg-white px-4 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
            onClick={changeMode}
            type="button"
          >
            Cambiar modo
          </button>
        </div>

        <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Historial</p>
          <ol className="mt-3 max-h-72 space-y-2 overflow-auto pr-1 text-sm font-bold text-ink/70">
            {history.length ? (
              history.map((move, index) => (
                <li className="flex items-center justify-between gap-3 rounded-lg bg-mist px-3 py-2" key={`${move.san}-${index}`}>
                  <span>{Math.floor(index / 2) + 1}{index % 2 === 0 ? "." : "..."}</span>
                  <span className="font-black text-ink">{move.san}</span>
                </li>
              ))
            ) : (
              <li className="rounded-lg bg-mist px-3 py-2">Sin movimientos</li>
            )}
          </ol>
        </div>
      </aside>
    </section>
  );
}

function ModeCard({
  description,
  label,
  onClick,
  title,
}: {
  description: string;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className="rounded-lg border border-moss/15 bg-white/85 p-5 text-left shadow-soft transition hover:border-moss hover:bg-white"
      onClick={onClick}
      type="button"
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">{label}</p>
      <h3 className="mt-2 text-2xl font-black text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink/70">{description}</p>
    </button>
  );
}

function SetupPanel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-moss/15 bg-mist p-4">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-3 grid gap-2">{children}</div>
    </section>
  );
}

function SegmentedButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`h-12 rounded-lg border px-4 text-sm font-black transition ${
        active ? "border-moss bg-leaf/25 text-ink" : "border-moss/15 bg-white text-ink/70 hover:border-moss"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function HudRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-mist px-3 py-2">
      <span>{label}</span>
      <span className="text-right font-black text-ink">{value}</span>
    </div>
  );
}
