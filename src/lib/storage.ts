import { DEFAULT_SKIN_ID, SNAKE_SKINS } from "@/data/skins";
import { DEFAULT_AVATAR_CONFIG, COSMETICS } from "@/data/cosmetics";
import { getRankForScore } from "@/data/ranks";
import { DEFAULT_PLAYER_TITLE_ID, PLAYER_TITLES } from "@/data/titles";
import { DEFAULT_WORLD_ID, WORLDS, isWorldId } from "@/data/worlds";
import type { AvatarConfig, AvatarPartCategory, PlayerProfile } from "@/types/profile";
import type { WorldId } from "@/types/worlds";

const STORAGE_KEYS = {
  coins: "jocs_io_coins",
  activeSkin: "jocs_io_active_skin",
  unlockedSkins: "jocs_io_unlocked_skins",
  activeWorld: "jocs_io_active_world",
  unlockedWorlds: "jocs_io_unlocked_worlds",
  musicEnabled: "jocs_io_music_enabled",
  bestScore: "jocs_io_best_score",
  playerProfile: "jocs_io_player_profile",
  playerName: "jocs_io_player_name",
  selectedTitle: "jocs_io_selected_title",
  selectedAvatarParts: "jocs_io_selected_avatar_parts",
  germanProgress: "jocs_io_german_progress",
} as const;

const DEFAULT_PLAYER_NAME = "Jugador IO";
const AVATAR_PART_CATEGORIES: AvatarPartCategory[] = ["eyes", "mouth", "hair", "glasses", "hat", "accessory"];

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

function readJson<T>(key: string): Partial<T> | null {
  if (!canUseStorage()) {
    return null;
  }

  const saved = window.localStorage.getItem(key);
  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function sanitizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 24) : fallback;
}

function readStoredProfile() {
  return readJson<PlayerProfile>(STORAGE_KEYS.playerProfile);
}

function isKnownTitle(titleId: string) {
  return PLAYER_TITLES.some((title) => title.id === titleId);
}

function normalizeAvatarConfig(value: Partial<AvatarConfig> | null | undefined): AvatarConfig {
  const nextAvatar: AvatarConfig = {
    ...DEFAULT_AVATAR_CONFIG,
    ...(value ?? {}),
  };

  AVATAR_PART_CATEGORIES.forEach((category) => {
    const cosmeticId = nextAvatar[category];
    const exists = COSMETICS.some((item) => item.category === category && item.id === cosmeticId);

    if (!exists) {
      nextAvatar[category] = DEFAULT_AVATAR_CONFIG[category];
    }
  });

  nextAvatar.faceColor = sanitizeText(nextAvatar.faceColor, DEFAULT_AVATAR_CONFIG.faceColor);
  return nextAvatar;
}

function calculateDefaultStars(totalScore: number) {
  return Math.max(0, Math.floor(totalScore / 250));
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

export function getDefaultUnlockedWorlds() {
  return WORLDS.filter((world) => world.unlockedByDefault).map((world) => world.id);
}

export function getUnlockedWorlds() {
  if (!canUseStorage()) {
    return getDefaultUnlockedWorlds();
  }

  const saved = window.localStorage.getItem(STORAGE_KEYS.unlockedWorlds);

  if (!saved) {
    const defaults = getDefaultUnlockedWorlds();
    setUnlockedWorlds(defaults);
    return defaults;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return getDefaultUnlockedWorlds();
    }

    return Array.from(
      new Set([...getDefaultUnlockedWorlds(), ...parsed.filter((id): id is WorldId => isWorldId(id))]),
    );
  } catch {
    return getDefaultUnlockedWorlds();
  }
}

export function setUnlockedWorlds(worldIds: WorldId[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.unlockedWorlds, JSON.stringify(worldIds));
  }
}

export function unlockWorld(worldId: WorldId) {
  const unlockedWorlds = getUnlockedWorlds();

  if (!unlockedWorlds.includes(worldId)) {
    setUnlockedWorlds([...unlockedWorlds, worldId]);
  }
}

export function getActiveWorld() {
  if (!canUseStorage()) {
    return DEFAULT_WORLD_ID;
  }

  const saved = window.localStorage.getItem(STORAGE_KEYS.activeWorld);
  if (!isWorldId(saved) || !getUnlockedWorlds().includes(saved)) {
    setActiveWorld(DEFAULT_WORLD_ID);
    return DEFAULT_WORLD_ID;
  }

  return saved;
}

