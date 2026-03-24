import { motion } from "framer-motion";
import { about } from "../content/about";
import PageTransition from "../components/PageTransition";

export default function About() {
  return (
    <PageTransition>
      <h1 className="text-4xl sm:text-5xl font-serif font-light leading-tight text-ink mb-8">
        {about.greeting}
      </h1>
      <div className="space-y-5 text-lg leading-relaxed text-charcoal">
        {about.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <motion.div
        className="mt-12 flex gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {about.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="font-sans text-sm text-accent hover:text-accent-hover underline underline-offset-4 transition-colors duration-200"
            target={link.url.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </motion.div>
    </PageTransition>
  );
}
