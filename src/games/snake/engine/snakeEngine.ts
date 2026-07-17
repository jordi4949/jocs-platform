import { SNAKE_SKINS } from "@/data/skins";
import type {
  BotDifficulty,
  BotHeadType,
  BotPersonality,
  BotSnake,
  Direction,
  Food,
  Point,
  Portal,
  SnakeGameState,
} from "@/games/snake/types";

export const WORLD_WIDTH = 5600;
export const WORLD_HEIGHT = 3800;
export const INITIAL_SNAKE_LENGTH = 16;
export const FOOD_COUNT = 400;
export const POINTS_PER_FOOD = 10;
export const COINS_PER_FOOD = 2;
export const SEGMENT_RADIUS = 13;
export const HEAD_RADIUS = 16;
export const SEGMENT_SPACING = 18;

const BOT_COUNT = 7;
const BOT_INITIAL_LENGTH = 13;
const BOT_KILL_POINTS = 120;
const BOT_KILL_COINS = 12;
const PLAYER_NORMAL_SPEED = 225;
const PLAYER_TURBO_SPEED = 369;
const TURN_RATE = Math.PI * 2.15;
const PORTAL_RADIUS = 46;
const PORTAL_EXIT_DISTANCE = 96;
const PORTAL_COOLDOWN_SECONDS = 2;
const PORTAL_INVULNERABLE_SECONDS = 1;
const PORTAL_MESSAGE_SECONDS = 1.15;
const FOOD_RADIUS = 6;
const DEATH_FOOD_RADIUS = 7.5;
const DEATH_FOOD_VALUE = 18;
const DEATH_FOOD_COINS = 3;
const FOOD_COLORS = ["#ffd166", "#ef476f", "#58a6ff", "#9be86f", "#f0abfc", "#80ffdb"];
const BOT_DIFFICULTIES: BotDifficulty[] = [
  "hard",
  "hard",
  "easy",
  "easy",
  "medium",
  "hard",
];
const BOT_CONFIGS: Array<{
  name: string;
  difficulty: BotDifficulty;
  personality: BotPersonality;
  skinId?: string;
  headType?: BotHeadType;
  headImage?: string;
  soundSrc?: string;
  bodyColor?: string;
  secondaryColor?: string;
}> = [
  {
    name: "Bimba",
    difficulty: "hard",
    personality: "aggressive",
    skinId: "classic_green",
    headType: "image",
    headImage: "/skins/family/bimba-head-game.png",
    soundSrc: "/sounds/dog-bark.mp3",
    bodyColor: "#a3e635",
    secondaryColor: "#fde047",
  },
  {
    name: "Jordi",
    difficulty: "hard",
    personality: "smart",
    skinId: "ice_snake",
    bodyColor: "#60a5fa",
    secondaryColor: "#86efac",
  },
  { name: "Pipo", difficulty: "easy", personality: "normal", skinId: "classic_green" },
  { name: "Nina", difficulty: "easy", personality: "normal", skinId: "robot_snake" },
  { name: "Byte", difficulty: "medium", personality: "normal", skinId: "galaxy_snake" },
  { name: "Razor", difficulty: "hard", personality: "aggressive", skinId: "fire_snake" },
  { name: "Vex", difficulty: "hard", personality: "normal", skinId: "galaxy_snake" },
];
const BOT_PROFILES: Record<
  BotDifficulty,
  {
    speed: number;
    turnRate: number;
    scanRadius: number;
    borderMargin: number;
    reactionDelay: number;
    wanderMin: number;
    wanderMax: number;
    wobble: number;
    playerHuntRadius: number;
    turboMultiplier: number;
    turboFoodRadius: number;
  }
> = {
  easy: {
    speed: 152,
    turnRate: Math.PI * 1.1,
    scanRadius: 430,
    borderMargin: 130,
    reactionDelay: 0.9,
    wanderMin: 1.5,
    wanderMax: 2.6,
    wobble: Math.PI * 1.1,
    playerHuntRadius: 0,
    turboMultiplier: 1,
    turboFoodRadius: 0,
  },
  medium: {
    speed: 190,
    turnRate: Math.PI * 2,
    scanRadius: 720,
    borderMargin: 260,
    reactionDelay: 0.24,
    wanderMin: 0.8,
    wanderMax: 1.45,
    wobble: Math.PI * 0.55,
    playerHuntRadius: 0,
    turboMultiplier: 1.28,
    turboFoodRadius: 210,
  },
  hard: {
    speed: 230,
    turnRate: Math.PI * 2.85,
    scanRadius: 980,
    borderMargin: 360,
    reactionDelay: 0.08,
    wanderMin: 0.45,
    wanderMax: 0.9,
    wobble: Math.PI * 0.35,
    playerHuntRadius: 760,
    turboMultiplier: 1.42,
    turboFoodRadius: 330,
  },
};

