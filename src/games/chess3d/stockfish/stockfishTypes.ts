export type StockfishAnalysisOptions = {
  movetimeMs?: number;
  depth?: number;
  skillLevel?: number;
  timeoutMs?: number;
};

export type StockfishAnalysisResult = {
  bestMove: string;
  evaluation?: number;
  principalVariation?: string[];
  rawLines: string[];
};

export type StockfishLevelConfig = Required<Pick<StockfishAnalysisOptions, "movetimeMs" | "skillLevel" | "timeoutMs">> &
  Pick<StockfishAnalysisOptions, "depth">;
