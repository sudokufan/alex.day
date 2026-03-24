import { projects } from "../content/projects";
import PageTransition from "../components/PageTransition";
import SectionReveal from "../components/SectionReveal";

export default function Projects() {
  return (
    <PageTransition>
      <h1 className="text-3xl font-serif font-light text-ink mb-12">
        Projects
      </h1>
      <div className="space-y-14">
        {projects.map((project, i) => (
          <SectionReveal key={project.title} delay={i * 0.06}>
            <h2 className="text-xl font-serif text-ink">{project.title}</h2>
            <p className="mt-1 font-sans text-sm text-stone">{project.date}</p>
            <p className="mt-3 text-charcoal leading-relaxed">
              {project.description}
            </p>
          </SectionReveal>
        ))}
      </div>
    </PageTransition>
  );
}
