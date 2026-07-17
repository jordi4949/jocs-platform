import {
  STOCKFISH_LEVEL_CONFIG,
  STOCKFISH_SCRIPT_PATH,
  STOCKFISH_TIMEOUT_MS,
  STOCKFISH_WASM_PATH,
} from "@/games/chess3d/stockfish/stockfishConfig";
import type { StockfishAnalysisOptions, StockfishAnalysisResult } from "@/games/chess3d/stockfish/stockfishTypes";

type PendingLine = {
  predicate: (line: string) => boolean;
  resolve: (line: string) => void;
  reject: (error: Error) => void;
  timeoutId: number;
};

class StockfishBrowserClient {
  private worker: Worker | null = null;
  private initPromise: Promise<void> | null = null;
  private pendingLines: PendingLine[] = [];
  private rawLines: string[] = [];

  async analyzePosition(fen: string, options: StockfishAnalysisOptions = {}): Promise<StockfishAnalysisResult> {
    const timeoutMs = options.timeoutMs ?? STOCKFISH_TIMEOUT_MS;

    await this.ensureReady(options, timeoutMs);
    this.rawLines = [];
    this.post("stop");
    this.post("ucinewgame");
    this.post(`position fen ${fen}`);
    const readyPromise = this.waitForLine((line) => line === "readyok", timeoutMs);
    this.post("isready");
    await readyPromise;

    const goCommand = options.depth ? `go depth ${options.depth}` : `go movetime ${options.movetimeMs ?? 700}`;
    this.post(goCommand);

    const bestMoveLine = await this.waitForLine((line) => line.startsWith("bestmove "), timeoutMs);
    const bestMove = bestMoveLine.split(/\s+/)[1];

    if (!bestMove || bestMove === "(none)") {
      throw new Error("Stockfish no devolvió una jugada válida.");
    }

    return {
      bestMove,
      rawLines: [...this.rawLines],
      ...parseAnalysisLines(this.rawLines),
    };
  }

  terminate() {
    this.pendingLines.forEach((pending) => {
      window.clearTimeout(pending.timeoutId);
      pending.reject(new Error("Stockfish se ha cerrado."));
    });
    this.pendingLines = [];
    this.worker?.terminate();
    this.worker = null;
    this.initPromise = null;
  }

  private ensureReady(options: StockfishAnalysisOptions, timeoutMs: number) {
    if (this.initPromise) {
      return this.initPromise.then(() => this.configure(options, timeoutMs));
    }

    this.initPromise = new Promise<void>((resolve, reject) => {
      if (typeof window === "undefined" || typeof Worker === "undefined") {
        reject(new Error("Stockfish solo está disponible en el navegador."));
        return;
      }

      try {
        const workerUrl = `${STOCKFISH_SCRIPT_PATH}#${encodeURIComponent(STOCKFISH_WASM_PATH)},worker`;
        this.worker = new Worker(workerUrl);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("No se pudo crear el worker de Stockfish."));
        return;
      }

      this.worker.onmessage = (event: MessageEvent<string>) => this.handleLine(String(event.data));
      this.worker.onerror = () => {
        const error = new Error("Stockfish no está disponible, usando bot avanzado local.");
        this.rejectPending(error);
        reject(error);
      };

      const uciPromise = this.waitForLine((line) => line === "uciok", timeoutMs);
      this.post("uci");
      uciPromise
        .then(() => this.configure(options, timeoutMs))
        .then(resolve)
        .catch((error) => {
          this.terminate();
          reject(error);
        });
    });

    return this.initPromise;
  }

  private async configure(options: StockfishAnalysisOptions, timeoutMs: number) {
    if (typeof options.skillLevel === "number") {
      this.post(`setoption name Skill Level value ${options.skillLevel}`);
    }

    this.post("setoption name UCI_LimitStrength value false");
    const readyPromise = this.waitForLine((line) => line === "readyok", timeoutMs);
    this.post("isready");
    await readyPromise;
  }

  private post(command: string) {
    if (!this.worker) {
      throw new Error("Stockfish no está inicializado.");
    }

    this.worker.postMessage(command);
  }

  private handleLine(line: string) {
    this.rawLines.push(line);

    const pendingIndex = this.pendingLines.findIndex((pending) => pending.predicate(line));
    if (pendingIndex === -1) {
      return;
    }

    const [pending] = this.pendingLines.splice(pendingIndex, 1);
    window.clearTimeout(pending.timeoutId);
    pending.resolve(line);
  }

  private waitForLine(predicate: (line: string) => boolean, timeoutMs: number) {
    return new Promise<string>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.pendingLines = this.pendingLines.filter((pending) => pending.timeoutId !== timeoutId);
        reject(new Error("Stockfish tardó demasiado en responder."));
      }, timeoutMs);

      this.pendingLines.push({ predicate, resolve, reject, timeoutId });
    });
  }

  private rejectPending(error: Error) {
    this.pendingLines.forEach((pending) => {
      window.clearTimeout(pending.timeoutId);
      pending.reject(error);
    });
    this.pendingLines = [];
  }
}

let stockfishClient: StockfishBrowserClient | null = null;

export function getStockfishClient() {
  stockfishClient ??= new StockfishBrowserClient();
  return stockfishClient;
}

export async function analyzePositionWithStockfish(
  fen: string,
  options: StockfishAnalysisOptions = {},
): Promise<StockfishAnalysisResult> {
  return getStockfishClient().analyzePosition(fen, options);
}

export function getStockfishOptionsForDifficulty(difficulty: keyof typeof STOCKFISH_LEVEL_CONFIG) {
  return STOCKFISH_LEVEL_CONFIG[difficulty];
}

function parseAnalysisLines(lines: string[]) {
  const infoLines = lines.filter((line) => line.startsWith("info "));
  const lastInfo = infoLines.at(-1);

  if (!lastInfo) {
    return {};
  }

  const cpMatch = lastInfo.match(/\bscore cp (-?\d+)/);
  const mateMatch = lastInfo.match(/\bscore mate (-?\d+)/);
  const pvMatch = lastInfo.match(/\bpv (.+)$/);

  return {
    evaluation: mateMatch ? Number(mateMatch[1]) * 100000 : cpMatch ? Number(cpMatch[1]) : undefined,
    principalVariation: pvMatch ? pvMatch[1].split(/\s+/) : undefined,
  };
}

// Futuro Mentor:
// - comparar la jugada del usuario contra principalVariation
// - detectar errores graves por caída de evaluación
// - generar consejos explicables y análisis post-partida