const directionAngles: Record<Direction, number> = {
  right: 0,
  down: Math.PI / 2,
  left: Math.PI,
  up: -Math.PI / 2,
};

export function createInitialSnakeState(): SnakeGameState {
  const startX = WORLD_WIDTH / 2;
  const startY = WORLD_HEIGHT / 2;
  const snake = createSnakeLine(startX, startY, 0, INITIAL_SNAKE_LENGTH);
  const bots = createBots(snake);
  const portals = createPortals();

  return {
    snake,
    bots,
    food: createFoodBatch([...snake, ...bots.flatMap((bot) => bot.snake), ...portals]),
    portals,
    playerPortalCooldown: 0,
    playerInvulnerableTimer: 0,
    portalMessageTimer: 0,
    direction: "right",
    nextDirection: "right",
    angle: 0,
    targetAngle: 0,
    score: 0,
    coinsEarned: 0,
    status: "playing",
  };
}

export function setNextDirection(state: SnakeGameState, direction: Direction): SnakeGameState {
  if (state.status === "game-over") {
    return state;
  }

  return {
    ...state,
    nextDirection: direction,
    targetAngle: chooseNearestTargetAngle(state.angle, directionAngles[direction]),
  };
}

export function stepSnakeGame(
  state: SnakeGameState,
  deltaSeconds: number,
  turboActive: boolean,
): SnakeGameState {
  if (state.status !== "playing") {
    return state;
  }

  const playerStep = movePlayer(state, deltaSeconds, turboActive);
  if (playerStep.dead) {
    return {
      ...state,
      angle: playerStep.angle,
      direction: state.nextDirection,
      snake: playerStep.snake,
      playerPortalCooldown: playerStep.portalCooldown,
      playerInvulnerableTimer: playerStep.invulnerableTimer,
      portalMessageTimer: playerStep.portalMessageTimer,
      status: "game-over",
    };
  }

  const botStep = moveBots(
    state.bots,
    playerStep.food,
    playerStep.snake,
    playerStep.angle,
    deltaSeconds,
  );
  let nextState: SnakeGameState = {
    ...state,
    snake: playerStep.snake,
    bots: botStep.bots,
    food: botStep.food,
    direction: state.nextDirection,
    angle: playerStep.angle,
    playerPortalCooldown: playerStep.portalCooldown,
    playerInvulnerableTimer: playerStep.invulnerableTimer,
    portalMessageTimer: playerStep.portalMessageTimer,
    score: state.score + playerStep.scoreDelta,
    coinsEarned: state.coinsEarned + playerStep.coinsDelta,
  };

  nextState = resolveWormCollisions(nextState);
  nextState = ensureBotCount(nextState);
  nextState = ensureFoodCount(nextState);

  return nextState;
}

