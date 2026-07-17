import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GermanCourseLessonDetail } from "@/academy/german/components/GermanCourseLessonDetail";
import { courseLessons, getCourseLesson } from "@/academy/german/data/courseLessons";

export function generateStaticParams() {
  return courseLessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function GermanCourseLessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getCourseLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <AppShell>
      <GermanCourseLessonDetail lesson={lesson} />
    </AppShell>
  );
}
