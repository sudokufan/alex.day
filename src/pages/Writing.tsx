import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { posts } from "../content/posts";
import { formatDate } from "../lib/formatDate";
import PageTransition from "../components/PageTransition";

const container = {
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function Writing() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-10">
        Writing
      </h1>
      <motion.div
        className="space-y-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {posts.map((post) => (
          <motion.article key={post.slug} variants={item}>
            <Link
              to={`/posts/${post.slug}`}
              className="group block"
            >
              <h2 className="text-xl font-serif text-ink group-hover:text-accent transition-colors duration-200">
                {post.title}
              </h2>
              <time className="block mt-1 font-sans text-sm text-stone">
                {formatDate(post.date)}
              </time>
              <p className="mt-2 text-charcoal leading-relaxed">
                {post.summary}
              </p>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </PageTransition>
  );
}
