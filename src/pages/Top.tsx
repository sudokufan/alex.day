import { topLists } from "../content/top";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Top() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-2">
        Top Four
      </h1>
      <p className="text-stone mb-12">
        Mount Rushmore lists. Four of each, no more.
      </p>
      <div className="space-y-14">
        {topLists.map((list, i) => (
          <SectionReveal key={list.category} delay={i * 0.06}>
            <h2 className="text-lg font-serif text-ink mb-5">
              {list.category}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {list.items.map((item, j) => (
                <div
                  key={j}
                  className="p-4 rounded-lg bg-warm-white border border-parchment"
                >
                  <p className="font-serif text-ink">{item.name}</p>
                  {item.detail && (
                    <p className="mt-1 font-sans text-sm text-stone">
                      {item.detail}
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
