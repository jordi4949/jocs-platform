import Link from "next/link";
import { AudioButton } from "@/academy/german/components/AudioButton";
import { PronunciationBadge } from "@/academy/german/components/PronunciationBadge";
import type { GermanGrammarTopic } from "@/academy/german/data/grammarTopics";

export function GermanGrammarDetail({ topic }: { topic: GermanGrammarTopic }) {
  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
        <Link className="text-sm font-black text-moss transition hover:text-ink" href="/academy/german/grammar">
          Volver a gramática
        </Link>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-moss">Apoyo práctico</p>
        <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{topic.title}</h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{topic.explanationDetailed}</p>
      </div>

      <section className="rounded-lg border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-moss">Ejemplos</p>
        <div className="mt-4 grid gap-3">
          {topic.examples.map((example, index) => (
            <article className="rounded-lg bg-mist p-4" key={`${topic.id}-${index}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-black text-ink">{example.german}</p>
                  <p className="mt-1 text-sm font-bold text-ink/70">{example.spanish}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AudioButton audioId={`${topic.id}-${index}`} audioSrc={example.audioSrc} text={example.german} />
                  <AudioButton audioId={`${topic.id}-${index}-slow`} label="Lento" rate={0.75} text={example.german} />
                </div>
              </div>
              <div className="mt-3">
                <PronunciationBadge pronunciation={example.pronunciation} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