function movePlayer(state: SnakeGameState, deltaSeconds: number, turboActive: boolean) {
  const angle = turnTowardAngle(state.angle, state.targetAngle, TURN_RATE * deltaSeconds);
  const speed = turboActive ? PLAYER_TURBO_SPEED : PLAYER_NORMAL_SPEED;
  const head = state.snake[0];
  const timers = {
    portalCooldown: Math.max(0, state.playerPortalCooldown - deltaSeconds),
    invulnerableTimer: Math.max(0, state.playerInvulnerableTimer - deltaSeconds),
    portalMessageTimer: Math.max(0, state.portalMessageTimer - deltaSeconds),
  };
  const nextHead = {
    x: head.x + Math.cos(angle) * speed * deltaSeconds,
    y: head.y + Math.sin(angle) * speed * deltaSeconds,
  };

  if (isOutsideArena(nextHead)) {
    return {
      angle,
      snake: [nextHead, ...state.snake.slice(1)],
      food: state.food,
      ...timers,
      scoreDelta: 0,
      coinsDelta: 0,
      dead: true,
    };
  }

  const eatenFood = findEatenFood(nextHead, state.food);
  const nextSnake = followHead([nextHead, ...state.snake.slice(1)]);

  if (eatenFood) {
    nextSnake.push(createTailSegment(nextSnake));
  }

  const portalResult = usePlayerPortal(nextSnake, angle, state.portals, timers.portalCooldown);

  return {
    angle,
    snake: portalResult?.snake ?? nextSnake,
    food: eatenFood ? state.food.filter((food) => food.id !== eatenFood.id) : state.food,
    portalCooldown: portalResult ? PORTAL_COOLDOWN_SECONDS : timers.portalCooldown,
    invulnerableTimer: portalResult ? PORTAL_INVULNERABLE_SECONDS : timers.invulnerableTimer,
    portalMessageTimer: portalResult ? PORTAL_MESSAGE_SECONDS : timers.portalMessageTimer,
    scoreDelta: eatenFood?.value ?? 0,
    coinsDelta: eatenFood?.coinValue ?? 0,
    dead: false,
  };
}

function moveBots(
  bots: BotSnake[],
  food: Food[],
  playerSnake: Point[],
  playerAngle: number,
  deltaSeconds: number,
) {
  let availableFood = food;
  const movedBots = bots.map((bot) => {
    const profile = BOT_PROFILES[bot.difficulty];
    const intent = getBotIntent(
      bot,
      availableFood,
      playerSnake,
      playerAngle,
      bots,
      deltaSeconds,
    );
    const angle = turnTowardAngle(bot.angle, intent.targetAngle, profile.turnRate * deltaSeconds);
    const speed = profile.speed * (intent.turboActive ? profile.turboMultiplier : 1);
    const head = bot.snake[0];
    const nextHead = keepInsideArena({
      x: head.x + Math.cos(angle) * speed * deltaSeconds,
      y: head.y + Math.sin(angle) * speed * deltaSeconds,
    });
    const eatenFood = findEatenFood(nextHead, availableFood);
    const nextSnake = followHead([nextHead, ...bot.snake.slice(1)]);

    if (eatenFood) {
      nextSnake.push(createTailSegment(nextSnake));
      availableFood = availableFood.filter((foodItem) => foodItem.id !== eatenFood.id);
    }

    return {
      ...bot,
      snake: nextSnake,
      angle,
      targetAngle: intent.targetAngle,
    };
  });

  return {
    bots: movedBots,
    food: availableFood,
  };
}

