import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ChessAcademyLesson } from "@/games/chess3d/components/ChessAcademyLesson";
import { academyLessons, getAcademyLesson } from "@/games/chess3d/data/academyLessons";

export function generateStaticParams() {
  return academyLessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function ChessAcademyLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getAcademyLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <AppShell>
      <ChessAcademyLesson lesson={lesson} />
    </AppShell>
  );
}
