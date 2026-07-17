"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Chess, type Move, type Square } from "chess.js";
import { addCoins } from "@/lib/storage";
import { DEFAULT_BOARD_THEME } from "@/games/chess3d/data/boardThemes";
import { DEFAULT_PIECE_THEME } from "@/games/chess3d/data/pieceThemes";
import type { ChessAcademyLesson, ChessAcademyDifficulty } from "@/games/chess3d/data/academyLessons";
import {
  completeAcademyLesson,
  createEmptyAcademyProgress,
  readAcademyProgress,
  type ChessAcademyProgress,
} from "@/games/chess3d/data/academyProgress";
import { getPiecesFromGame } from "@/games/chess3d/engine/board";
import { ChessScene } from "@/games/chess3d/components/ChessScene";

const difficultyLabels: Record<ChessAcademyDifficulty, string> = {
  beginner: "Inicial",
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
};

type FeedbackKind = "idle" | "success" | "error" | "complete";

type Feedback = {
  kind: FeedbackKind;
  message: string;
};

export function ChessAcademyLesson({ lesson }: { lesson: ChessAcademyLesson }) {
  const [game, setGame] = useState(() => createLessonGame(lesson.initialFen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    kind: "idle",
    message: lesson.solutionMoves.length
      ? "Intenta encontrar la jugada correcta en el tablero."
      : "Lee la explicación y marca la lección como completada cuando estés listo.",
  });
  const [progress, setProgress] = useState<ChessAcademyProgress>(() => createEmptyAcademyProgress());

  const isCompleted = progress.completedLessonIds.includes(lesson.id);
  const hasExercise = lesson.solutionMoves.length > 0;
  const exerciseSolved = !hasExercise || moveIndex >= lesson.solutionMoves.length;
  const pieces = useMemo(() => getPiecesFromGame(game), [game]);
  const legalMoves = useMemo<Move[]>(() => {
    if (!selectedSquare || game.isGameOver() || !hasExercise || exerciseSolved) {
      return [];
    }

    return game.moves({ square: selectedSquare, verbose: true });
  }, [exerciseSolved, game, hasExercise, selectedSquare]);

  useEffect(() => {
    setProgress(readAcademyProgress());
  }, []);

  const selectOrMove = (square: Square) => {
    if (!hasExercise || exerciseSolved || game.isGameOver()) {
      return;
    }

    const clickedPiece = game.get(square);

    if (!selectedSquare) {
      if (clickedPiece?.color === game.turn()) {
        setSelectedSquare(square);
      }
      return;
    }

    const nextGame = new Chess(game.fen());

    try {
      const move = nextGame.move({ from: selectedSquare, to: square, promotion: "q" });

      if (move) {
        handleMoveAttempt(move, nextGame);
        return;
      }
    } catch {
      setFeedback({
        kind: "error",
        message: `No es la mejor jugada. ${lesson.hints[hintIndex] ?? "Revisa qué pieza cumple el objetivo."}`,
      });
    }

    if (clickedPiece?.color === game.turn()) {
      setSelectedSquare(square);
      return;
    }

    setSelectedSquare(null);
  };

  const handleMoveAttempt = (move: Move, nextGame: Chess) => {
    const expectedMove = lesson.solutionMoves[moveIndex];

    if (isExpectedMove(move, expectedMove)) {
      const nextMoveIndex = moveIndex + 1;
      setGame(nextGame);
      setMoveIndex(nextMoveIndex);
      setSelectedSquare(null);
      setFeedback({
        kind: "success",
        message:
          nextMoveIndex >= lesson.solutionMoves.length
            ? `Correcto. ${lesson.solutionExplanation}`
            : `Correcto. Sigue con la siguiente jugada de la solución.`,
      });
      return;
    }

    setSelectedSquare(null);
    setFeedback({
      kind: "error",
      message: `No es la mejor jugada. ${lesson.hints[hintIndex] ?? "Busca una jugada más directa para el objetivo."}`,
    });
  };

  const showNextHint = () => {
    setHintIndex((currentHintIndex) => {
      const nextHintIndex = Math.min(currentHintIndex + 1, Math.max(lesson.hints.length - 1, 0));
      setFeedback({
        kind: "idle",
        message: lesson.hints[currentHintIndex] ?? "Mira el objetivo y busca la pieza más activa.",
      });
      return nextHintIndex;
    });
  };

  const resetLesson = () => {
    setGame(createLessonGame(lesson.initialFen));
    setSelectedSquare(null);
    setMoveIndex(0);
    setHintIndex(0);
    setShowSolution(false);
    setFeedback({
      kind: "idle",
      message: hasExercise
        ? "Intenta encontrar la jugada correcta en el tablero."
        : "Lee la explicación y marca la lección como completada cuando estés listo.",
    });
  };

  const completeLesson = () => {
    const result = completeAcademyLesson(lesson.id, lesson.rewardCoins, lesson.rewardXp);
    setProgress(result.progress);

    if (result.rewarded) {
      addCoins(lesson.rewardCoins);
      setFeedback({
        kind: "complete",
        message: `Lección completada. Has ganado ${lesson.rewardCoins} monedas y ${lesson.rewardXp} XP.`,
      });
      return;
    }

    setFeedback({
      kind: "complete",
      message: "Lección ya completada. La recompensa solo se entrega la primera vez.",
    });
  };

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link className="text-sm font-black text-moss transition hover:text-ink" href="/game/chess/academy">
              Volver a la academia
            </Link>
            <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">{lesson.category}</p>
            <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{lesson.title}</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{lesson.shortExplanation}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-moss/15 bg-mist p-3 text-center sm:min-w-80">
            <Badge label="Nivel" value={difficultyLabels[lesson.difficulty]} />
            <Badge label="XP" value={`+${lesson.rewardXp}`} />
            <Badge label="Monedas" value={`+${lesson.rewardCoins}`} />
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ChessScene
          boardTheme={DEFAULT_BOARD_THEME}
          legalMoves={legalMoves}
          onSquareClick={selectOrMove}
          pieceTheme={DEFAULT_PIECE_THEME}
          pieces={pieces}
          selectedSquare={selectedSquare}
        />

        <aside className="grid content-start gap-3">
          <Panel title="Concepto">
            <p className="text-sm leading-6 text-ink/70">{lesson.detailedExplanation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.tags.map((tag) => (
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-black text-moss" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Panel>

          <Panel title="Objetivo">
            <p className="text-base font-black leading-7 text-ink">{lesson.objective}</p>
            <div className={`mt-3 rounded-lg px-3 py-2 text-sm font-bold ${feedbackClassName(feedback.kind)}`}>
              {feedback.message}
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="h-11 rounded-lg border border-moss/20 bg-white px-3 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
              onClick={showNextHint}
              type="button"
            >
              Pista
            </button>
            <button
              className="h-11 rounded-lg border border-moss/20 bg-white px-3 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
              onClick={() => setShowSolution((current) => !current)}
              type="button"
            >
              Mostrar solución
            </button>
            <button
              className="h-11 rounded-lg border border-moss/20 bg-white px-3 text-sm font-black text-ink transition hover:border-moss hover:text-moss"
              onClick={resetLesson}
              type="button"
            >
              Reintentar
            </button>
            <button
              className="h-11 rounded-lg bg-ink px-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-ink/35 enabled:hover:bg-moss"
              disabled={!exerciseSolved || isCompleted}
              onClick={completeLesson}
              type="button"
            >
              {isCompleted ? "Completada" : "Completar lección"}
            </button>
          </div>

          {showSolution ? (
            <Panel title="Solución">
              <p className="text-lg font-black text-ink">{lesson.solutionMoves.length ? lesson.solutionMoves.join(" ") : "Lección explicativa"}</p>
              <p className="mt-2 text-sm leading-6 text-ink/70">{lesson.solutionExplanation}</p>
            </Panel>
          ) : null}
        </aside>
      </section>
    </section>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-2 py-3">
      <p className="text-base font-black text-ink">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-moss">{label}</p>
    </div>
  );
}

function Panel({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function createLessonGame(initialFen: string) {
  return initialFen === "startpos" ? new Chess() : new Chess(initialFen);
}

function isExpectedMove(move: Move, expectedMove: string) {
  const expected = expectedMove.toLowerCase();
  const uciMove = `${move.from}${move.to}${move.promotion ?? ""}`.toLowerCase();
  const sanMove = move.san.replace(/[+#]/g, "").toLowerCase();
  const expectedSan = expectedMove.replace(/[+#]/g, "").toLowerCase();

  return expected === uciMove || expectedSan === sanMove;
}

function feedbackClassName(kind: FeedbackKind) {
  if (kind === "success" || kind === "complete") {
    return "bg-leaf/25 text-ink";
  }

  if (kind === "error") {
    return "bg-peach/25 text-ink";
  }

  return "bg-mist text-ink/70";
}
