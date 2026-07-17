import { AudioButton } from "@/academy/german/components/AudioButton";
import { PronunciationBadge } from "@/academy/german/components/PronunciationBadge";
import type { GermanDialogueLine } from "@/academy/german/data/audioDialogues";

export function DialogueLine({
  line,
  showPronunciation,
  showTranslation,
}: {
  line: GermanDialogueLine;
  showPronunciation: boolean;
  showTranslation: boolean;
}) {
  return (
    <article className="rounded-lg border border-moss/15 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">{line.speaker}</p>
          <p className="mt-1 text-lg font-black text-ink">{line.german}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AudioButton audioId={`${line.speaker}-${line.german}`} audioSrc={line.audioSrc} text={line.german} />
          <AudioButton audioId={`${line.speaker}-${line.german}-slow`} label="Lento" rate={0.75} text={line.german} />
        </div>
      </div>
      {showTranslation ? <p className="mt-3 text-sm font-bold text-ink/70">{line.spanish}</p> : null}
      {showPronunciation ? (
        <div className="mt-3">
          <PronunciationBadge pronunciation={line.pronunciation} />
        </div>
      ) : null}
      {line.keyPhraseIds.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {line.keyPhraseIds.map((phraseId) => (
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-black text-moss" key={phraseId}>
              {phraseId}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