function getBotIntent(
  bot: BotSnake,
  food: Food[],
  playerSnake: Point[],
  playerAngle: number,
  allBots: BotSnake[],
  deltaSeconds: number,
) {
  const profile = BOT_PROFILES[bot.difficulty];
  const head = bot.snake[0];
  const borderAngle = getBorderAvoidanceAngle(head, profile.borderMargin);

  if (borderAngle !== null) {
    bot.wanderTimer = Math.min(bot.wanderTimer, profile.reactionDelay);
    return {
      targetAngle: chooseNearestTargetAngle(bot.angle, borderAngle),
      turboActive: bot.difficulty !== "easy",
    };
  }

  const threat = findNearestBodyThreat(
    head,
    bot,
    playerSnake,
    allBots,
    profile.borderMargin * (bot.difficulty === "easy" ? 0.45 : 0.78),
  );

  if (threat) {
    bot.wanderTimer = Math.min(bot.wanderTimer, profile.reactionDelay);
    return {
      targetAngle: chooseNearestTargetAngle(bot.angle, Math.atan2(head.y - threat.y, head.x - threat.x)),
      turboActive: bot.difficulty !== "easy",
    };
  }

  bot.wanderTimer -= deltaSeconds;
  if (bot.wanderTimer > 0) {
    return {
      targetAngle: bot.targetAngle,
      turboActive: false,
    };
  }

  bot.wanderTimer = profile.reactionDelay;

  const playerDistance = distance(head, playerSnake[0]);
  const botIsBigger = bot.snake.length >= playerSnake.length + 4;
  const botIsSmaller = bot.snake.length + 3 < playerSnake.length;
  const bimba = allBots.find((candidate) => candidate.name === "Bimba");

  if (bot.personality === "smart" && bimba && bimba.id !== bot.id && distance(head, bimba.snake[0]) < 520) {
    return {
      targetAngle: chooseNearestTargetAngle(
        bot.angle,
        Math.atan2(head.y - bimba.snake[0].y, head.x - bimba.snake[0].x),
      ),
      turboActive: true,
    };
  }

  if (bot.personality === "aggressive" && playerDistance < profile.playerHuntRadius * 1.2) {
    const cutDistance = bot.name === "Bimba" ? 280 : 200;
    const interceptPoint = {
      x: playerSnake[0].x + Math.cos(playerAngle) * cutDistance,
      y: playerSnake[0].y + Math.sin(playerAngle) * cutDistance,
    };

    return {
      targetAngle: chooseNearestTargetAngle(
        bot.angle,
        Math.atan2(interceptPoint.y - head.y, interceptPoint.x - head.x),
      ),
      turboActive: bot.name === "Bimba" || playerDistance < profile.playerHuntRadius * 0.75,
    };
  }

  if (bot.difficulty === "hard" && botIsSmaller && playerDistance < profile.playerHuntRadius * 0.8) {
    return {
      targetAngle: chooseNearestTargetAngle(
        bot.angle,
        Math.atan2(head.y - playerSnake[0].y, head.x - playerSnake[0].x),
      ),
      turboActive: true,
    };
  }

  if (bot.difficulty === "hard" && botIsBigger && playerDistance < profile.playerHuntRadius) {
    const interceptPoint = {
      x: playerSnake[0].x + Math.cos(playerAngle) * 190,
      y: playerSnake[0].y + Math.sin(playerAngle) * 190,
    };
    return {
      targetAngle: chooseNearestTargetAngle(
        bot.angle,
        Math.atan2(interceptPoint.y - head.y, interceptPoint.x - head.x),
      ),
      turboActive: true,
    };
  }

  const nearestFood = findNearestFood(head, food, profile.scanRadius);
  if (nearestFood) {
    const clumsiness = (Math.random() - 0.5) * (bot.difficulty === "easy" ? 0.7 : 0.18);
    const foodDistance = distance(head, nearestFood);

    return {
      targetAngle: chooseNearestTargetAngle(
        bot.angle,
        Math.atan2(nearestFood.y - head.y, nearestFood.x - head.x) + clumsiness,
      ),
      turboActive:
        nearestFood.kind === "death" ||
        bot.personality === "aggressive" ||
        (bot.difficulty !== "easy" && foodDistance < profile.turboFoodRadius),
    };
  }

  bot.wanderTimer = profile.wanderMin + Math.random() * (profile.wanderMax - profile.wanderMin);
  return {
    targetAngle: bot.angle + (Math.random() - 0.5) * profile.wobble,
    turboActive: false,
  };
}

function resolveWormCollisions(state: SnakeGameState): SnakeGameState {
  const playerHead = state.snake[0];
  const playerHitsBot =
    state.playerInvulnerableTimer <= 0 && state.bots.some((bot) => hitsBody(playerHead, bot.snake));

  if (playerHitsBot) {
    return {
      ...state,
      status: "game-over",
    };
  }

  const deadBotIds = new Set<number>();
  let scoreDelta = 0;
  let coinsDelta = 0;

  state.bots.forEach((bot) => {
    const botHead = bot.snake[0];

    if (hitsBody(botHead, state.snake)) {
      deadBotIds.add(bot.id);
      scoreDelta += BOT_KILL_POINTS;
      coinsDelta += BOT_KILL_COINS;
      return;
    }

    const hitsOtherBot = state.bots.some(
      (otherBot) => otherBot.id !== bot.id && hitsBody(botHead, otherBot.snake),
    );

    if (hitsOtherBot) {
      deadBotIds.add(bot.id);
    }
  });

  if (deadBotIds.size === 0) {
    return state;
  }

  const deadBots = state.bots.filter((bot) => deadBotIds.has(bot.id));
  const aliveBots = state.bots.filter((bot) => !deadBotIds.has(bot.id));
  const deathFood = deadBots.flatMap((bot) => createDeathFood(bot.snake, bot.skinId));

  return {
    ...state,
    bots: aliveBots,
    food: [...state.food, ...deathFood],
    score: state.score + scoreDelta,
    coinsEarned: state.coinsEarned + coinsDelta,
  };
}

