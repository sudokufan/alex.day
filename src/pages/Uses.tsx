import { usesCategories } from "../content/uses";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Uses() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-2">Uses</h1>
      <p className="text-stone mb-12">
        Tools, gear, and things I reach for regularly.
      </p>
      <div className="space-y-12">
        {usesCategories.map((cat, i) => (
          <SectionReveal key={cat.category} delay={i * 0.06}>
            <h2 className="text-lg font-serif text-ink mb-5">
              {cat.category}
            </h2>
            <div className="space-y-4">
              {cat.items.map((item) => (
                <div key={item.name}>
                  <p className="text-ink font-medium">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors duration-200"
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )}
                  </p>
                  {item.description && (
                    <p className="mt-0.5 text-stone text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        ))}
      </div>
    </PageTransition>
  );
}
