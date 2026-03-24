import { motion } from "framer-motion";
import { about } from "../content/about";
import profileImg from "../assets/profile.jpeg";
import PageTransition from "../components/PageTransition";

export default function About() {
  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-start mb-8">
        <motion.div
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-parchment shrink-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img
            src={profileImg}
            alt="Alex"
            className="w-full h-full object-cover scale-250 object-top"
          />
        </motion.div>
        <div>
          <h1 className="text-4xl sm:text-5xl font-serif font-light leading-tight text-ink mb-6">
            {about.greeting}
          </h1>
          <div className="space-y-5 text-lg leading-relaxed text-charcoal">
            {about.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
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