export function setActiveWorld(worldId: WorldId) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.activeWorld, worldId);
  }
}

export function getPlayerName() {
  if (!canUseStorage()) {
    return DEFAULT_PLAYER_NAME;
  }

  const savedName = window.localStorage.getItem(STORAGE_KEYS.playerName);
  if (savedName) {
    return sanitizeText(savedName, DEFAULT_PLAYER_NAME);
  }

  return sanitizeText(readStoredProfile()?.name, DEFAULT_PLAYER_NAME);
}

export function setPlayerName(name: string) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.playerName, sanitizeText(name, DEFAULT_PLAYER_NAME));
  }
}

export function getSelectedTitle() {
  if (!canUseStorage()) {
    return DEFAULT_PLAYER_TITLE_ID;
  }

  const savedTitle = window.localStorage.getItem(STORAGE_KEYS.selectedTitle);
  const profileTitle = readStoredProfile()?.selectedTitleId;
  const titleId = typeof savedTitle === "string" ? savedTitle : profileTitle;

  return typeof titleId === "string" && isKnownTitle(titleId) ? titleId : DEFAULT_PLAYER_TITLE_ID;
}

export function setSelectedTitle(titleId: string) {
  const nextTitleId = isKnownTitle(titleId) ? titleId : DEFAULT_PLAYER_TITLE_ID;

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.selectedTitle, nextTitleId);
  }
}

export function getSelectedAvatarParts() {
  if (!canUseStorage()) {
    return DEFAULT_AVATAR_CONFIG;
  }

  const savedAvatar = readJson<AvatarConfig>(STORAGE_KEYS.selectedAvatarParts);
  const profileAvatar = readStoredProfile()?.avatar;
  return normalizeAvatarConfig(savedAvatar ?? profileAvatar);
}

export function setSelectedAvatarParts(avatar: AvatarConfig) {
  writeJson(STORAGE_KEYS.selectedAvatarParts, normalizeAvatarConfig(avatar));
}

export function getPlayerProfile(): PlayerProfile {
  const storedProfile = readStoredProfile();
  const bestScore = getBestScore();
  const storedTotalScore = Number(storedProfile?.totalScore);
  const totalScore = Math.max(bestScore, Number.isFinite(storedTotalScore) ? storedTotalScore : 0);
  const storedStars = Number(storedProfile?.stars);
  const stars = Number.isFinite(storedStars) ? Math.max(0, Math.floor(storedStars)) : calculateDefaultStars(totalScore);
  const rank = getRankForScore(totalScore);

  return {
    name: getPlayerName(),
    selectedTitleId: getSelectedTitle(),
    avatar: getSelectedAvatarParts(),
    totalScore,
    coins: getCoins(),
    stars,
    bestScore,
    activeSkinId: getActiveSkinId(),
    activeWorldId: getActiveWorld(),
    rankId: rank.id,
  };
}

export function setPlayerProfile(profile: PlayerProfile) {
  const nextProfile: PlayerProfile = {
    ...profile,
    name: sanitizeText(profile.name, DEFAULT_PLAYER_NAME),
    selectedTitleId: isKnownTitle(profile.selectedTitleId) ? profile.selectedTitleId : DEFAULT_PLAYER_TITLE_ID,
    avatar: normalizeAvatarConfig(profile.avatar),
    totalScore: Math.max(0, Math.floor(profile.totalScore)),
    coins: getCoins(),
    stars: Math.max(0, Math.floor(profile.stars)),
    bestScore: getBestScore(),
    activeSkinId: getActiveSkinId(),
    activeWorldId: getActiveWorld(),
    rankId: getRankForScore(profile.totalScore).id,
  };

  setPlayerName(nextProfile.name);
  setSelectedTitle(nextProfile.selectedTitleId);
  setSelectedAvatarParts(nextProfile.avatar);
  writeJson(STORAGE_KEYS.playerProfile, nextProfile);
}

export function getMusicEnabled() {
  if (!canUseStorage()) {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEYS.musicEnabled) === "true";
}

export function setMusicEnabled(enabled: boolean) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.musicEnabled, String(enabled));
  }
}

export type GermanProgress = {
  completedLessons: string[];
  completedSituations: string[];
  studiedVerbs: string[];
  listenedAudios: string[];
  xp: number;
  coins: number;
};

