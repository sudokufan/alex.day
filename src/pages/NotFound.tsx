import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <div className="py-20 text-center">
        <h1 className="text-5xl font-serif font-light text-ink mb-4">404</h1>
        <p className="text-stone mb-8">This page doesn't exist.</p>
        <Link
          to="/"
          className="font-sans text-sm text-accent hover:text-accent-hover underline underline-offset-4 transition-colors duration-200"
        >
          Go home
        </Link>
      </div>
    </PageTransition>
  );
}
