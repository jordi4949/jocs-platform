import { DEFAULT_SKIN_ID, SNAKE_SKINS } from "@/data/skins";

const STORAGE_KEYS = {
  coins: "jocs_io_coins",
  activeSkin: "jocs_io_active_skin",
  unlockedSkins: "jocs_io_unlocked_skins",
  bestScore: "jocs_io_best_score",
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readNumber(key: string, fallback: number) {
  if (!canUseStorage()) {
    return fallback;
  }

  const value = window.localStorage.getItem(key);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function writeNumber(key: string, value: number) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, String(Math.max(0, Math.floor(value))));
  }
}

export function getCoins() {
  return readNumber(STORAGE_KEYS.coins, 0);
}

export function setCoins(coins: number) {
  writeNumber(STORAGE_KEYS.coins, coins);
}

export function addCoins(amount: number) {
  const nextCoins = getCoins() + amount;
  setCoins(nextCoins);
  return nextCoins;
}

export function getBestScore() {
  return readNumber(STORAGE_KEYS.bestScore, 0);
}

export function setBestScore(score: number) {
  const bestScore = Math.max(getBestScore(), score);
  writeNumber(STORAGE_KEYS.bestScore, bestScore);
  return bestScore;
}

export function getDefaultUnlockedSkinIds() {
  return SNAKE_SKINS.filter((skin) => skin.unlockedByDefault).map((skin) => skin.id);
}

export function getUnlockedSkinIds() {
  if (!canUseStorage()) {
    return getDefaultUnlockedSkinIds();
  }

  const saved = window.localStorage.getItem(STORAGE_KEYS.unlockedSkins);

  if (!saved) {
    const defaults = getDefaultUnlockedSkinIds();
    setUnlockedSkinIds(defaults);
    return defaults;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return getDefaultUnlockedSkinIds();
    }

    return Array.from(
      new Set([...getDefaultUnlockedSkinIds(), ...parsed.filter((id) => typeof id === "string")]),
    );
  } catch {
    return getDefaultUnlockedSkinIds();
  }
}

export function setUnlockedSkinIds(skinIds: string[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.unlockedSkins, JSON.stringify(skinIds));
  }
}

export function unlockSkin(skinId: string) {
  const unlockedSkinIds = getUnlockedSkinIds();

  if (!unlockedSkinIds.includes(skinId)) {
    setUnlockedSkinIds([...unlockedSkinIds, skinId]);
  }
}

export function isSkinUnlocked(skinId: string) {
  return getUnlockedSkinIds().includes(skinId);
}

export function getActiveSkinId() {
  if (!canUseStorage()) {
    return DEFAULT_SKIN_ID;
  }

  const saved = window.localStorage.getItem(STORAGE_KEYS.activeSkin);
  if (!saved || !isSkinUnlocked(saved)) {
    setActiveSkinId(DEFAULT_SKIN_ID);
    return DEFAULT_SKIN_ID;
  }

  return saved;
}

export function setActiveSkinId(skinId: string) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.activeSkin, skinId);
  }
}
