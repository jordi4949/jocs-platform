"use client";

import { useEffect, useMemo, useState } from "react";
import { COSMETIC_CATEGORIES, COSMETICS, getCosmeticById, getCosmeticsByCategory } from "@/data/cosmetics";
import { getRankById } from "@/data/ranks";
import { getSkinById } from "@/data/skins";
import { getPlayerTitleById, PLAYER_TITLES } from "@/data/titles";
import { getWorldById } from "@/data/worlds";
import { getPlayerProfile, setPlayerProfile } from "@/lib/storage";
import type { AvatarConfig, AvatarPartCategory, CosmeticItem, PlayerProfile } from "@/types/profile";

const FACE_COLORS = ["#ffd7a8", "#f7b98b", "#c98252", "#8d5524", "#d7f2ff"];

export function ProfileClient() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftTitleId, setDraftTitleId] = useState("");
  const [draftAvatar, setDraftAvatar] = useState<AvatarConfig | null>(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const loadedProfile = getPlayerProfile();
    setProfile(loadedProfile);
    setDraftName(loadedProfile.name);
    setDraftTitleId(loadedProfile.selectedTitleId);
    setDraftAvatar(loadedProfile.avatar);
  }, []);

  const activeTitle = useMemo(() => getPlayerTitleById(draftTitleId), [draftTitleId]);
  const activeRank = profile ? getRankById(profile.rankId) : null;
  const activeSkin = profile ? getSkinById(profile.activeSkinId) : null;
  const activeWorld = profile ? getWorldById(profile.activeWorldId) : null;

  if (!profile || !draftAvatar || !activeRank || !activeSkin || !activeWorld) {
    return (
      <div className="rounded-lg border border-moss/15 bg-mist p-5 text-sm font-bold text-ink/70">
        Cargando perfil...
      </div>
    );
  }

  const saveProfile = () => {
    const nextProfile: PlayerProfile = {
      ...getPlayerProfile(),
      name: draftName,
      selectedTitleId: draftTitleId,
      avatar: draftAvatar,
    };

    setPlayerProfile(nextProfile);
    const savedProfile = getPlayerProfile();
    setProfile(savedProfile);
    setDraftName(savedProfile.name);
    setDraftTitleId(savedProfile.selectedTitleId);
    setDraftAvatar(savedProfile.avatar);
    setSaveMessage("Cambios guardados");
    window.setTimeout(() => setSaveMessage(""), 1800);
  };

  const updateAvatarPart = (category: AvatarPartCategory, item: CosmeticItem) => {
    if (!isCosmeticUnlocked(item)) {
      return;
    }

    setDraftAvatar((currentAvatar) => (currentAvatar ? { ...currentAvatar, [category]: item.id } : currentAvatar));
  };

  const selectTitle = (titleId: string) => {
    const title = getPlayerTitleById(titleId);

    if (isTitleUnlocked(title, profile.totalScore)) {
      setDraftTitleId(title.id);
    }
  };

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <div className="overflow-hidden rounded-lg border border-ink/10 bg-[#101827] text-white shadow-soft">
          <div className="relative min-h-[360px] p-5">
            <div
              className="absolute inset-0 opacity-35"
              style={{
                background: `radial-gradient(circle at 30% 20%, ${activeRank.glowColor}, transparent 18rem), linear-gradient(135deg, ${activeWorld.backgroundColor}, #101827)`,
              }}
            />
            <div className="relative flex h-full min-h-[320px] flex-col items-center justify-between gap-5">
              <div className="w-full text-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/55">
                  {activeTitle.name}
                </p>
                <h3 className="mt-2 break-words text-3xl font-black">{draftName || "Jugador IO"}</h3>
                <div
                  className="mx-auto mt-3 inline-flex rounded-lg border px-3 py-1 text-sm font-black"
                  style={{ borderColor: activeRank.color, color: activeRank.color, boxShadow: `0 0 24px ${activeRank.glowColor}` }}
                >
                  {activeRank.name}
                </div>
              </div>

              <AvatarPreview avatar={draftAvatar} />

              <div className="grid w-full grid-cols-3 gap-2 text-center">
                <ProfileNumber label="Puntos" value={profile.totalScore} dark />
                <ProfileNumber label="Monedas" value={profile.coins} dark />
                <ProfileNumber label="Estrellas" value={profile.stars} dark />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
            <label className="block text-sm font-black uppercase tracking-[0.16em] text-moss" htmlFor="player-name">
              Nombre
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                className="h-12 min-w-0 flex-1 rounded-lg border border-ink/15 bg-mist px-4 text-base font-black text-ink outline-none transition focus:border-moss focus:bg-white"
                id="player-name"
                maxLength={24}
                onChange={(event) => setDraftName(event.target.value)}
                value={draftName}
              />
              <button
                className="h-12 rounded-lg bg-ink px-5 text-sm font-black text-white transition hover:bg-moss"
                onClick={saveProfile}
                type="button"
              >
                Guardar cambios
              </button>
            </div>
            {saveMessage ? <p className="mt-2 text-sm font-bold text-moss">{saveMessage}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Mejor puntuacion" value={profile.bestScore} />
            <InfoCard label="Skin activa" value={activeSkin.name} accent={activeSkin.headColor} />
            <InfoCard label="Mundo activo" value={activeWorld.name} accent={activeWorld.accentColor} />
            <InfoCard label="Titulo activo" value={activeTitle.name} accent={activeRank.color} />
          </div>

          <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-moss">Color de cara</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FACE_COLORS.map((color) => (
                <button
                  aria-label={`Color ${color}`}
                  className={`h-10 w-10 rounded-full border-4 transition ${
                    draftAvatar.faceColor === color ? "border-ink" : "border-white shadow-soft"
                  }`}
                  key={color}
                  onClick={() => setDraftAvatar({ ...draftAvatar, faceColor: color })}
                  style={{ backgroundColor: color }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-moss">Titulos</p>
          <div className="mt-4 grid gap-2">
            {PLAYER_TITLES.map((title) => {
              const unlocked = isTitleUnlocked(title, profile.totalScore);
              const selected = draftTitleId === title.id;

              return (
                <button
                  className={`rounded-lg border p-3 text-left transition ${
                    selected
                      ? "border-moss bg-mist"
                      : unlocked
                        ? "border-ink/10 bg-white hover:border-moss"
                        : "border-ink/10 bg-slate-100 opacity-55"
                  }`}
                  disabled={!unlocked}
                  key={title.id}
                  onClick={() => selectTitle(title.id)}
                  type="button"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-black text-ink">{title.name}</span>
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">
                      {unlocked ? "Libre" : `Puntos ${title.minScore ?? 0}`}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-ink/60">{title.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-moss">Cosmeticos</p>
          <div className="mt-4 grid gap-4">
            {COSMETIC_CATEGORIES.map((category) => (
              <CosmeticSection
                avatar={draftAvatar}
                category={category.id}
                key={category.id}
                name={category.name}
                onSelect={updateAvatarPart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileNumber({ label, value, dark = false }: { label: string; value: number; dark?: boolean }) {
  return (
    <div className={dark ? "rounded-lg border border-white/10 bg-white/10 p-3" : "rounded-lg border border-ink/10 bg-mist p-3"}>
      <p className={dark ? "text-xs font-bold text-white/55" : "text-xs font-bold text-ink/55"}>{label}</p>
      <p className={dark ? "mt-1 text-xl font-black text-white" : "mt-1 text-xl font-black text-ink"}>{value}</p>
    </div>
  );
}

function InfoCard({ label, value, accent = "#3f7d53" }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-lg border border-moss/15 bg-white p-4 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">{label}</p>
      <p className="mt-2 break-words text-lg font-black text-ink">{value}</p>
      <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
    </div>
  );
}

function CosmeticSection({
  avatar,
  category,
  name,
  onSelect,
}: {
  avatar: AvatarConfig;
  category: AvatarPartCategory;
  name: string;
  onSelect: (category: AvatarPartCategory, item: CosmeticItem) => void;
}) {
  const items = getCosmeticsByCategory(category);

  return (
    <div>
      <p className="text-sm font-black text-ink">{name}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => {
          const unlocked = isCosmeticUnlocked(item);
          const selected = avatar[category] === item.id;

          return (
            <button
              className={`min-h-20 rounded-lg border p-3 text-left transition ${
                selected
                  ? "border-moss bg-mist"
                  : unlocked
                    ? "border-ink/10 bg-white hover:border-moss"
                    : "border-ink/10 bg-slate-100 opacity-55"
              }`}
              disabled={!unlocked}
              key={item.id}
              onClick={() => onSelect(category, item)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-ink/10 text-xs font-black"
                  style={{ backgroundColor: item.color ?? "#edf7f0", color: item.accentColor ?? "#13201a" }}
                >
                  {item.name.slice(0, 1)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-black text-ink">{item.name}</span>
                  <span className="text-xs font-bold text-ink/45">{unlocked ? "Disponible" : "Bloqueado"}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AvatarPreview({ avatar }: { avatar: AvatarConfig }) {
  const eyes = getCosmeticById("eyes", avatar.eyes);
  const mouth = getCosmeticById("mouth", avatar.mouth);
  const hair = getCosmeticById("hair", avatar.hair);
  const glasses = getCosmeticById("glasses", avatar.glasses);
  const hat = getCosmeticById("hat", avatar.hat);
  const accessory = getCosmeticById("accessory", avatar.accessory);

  return (
    <div className="relative grid h-48 w-48 place-items-center">
      <div className="absolute bottom-1 h-12 w-36 rounded-[50%] bg-black/25 blur-md" />
      <div
        className="relative h-40 w-40 rounded-full border-4 border-white/80 shadow-soft"
        style={{ backgroundColor: avatar.faceColor }}
      >
        <HairShape hair={hair} />
        <HatShape hat={hat} />
        <AccessoryShape accessory={accessory} />
        <EyeShape eyes={eyes} />
        <GlassesShape glasses={glasses} />
        <MouthShape mouth={mouth} />
      </div>
    </div>
  );
}

function EyeShape({ eyes }: { eyes?: CosmeticItem }) {
  const color = eyes?.color ?? "#13201a";

  if (eyes?.id === "eyes_sleepy") {
    return (
      <div className="absolute left-0 top-[58px] flex w-full justify-center gap-9">
        <span className="h-2 w-8 rounded-full bg-ink" style={{ backgroundColor: color }} />
        <span className="h-2 w-8 rounded-full bg-ink" style={{ backgroundColor: color }} />
      </div>
    );
  }

  if (eyes?.id === "eyes_star") {
    return (
      <div className="absolute left-0 top-[50px] flex w-full justify-center gap-9">
        <span className="h-8 w-8 rotate-45 rounded-sm" style={{ backgroundColor: color }} />
        <span className="h-8 w-8 rotate-45 rounded-sm" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-[48px] flex w-full justify-center gap-10">
      <span className="h-8 w-8 rounded-full bg-ink ring-4 ring-white/65" style={{ backgroundColor: color }} />
      <span className="h-8 w-8 rounded-full bg-ink ring-4 ring-white/65" style={{ backgroundColor: color }} />
    </div>
  );
}

function MouthShape({ mouth }: { mouth?: CosmeticItem }) {
  const color = mouth?.color ?? "#7f1d1d";

  if (mouth?.id === "mouth_focus") {
    return <span className="absolute left-1/2 top-[98px] h-2 w-14 -translate-x-1/2 rounded-full" style={{ backgroundColor: color }} />;
  }

  if (mouth?.id === "mouth_big") {
    return (
      <span
        className="absolute left-1/2 top-[92px] h-9 w-16 -translate-x-1/2 rounded-b-full rounded-t-lg border-4 border-white/55"
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <span
      className="absolute left-1/2 top-[86px] h-9 w-16 -translate-x-1/2 rounded-b-full border-b-8 border-l-4 border-r-4 border-transparent"
      style={{ borderBottomColor: color }}
    />
  );
}

function HairShape({ hair }: { hair?: CosmeticItem }) {
  if (!hair || hair.id === "hair_none") {
    return null;
  }

  if (hair.id === "hair_wave") {
    return (
      <span
        className="absolute left-7 top-0 h-10 w-24 rounded-b-full rounded-t-lg"
        style={{ backgroundColor: hair.color ?? "#7c2d12" }}
      />
    );
  }

  return (
    <div className="absolute left-8 top-[-4px] flex gap-1">
      {[0, 1, 2, 3].map((index) => (
        <span
          className="block h-10 w-6"
          key={index}
          style={{
            backgroundColor: hair.color ?? "#3f2f1f",
            clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
          }}
        />
      ))}
    </div>
  );
}

function GlassesShape({ glasses }: { glasses?: CosmeticItem }) {
  if (!glasses || glasses.id === "glasses_none") {
    return null;
  }

  const color = glasses.color ?? "#111827";

  if (glasses.id === "glasses_pixel") {
    return (
      <div className="absolute left-0 top-[47px] flex w-full justify-center">
        <span className="h-8 w-24 rounded-sm border-4" style={{ borderColor: color }} />
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-[45px] flex w-full items-center justify-center gap-2">
      <span className="h-10 w-10 rounded-full border-4 bg-white/10" style={{ borderColor: color }} />
      <span className="h-1.5 w-4 rounded-full" style={{ backgroundColor: color }} />
      <span className="h-10 w-10 rounded-full border-4 bg-white/10" style={{ borderColor: color }} />
    </div>
  );
}

function HatShape({ hat }: { hat?: CosmeticItem }) {
  if (!hat || hat.id === "hat_none") {
    return null;
  }

  if (hat.id === "hat_crown") {
    return (
      <div className="absolute left-9 top-[-22px] flex h-12 w-24 items-end justify-center gap-1">
        {[0, 1, 2].map((index) => (
          <span
            className="block h-10 w-7"
            key={index}
            style={{
              backgroundColor: hat.color ?? "#facc15",
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute left-9 top-[-10px]">
      <span className="block h-9 w-24 rounded-t-full" style={{ backgroundColor: hat.color ?? "#2563eb" }} />
      <span className="mx-auto block h-3 w-28 rounded-full" style={{ backgroundColor: hat.accentColor ?? "#f8fafc" }} />
    </div>
  );
}

function AccessoryShape({ accessory }: { accessory?: CosmeticItem }) {
  if (!accessory || accessory.id === "accessory_none") {
    return null;
  }

  if (accessory.id === "accessory_lightning") {
    return (
      <span
        className="absolute right-4 top-16 h-16 w-8"
        style={{
          backgroundColor: accessory.color ?? "#f59e0b",
          clipPath: "polygon(45% 0, 100% 0, 62% 40%, 100% 40%, 30% 100%, 45% 55%, 0 55%)",
        }}
      />
    );
  }

  return (
    <span
      className="absolute left-1/2 top-[120px] h-4 w-24 -translate-x-1/2 rotate-[-8deg] rounded-full border-2 border-white/70"
      style={{ backgroundColor: accessory.color ?? "#22c55e" }}
    />
  );
}

function isCosmeticUnlocked(item: CosmeticItem) {
  return item.unlockedByDefault || item.isFree;
}

function isTitleUnlocked(title: { unlockedByDefault: boolean; minScore?: number }, totalScore: number) {
  return title.unlockedByDefault || totalScore >= (title.minScore ?? 0);
}
