import {
  CHESS_ACADEMY_CATEGORIES,
  academyLessons,
  type ChessAcademyCategory,
} from "@/games/chess3d/data/academyLessons";

export type ChessAcademyCategoryProgress = {
  completed: number;
  total: number;
};

export type ChessAcademyProgress = {
  completedLessonIds: string[];
  completedAt: Record<string, string>;
  xp: number;
  coins: number;
  categoryProgress: Record<ChessAcademyCategory, ChessAcademyCategoryProgress>;
};

const STORAGE_KEY = "jocs_io_chess_academy_progress";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getCategoryProgress(completedLessonIds: string[]) {
  return CHESS_ACADEMY_CATEGORIES.reduce(
    (progress, category) => {
      const categoryLessons = academyLessons.filter((lesson) => lesson.category === category);
      progress[category] = {
        completed: categoryLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length,
        total: categoryLessons.length,
      };
      return progress;
    },
    {} as Record<ChessAcademyCategory, ChessAcademyCategoryProgress>,
  );
}

export function createEmptyAcademyProgress(): ChessAcademyProgress {
  return {
    completedLessonIds: [],
    completedAt: {},
    xp: 0,
    coins: 0,
    categoryProgress: getCategoryProgress([]),
  };
}

export function readAcademyProgress(): ChessAcademyProgress {
  if (!canUseStorage()) {
    return createEmptyAcademyProgress();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return createEmptyAcademyProgress();
  }

  try {
    const parsed = JSON.parse(saved) as Partial<ChessAcademyProgress>;
    const knownLessonIds = new Set(academyLessons.map((lesson) => lesson.id));
    const completedLessonIds = Array.isArray(parsed.completedLessonIds)
      ? Array.from(
          new Set(parsed.completedLessonIds.filter((lessonId) => typeof lessonId === "string" && knownLessonIds.has(lessonId))),
        )
      : [];

    return {
      completedLessonIds,
      completedAt: parsed.completedAt && typeof parsed.completedAt === "object" ? parsed.completedAt : {},
      xp: Number.isFinite(parsed.xp) ? Math.max(0, Math.floor(parsed.xp ?? 0)) : 0,
      coins: Number.isFinite(parsed.coins) ? Math.max(0, Math.floor(parsed.coins ?? 0)) : 0,
      categoryProgress: getCategoryProgress(completedLessonIds),
    };
  } catch {
    return createEmptyAcademyProgress();
  }
}

export function writeAcademyProgress(progress: ChessAcademyProgress) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...progress,
      categoryProgress: getCategoryProgress(progress.completedLessonIds),
    }),
  );
}

export function completeAcademyLesson(lessonId: string, rewardCoins: number, rewardXp: number) {
  const progress = readAcademyProgress();

  if (progress.completedLessonIds.includes(lessonId)) {
    return { progress, rewarded: false };
  }

  const nextProgress: ChessAcademyProgress = {
    completedLessonIds: [...progress.completedLessonIds, lessonId],
    completedAt: {
      ...progress.completedAt,
      [lessonId]: new Date().toISOString(),
    },
    coins: progress.coins + rewardCoins,
    xp: progress.xp + rewardXp,
    categoryProgress: progress.categoryProgress,
  };

  nextProgress.categoryProgress = getCategoryProgress(nextProgress.completedLessonIds);
  writeAcademyProgress(nextProgress);

  return { progress: nextProgress, rewarded: true };
}
