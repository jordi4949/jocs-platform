import Link from "next/link";
import type { GermanGrammarTopic } from "@/academy/german/data/grammarTopics";

export function GrammarTopicCard({ topic }: { topic: GermanGrammarTopic }) {
  return (
    <article className="rounded-lg border border-moss/15 bg-mist p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-moss">Gramática útil</p>
      <h3 className="mt-1 text-xl font-black text-ink">{topic.title}</h3>
      <p className="mt-3 text-sm leading-6 text-ink/70">{topic.explanationShort}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {topic.relatedLessons.slice(0, 3).map((lessonId) => (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-moss" key={lessonId}>
            {lessonId}
          </span>
        ))}
      </div>
      <Link
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-black text-ink transition hover:bg-ink hover:text-white"
        href={`/academy/german/grammar/${topic.id}`}
      >
        Ver tema
      </Link>
    </article>
  );
}