function ensureFoodCount(state: SnakeGameState) {
  const normalFoodCount = state.food.filter((food) => food.kind === "normal").length;
  const food = [...state.food];

  for (let count = normalFoodCount; count < FOOD_COUNT; count += 1) {
    food.push(createFood([...state.snake, ...state.bots.flatMap((bot) => bot.snake), ...state.portals, ...food]));
  }

  return {
    ...state,
    food,
  };
}

function ensureBotCount(state: SnakeGameState) {
  const bots = [...state.bots];

  while (bots.length < BOT_COUNT) {
    bots.push(createBot(getNextBotIndex(bots), state.snake, bots));
  }

  return {
    ...state,
    bots,
  };
}

function createBots(playerSnake: Point[]) {
  const bots: BotSnake[] = [];

  for (let index = 0; index < BOT_COUNT; index += 1) {
    bots.push(createBot(index, playerSnake, bots));
  }

  return bots;
}

function getNextBotIndex(bots: BotSnake[]) {
  const missingConfiguredBotIndex = BOT_CONFIGS.findIndex(
    (config) => !bots.some((bot) => bot.name === config.name),
  );

  if (missingConfiguredBotIndex >= 0) {
    return missingConfiguredBotIndex;
  }

  const difficultyCounts = bots.reduce<Record<BotDifficulty, number>>(
    (counts, bot) => ({
      ...counts,
      [bot.difficulty]: counts[bot.difficulty] + 1,
    }),
    { easy: 0, medium: 0, hard: 0 },
  );

  const nextIndex = BOT_DIFFICULTIES.findIndex(
    (difficulty, index) =>
      difficultyCounts[difficulty] <
      BOT_DIFFICULTIES.slice(0, index + 1).filter((candidate) => candidate === difficulty).length,
  );

  return nextIndex >= 0 ? nextIndex : bots.length;
}

function createBot(index: number, playerSnake: Point[], existingBots: BotSnake[]) {
  let head = randomArenaPoint(HEAD_RADIUS + 260);
  const botConfig = BOT_CONFIGS[index % BOT_CONFIGS.length];
  const difficulty = botConfig.difficulty;

  while (
    distance(head, playerSnake[0]) < 900 ||
    existingBots.some((bot) => distance(head, bot.snake[0]) < 620)
  ) {
    head = randomArenaPoint(HEAD_RADIUS + 260);
  }

  const angle = Math.random() * Math.PI * 2;
  const usedSkinIds = new Set(existingBots.map((bot) => bot.skinId));
  const configuredSkin = SNAKE_SKINS.find((candidate) => candidate.id === botConfig.skinId);
  const skin =
    configuredSkin ??
    SNAKE_SKINS.find((candidate) => !usedSkinIds.has(candidate.id)) ??
    SNAKE_SKINS[0];

  return {
    id: Date.now() + index + Math.floor(Math.random() * 100000),
    name: botConfig.name,
    difficulty,
    personality: botConfig.personality,
    headType: botConfig.headType ?? "circle",
    headImage: botConfig.headImage,
    soundSrc: botConfig.soundSrc,
    bodyColor: botConfig.bodyColor,
    secondaryColor: botConfig.secondaryColor,
    skinId: skin.id,
    snake: createSnakeLine(head.x, head.y, angle, BOT_INITIAL_LENGTH),
    angle,
    targetAngle: angle,
    wanderTimer: 0.4 + Math.random() * 1.4,
  };
}

function createSnakeLine(startX: number, startY: number, angle: number, length: number) {
  return Array.from({ length }, (_, index) => ({
    x: startX - Math.cos(angle) * index * SEGMENT_SPACING,
    y: startY - Math.sin(angle) * index * SEGMENT_SPACING,
  }));
}

function followHead(snake: Point[]) {
  const nextSnake = snake.map((segment) => ({ ...segment }));

  for (let index = 1; index < nextSnake.length; index += 1) {
    const previous = nextSnake[index - 1];
    const current = nextSnake[index];
    const gap = distance(previous, current);

    if (gap === 0) {
      current.x = previous.x - SEGMENT_SPACING;
      current.y = previous.y;
      continue;
    }

    const pull = (gap - SEGMENT_SPACING) / gap;
    current.x += (previous.x - current.x) * pull;
    current.y += (previous.y - current.y) * pull;
  }

  return nextSnake;
}