const EMPTY_GERMAN_PROGRESS: GermanProgress = {
  completedLessons: [],
  completedSituations: [],
  studiedVerbs: [],
  listenedAudios: [],
  xp: 0,
  coins: 0,
};

function normalizeStringList(value: unknown) {
  return Array.isArray(value) ? Array.from(new Set(value.filter((item): item is string => typeof item === "string"))) : [];
}

function saveGermanProgress(progress: GermanProgress) {
  writeJson(STORAGE_KEYS.germanProgress, progress);
}

export function getGermanProgress(): GermanProgress {
  const saved = readJson<GermanProgress>(STORAGE_KEYS.germanProgress);

  if (!saved) {
    return { ...EMPTY_GERMAN_PROGRESS };
  }

  return {
    completedLessons: normalizeStringList(saved.completedLessons),
    completedSituations: normalizeStringList(saved.completedSituations),
    studiedVerbs: normalizeStringList(saved.studiedVerbs),
    listenedAudios: normalizeStringList(saved.listenedAudios),
    xp: Number.isFinite(saved.xp) ? Math.max(0, Math.floor(saved.xp ?? 0)) : 0,
    coins: Number.isFinite(saved.coins) ? Math.max(0, Math.floor(saved.coins ?? 0)) : 0,
  };
}

export function addGermanXp(amount: number) {
  const progress = getGermanProgress();
  const nextProgress = {
    ...progress,
    xp: progress.xp + Math.max(0, Math.floor(amount)),
  };

  saveGermanProgress(nextProgress);
  return nextProgress;
}

export function addGermanCoins(amount: number) {
  const reward = Math.max(0, Math.floor(amount));
  const progress = getGermanProgress();
  const nextProgress = {
    ...progress,
    coins: progress.coins + reward,
  };

  saveGermanProgress(nextProgress);
  if (reward > 0) {
    addCoins(reward);
  }
  return nextProgress;
}

export function completeGermanLesson(lessonId: string, rewardCoins = 0, rewardXp = 0) {
  const progress = getGermanProgress();

  if (progress.completedLessons.includes(lessonId)) {
    return { progress, rewarded: false };
  }

  const nextProgress: GermanProgress = {
    ...progress,
    completedLessons: [...progress.completedLessons, lessonId],
    xp: progress.xp + Math.max(0, Math.floor(rewardXp)),
    coins: progress.coins + Math.max(0, Math.floor(rewardCoins)),
  };

  saveGermanProgress(nextProgress);
  if (rewardCoins > 0) {
    addCoins(rewardCoins);
  }

  return { progress: nextProgress, rewarded: true };
}

export function completeGermanSituation(situationId: string, rewardCoins = 6, rewardXp = 15) {
  const progress = getGermanProgress();

  if (progress.completedSituations.includes(situationId)) {
    return { progress, rewarded: false };
  }

  const nextProgress: GermanProgress = {
    ...progress,
    completedSituations: [...progress.completedSituations, situationId],
    xp: progress.xp + Math.max(0, Math.floor(rewardXp)),
    coins: progress.coins + Math.max(0, Math.floor(rewardCoins)),
  };

  saveGermanProgress(nextProgress);
  if (rewardCoins > 0) {
    addCoins(rewardCoins);
  }

  return { progress: nextProgress, rewarded: true };
}

export function markGermanVerbStudied(verbId: string, rewardCoins = 4, rewardXp = 10) {
  const progress = getGermanProgress();

  if (progress.studiedVerbs.includes(verbId)) {
    return { progress, rewarded: false };
  }

  const nextProgress: GermanProgress = {
    ...progress,
    studiedVerbs: [...progress.studiedVerbs, verbId],
    xp: progress.xp + Math.max(0, Math.floor(rewardXp)),
    coins: progress.coins + Math.max(0, Math.floor(rewardCoins)),
  };

  saveGermanProgress(nextProgress);
  if (rewardCoins > 0) {
    addCoins(rewardCoins);
  }

  return { progress: nextProgress, rewarded: true };
}

export function markGermanAudioListened(audioId: string, rewardXp = 2) {
  const progress = getGermanProgress();

  if (progress.listenedAudios.includes(audioId)) {
    return { progress, rewarded: false };
  }

  const nextProgress: GermanProgress = {
    ...progress,
    listenedAudios: [...progress.listenedAudios, audioId],
    xp: progress.xp + Math.max(0, Math.floor(rewardXp)),
  };

  saveGermanProgress(nextProgress);
  return { progress: nextProgress, rewarded: true };
}
