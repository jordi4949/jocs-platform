import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GermanGrammarDetail } from "@/academy/german/components/GermanGrammarDetail";
import { getGrammarTopic, grammarTopics } from "@/academy/german/data/grammarTopics";

export function generateStaticParams() {
  return grammarTopics.map((topic) => ({ topicId: topic.id }));
}

export default async function GermanGrammarTopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topic = getGrammarTopic(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <AppShell>
      <GermanGrammarDetail topic={topic} />
    </AppShell>
  );
}