function createTailSegment(snake: Point[]) {
  const tail = snake[snake.length - 1];
  const beforeTail = snake[snake.length - 2] ?? tail;
  const gap = distance(beforeTail, tail) || 1;

  return {
    x: tail.x + ((tail.x - beforeTail.x) / gap) * SEGMENT_SPACING,
    y: tail.y + ((tail.y - beforeTail.y) / gap) * SEGMENT_SPACING,
  };
}

function createFoodBatch(blockedPoints: Point[]) {
  const food: Food[] = [];

  while (food.length < FOOD_COUNT) {
    food.push(createFood([...blockedPoints, ...food]));
  }

  return food;
}

function createPortals(): Portal[] {
  return [
    {
      id: 1,
      pairId: 1,
      x: WORLD_WIDTH * 0.18,
      y: WORLD_HEIGHT * 0.22,
      radius: PORTAL_RADIUS,
      color: "#8b5cf6",
    },
    {
      id: 2,
      pairId: 1,
      x: WORLD_WIDTH * 0.82,
      y: WORLD_HEIGHT * 0.78,
      radius: PORTAL_RADIUS,
      color: "#8b5cf6",
    },
    {
      id: 3,
      pairId: 2,
      x: WORLD_WIDTH * 0.76,
      y: WORLD_HEIGHT * 0.24,
      radius: PORTAL_RADIUS,
      color: "#22d3ee",
    },
    {
      id: 4,
      pairId: 2,
      x: WORLD_WIDTH * 0.26,
      y: WORLD_HEIGHT * 0.76,
      radius: PORTAL_RADIUS,
      color: "#22d3ee",
    },
  ];
}

function usePlayerPortal(snake: Point[], angle: number, portals: Portal[], cooldown: number) {
  if (cooldown > 0) {
    return null;
  }

  const head = snake[0];
  const entryPortal = portals.find((portal) => distance(head, portal) <= portal.radius);

  if (!entryPortal) {
    return null;
  }

  const exitPortal = portals.find(
    (portal) => portal.pairId === entryPortal.pairId && portal.id !== entryPortal.id,
  );

  if (!exitPortal) {
    return null;
  }

  const exitHead = {
    x: clamp(
      exitPortal.x + Math.cos(angle) * (exitPortal.radius + PORTAL_EXIT_DISTANCE),
      HEAD_RADIUS,
      WORLD_WIDTH - HEAD_RADIUS,
    ),
    y: clamp(
      exitPortal.y + Math.sin(angle) * (exitPortal.radius + PORTAL_EXIT_DISTANCE),
      HEAD_RADIUS,
      WORLD_HEIGHT - HEAD_RADIUS,
    ),
  };
  const deltaX = exitHead.x - head.x;
  const deltaY = exitHead.y - head.y;

  return {
    snake: snake.map((segment) => ({
      x: clamp(segment.x + deltaX, HEAD_RADIUS, WORLD_WIDTH - HEAD_RADIUS),
      y: clamp(segment.y + deltaY, HEAD_RADIUS, WORLD_HEIGHT - HEAD_RADIUS),
    })),
  };
}

function createFood(blockedPoints: Point[]): Food {
  let candidate: Food;

  do {
    candidate = {
      id: Date.now() + Math.floor(Math.random() * 1000000),
      x: HEAD_RADIUS + Math.random() * (WORLD_WIDTH - HEAD_RADIUS * 2),
      y: HEAD_RADIUS + Math.random() * (WORLD_HEIGHT - HEAD_RADIUS * 2),
      color: FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)],
      radius: FOOD_RADIUS + Math.random() * 3,
      value: POINTS_PER_FOOD,
      coinValue: COINS_PER_FOOD,
      kind: "normal",
    };
  } while (
    blockedPoints.some((point) => distance(point, candidate) < SEGMENT_RADIUS * 2.2) ||
    createPortals().some((portal) => distance(portal, candidate) < portal.radius + 36)
  );

  return candidate;
}

