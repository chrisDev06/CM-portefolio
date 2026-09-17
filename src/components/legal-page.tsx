import { Container, Glow } from "./ui";

export function LegalPage({
  title,
  lead,
  sections,
}: {
  title: string;
  lead: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Glow className="-top-40 left-1/4 size-[420px]" />
      <Container>
        <h1 className="max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl rounded-md border border-line bg-surface/60 px-4 py-3 text-sm text-ink-muted">
          {lead}
        </p>

        <div className="mt-14 max-w-3xl divide-y divide-line border-t border-line">
          {sections.map((section) => (
            <div key={section.title} className="py-8">
              <h2 className="text-xl">{section.title}</h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
