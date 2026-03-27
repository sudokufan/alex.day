import { videos } from "../content/videos";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Videos() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-12">Videos</h1>
      <div className="flex flex-col gap-16">
        {videos.map((video, i) => {
          const even = i % 2 === 0;
          return (
            <SectionReveal key={video.youtubeId} delay={i * 0.08}>
              <div
                className={`flex flex-col sm:flex-row gap-6 ${
                  even ? "" : "sm:flex-row-reverse"
                }`}
              >
                <div className="sm:w-3/5 shrink-0">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="font-serif text-xl text-ink">{video.title}</h2>
                  <p className="mt-2 font-sans text-sm text-stone leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </PageTransition>
  );
}
