import { statCategories } from "../content/stats";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Stats() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-2">Stats</h1>
      <p className="text-stone mb-12">Life in numbers.</p>
      <div className="space-y-14">
        {statCategories.map((cat, i) => (
          <SectionReveal key={cat.category} delay={i * 0.06}>
            <h2 className="text-lg font-serif text-ink mb-5">
              {cat.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {cat.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-serif font-light text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-sans text-xs text-stone">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        ))}
      </div>
    </PageTransition>
  );
}
