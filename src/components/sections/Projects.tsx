"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { GitHubIcon, ExternalLinkIcon } from "@/components/icons";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="relative py-20 lg:py-28">
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-rose/10 blur-[120px]"
        style={{ animation: "blob-drift 12s ease-in-out infinite 1s" }}
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-1/4 h-[300px] w-[300px] rounded-full bg-violet/10 blur-[100px]"
        style={{ animation: "blob-drift 14s ease-in-out infinite 3s" }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader label="// projects" title="What I&apos;ve Built" />
        </AnimatedSection>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="glass group relative overflow-hidden rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-violet/8 md:p-8"
              >
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-violet/8 to-rose/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-3">
                        <h3 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="rounded-full bg-violet/12 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-violet">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-muted-dark">
                        {project.date}
                      </span>
                    </div>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg p-2 text-muted transition-colors hover:bg-white/50 hover:text-foreground"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <GitHubIcon size={18} />
                      <ExternalLinkIcon size={14} />
                    </a>
                  </div>

                  {/* Backstory */}
                  <p className="mb-3 text-sm leading-relaxed text-muted italic">
                    &ldquo;{project.backstory}&rdquo;
                  </p>

                  {/* Technical description */}
                  <p className="mb-5 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
