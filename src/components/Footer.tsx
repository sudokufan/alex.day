import { GitHubIcon, EnvelopeIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="mt-12 pt-8 border-t border-parchment pb-12 flex items-center justify-between font-sans text-xs text-warm-gray">
      <p>&copy; {new Date().getFullYear()} Alex Day</p>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/sudokufan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink transition-colors duration-200"
          aria-label="GitHub"
        >
          <GitHubIcon />
        </a>
        <a
          href="mailto:aday@hey.com"
          className="hover:text-ink transition-colors duration-200"
          aria-label="Email"
        >
          <EnvelopeIcon />
        </a>
      </div>
    </footer>
  );
}
