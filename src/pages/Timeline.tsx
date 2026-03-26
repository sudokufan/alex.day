import { motion } from "framer-motion";
import { timeline } from "../content/timeline";
import PageTransition from "../components/PageTransition";

export default function Timeline() {
  const years = [...new Set(timeline.map((e) => e.year))];
  let entryIndex = 0;

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
              <motion.h2
                className="text-lg font-serif text-ink -ml-8 pl-8 mb-6 relative"
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.35, ease: "easeOut", delay: entryIndex * 0.06 }}
              >
                <motion.span
                  className="absolute left-[-5px] top-[0.45em] w-2 h-2 rounded-full bg-parchment"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.25, delay: entryIndex * 0.06 + 0.1 }}
                />
                {year}
              </motion.h2>
              <div className="space-y-6">
                {entries.map((entry) => {
                  const delay = entryIndex++ * 0.06;
                  return (
                    <motion.div
                      key={`${year}-${entry.title}`}
                      className="relative -ml-8 pl-8"
                      initial={{ opacity: 0, x: -4 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.35, ease: "easeOut", delay }}
                    >
                      <motion.span
                        className="absolute left-[-3px] top-[0.55em] w-1.5 h-1.5 rounded-full bg-parchment"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.2, delay: delay + 0.1 }}
                      />
                      <p className="font-serif text-ink">{entry.title}</p>
                      {entry.description && (
                        <p className="mt-1 font-sans text-sm text-warm-gray">
                          {entry.description}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
