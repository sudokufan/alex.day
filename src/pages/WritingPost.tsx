import { useParams, Link, Navigate } from "react-router-dom";
import Markdown from "react-markdown";
import { posts } from "../content/writing";
import { formatDate } from "../lib/formatDate";
import PageTransition from "../components/PageTransition";

export default function WritingPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/writing" replace />;
  }

  return (
    <PageTransition>
      <article>
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-light text-ink leading-tight">
            {post.title}
          </h1>
          <time className="block mt-3 font-sans text-sm text-stone">
            {formatDate(post.date)}
          </time>
        </header>
        <div className="prose text-lg leading-relaxed text-charcoal">
          <Markdown>{post.body}</Markdown>
        </div>
        <div className="mt-16 pt-8 border-t border-parchment">
          <Link
            to="/writing"
            className="font-sans text-sm text-accent hover:text-accent-hover underline underline-offset-4 transition-colors duration-200"
          >
            &larr; Back to writing
          </Link>
        </div>
      </article>
    </PageTransition>
  );
}