function createDeathFood(snake: Point[], skinId: string) {
  const skin = SNAKE_SKINS.find((candidate) => candidate.id === skinId) ?? SNAKE_SKINS[0];

  return snake.map((segment, index) => ({
    id: Date.now() + index + Math.floor(Math.random() * 1000000),
    x: clamp(segment.x + (Math.random() - 0.5) * 12, DEATH_FOOD_RADIUS, WORLD_WIDTH - DEATH_FOOD_RADIUS),
    y: clamp(segment.y + (Math.random() - 0.5) * 12, DEATH_FOOD_RADIUS, WORLD_HEIGHT - DEATH_FOOD_RADIUS),
    color: index % 2 === 0 ? skin.headColor : skin.secondaryColor ?? skin.bodyColor,
    radius: DEATH_FOOD_RADIUS + Math.random() * 2.5,
    value: DEATH_FOOD_VALUE,
    coinValue: DEATH_FOOD_COINS,
    kind: "death" as const,
  }));
}

function findEatenFood(head: Point, food: Food[]): Food | undefined {
  return food.find((foodItem) => distance(head, foodItem) <= HEAD_RADIUS + foodItem.radius + 2);
}

function findNearestFood(head: Point, food: Food[], maxDistance: number): Food | null {
  let nearestFood: Food | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const foodItem of food) {
    const foodDistance = distance(head, foodItem);
    const foodScore = foodDistance - foodItem.value * 7;

    if (foodDistance < maxDistance && foodScore < bestScore) {
      nearestFood = foodItem;
      bestScore = foodScore;
    }
  }

  return nearestFood;
}

function findNearestBodyThreat(
  head: Point,
  bot: BotSnake,
  playerSnake: Point[],
  allBots: BotSnake[],
  maxDistance: number,
): Point | null {
  let nearestThreat: Point | null = null;
  let nearestDistance = maxDistance;
  const bodySegments = [
    ...playerSnake.slice(1),
    ...allBots
      .filter((otherBot) => otherBot.id !== bot.id)
      .flatMap((otherBot) => otherBot.snake.slice(1)),
  ];

  for (const segment of bodySegments) {
    const bodyDistance = distance(head, segment);

    if (bodyDistance < nearestDistance) {
      nearestThreat = segment;
      nearestDistance = bodyDistance;
    }
  }

  return nearestThreat;
}

function hitsBody(head: Point, snake: Point[]) {
  return snake
    .slice(1)
    .some((segment) => distance(head, segment) <= HEAD_RADIUS + SEGMENT_RADIUS * 0.72);
}

function isOutsideArena(point: Point) {
  return (
    point.x - HEAD_RADIUS < 0 ||
    point.y - HEAD_RADIUS < 0 ||
    point.x + HEAD_RADIUS > WORLD_WIDTH ||
    point.y + HEAD_RADIUS > WORLD_HEIGHT
  );
}

function keepInsideArena(point: Point) {
  return {
    x: clamp(point.x, HEAD_RADIUS, WORLD_WIDTH - HEAD_RADIUS),
    y: clamp(point.y, HEAD_RADIUS, WORLD_HEIGHT - HEAD_RADIUS),
  };
}

function getBorderAvoidanceAngle(point: Point, margin: number) {
  if (
    point.x > margin &&
    point.y > margin &&
    point.x < WORLD_WIDTH - margin &&
    point.y < WORLD_HEIGHT - margin
  ) {
    return null;
  }

  return Math.atan2(WORLD_HEIGHT / 2 - point.y, WORLD_WIDTH / 2 - point.x);
}

function turnTowardAngle(currentAngle: number, targetAngle: number, maxTurn: number) {
  const delta = normalizeAngle(targetAngle - currentAngle);

  if (Math.abs(delta) <= maxTurn) {
    return targetAngle;
  }

  return currentAngle + Math.sign(delta) * maxTurn;
}

function chooseNearestTargetAngle(currentAngle: number, targetAngle: number) {
  return currentAngle + normalizeAngle(targetAngle - currentAngle);
}

function normalizeAngle(angle: number) {
  let normalized = angle;

  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }
  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }

  return normalized;
}

function randomArenaPoint(padding: number) {
  return {
    x: padding + Math.random() * (WORLD_WIDTH - padding * 2),
    y: padding + Math.random() * (WORLD_HEIGHT - padding * 2),
  };
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
