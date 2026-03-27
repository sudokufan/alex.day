import { timeline } from "../content/timeline";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Timeline() {
  const years = [...new Set(timeline.map((e) => e.year))];

  return (
    <PageTransition>
      <h1 className="text-3xl mb-14 font-serif font-light text-ink">
        Timeline
      </h1>
      <div className="border-l border-parchment pl-8 space-y-12">
        {years.map((year) => {
          const entries = timeline.filter((e) => e.year === year);
          return (
            <div key={year}>
              <SectionReveal>
                <h2 className="text-lg font-serif text-ink -ml-8 pl-8 mb-6 relative">
                  <span className="absolute left-[-5px] top-[0.45em] w-2 h-2 rounded-full bg-parchment" />
                  {year}
                </h2>
              </SectionReveal>
              <div className="space-y-6">
                {entries.map((entry, i) => (
                  <SectionReveal
                    key={`${year}-${entry.title}`}
                    delay={i * 0.06}
                  >
                    <div className="relative -ml-8 pl-8">
                      <span className="absolute left-[-3px] top-[0.55em] w-1.5 h-1.5 rounded-full bg-parchment" />
                      <p className="font-serif text-ink">{entry.title}</p>
                      {entry.description && (
                        <p className="mt-1 font-sans text-sm text-warm-gray">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
