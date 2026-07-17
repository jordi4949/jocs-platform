export function PronunciationBadge({ pronunciation }: { pronunciation: string }) {
  return (
    <span className="inline-flex rounded-full bg-peach/20 px-3 py-1 text-xs font-black text-ink">
      Pron.: {pronunciation}
    </span>
  );
}
