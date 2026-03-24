import { now } from "../content/now";
import { formatDate } from "../lib/formatDate";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Now() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-2">Now</h1>
      <p className="font-sans text-sm text-warm-gray mb-10">
        Last updated {formatDate(now.lastUpdated)}
      </p>
      <div className="space-y-10">
        {now.sections.map((section, i) => (
          <SectionReveal key={section.heading} delay={i * 0.06}>
            <h2 className="text-lg font-serif text-ink mb-3">
              {section.heading}
            </h2>
            <ul className="space-y-1.5 text-charcoal">
              {section.items.map((item) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span className="text-parchment select-none">&bull;</span>
                  {item}
                </li>
              ))}
            </ul>
          </SectionReveal>
        ))}
      </div>
      <div className="mt-16 pt-8 border-t border-parchment">
        <p className="font-sans text-xs text-warm-gray">
          This is a{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors duration-200"
          >
            /now page
          </a>
          .
        </p>
      </div>
    </PageTransition>
  );
}
