import { motion } from "framer-motion";
import { about } from "../content/about";
import profileImg from "../assets/profile.jpeg";
import PageTransition from "../components/PageTransition";
import { BookIcon, TvIcon, GamepadIcon } from "../components/icons";

export default function About() {
  return (
    <PageTransition>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-start mb-8">
        <div className="shrink-0 sm:w-36">
          <motion.div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-parchment overflow-hidden"
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
          <motion.ul
            className="mt-4 space-y-2 font-sans text-xs text-warm-gray"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <li className="flex items-center mt-6 gap-2">
              <BookIcon />{" "}
              <span className="italic">{about.currently.reading}</span>
            </li>
            <li className="flex items-center gap-2">
              <TvIcon />{" "}
              <span className="italic">{about.currently.watching}</span>
            </li>
            <li className="flex items-center gap-2">
              <GamepadIcon />{" "}
              <span className="italic">{about.currently.playing}</span>
            </li>
          </motion.ul>
        </div>
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
    </PageTransition>
  );
}
