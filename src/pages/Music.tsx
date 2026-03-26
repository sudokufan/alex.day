import { releases } from "../content/music";
import { formatDate } from "../lib/formatDate";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Music() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-12">Music</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
        {releases.map((release, i) => (
          <SectionReveal key={release.title} delay={i * 0.06}>
            <a
              href={release.bandcampUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <img
                src={release.artwork}
                alt={release.title}
                className="w-full aspect-square object-cover rounded-lg shadow-sm transition-shadow duration-200 group-hover:shadow-md"
              />
            </a>
            <p className="mt-3 font-serif italic text-ink">{release.title}</p>
            <p className="mt-1 font-sans text-sm text-stone">
              {release.date ? formatDate(release.date) : "Coming Soon"}
            </p>
            {(release.spotifyUrl || release.appleMusicUrl) && (
              <div className="mt-2 flex gap-4 font-sans text-sm">
                {release.spotifyUrl && (
                  <a
                    href={release.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover transition-colors duration-200"
                  >
                    Spotify
                  </a>
                )}
                {release.appleMusicUrl && (
                  <a
                    href={release.appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover transition-colors duration-200"
                  >
                    Apple Music
                  </a>
                )}
              </div>
            )}
          </SectionReveal>
        ))}
      </div>
    </PageTransition>
  );
}
