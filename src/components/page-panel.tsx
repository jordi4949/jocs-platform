type PagePanelProps = {
  title: string;
  eyebrow: string;
  description: string;
  children?: React.ReactNode;
};

export function PagePanel({ title, eyebrow, description, children }: PagePanelProps) {
  return (
    <section className="rounded-xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur sm:p-7">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-moss">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-ink/70">{description}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
