"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  CodeIcon,
  ServerIcon,
  LayoutIcon,
  DatabaseIcon,
  BrainIcon,
  TerminalIcon,
} from "@/components/icons";
import { skillGroups } from "@/data/skills";

const groupIcons = [
  CodeIcon,
  ServerIcon,
  LayoutIcon,
  DatabaseIcon,
  BrainIcon,
  TerminalIcon,
];

const groupColors = [
  "group-hover:border-violet/40 group-hover:text-violet-light",
  "group-hover:border-cyan/40 group-hover:text-cyan",
  "group-hover:border-violet/40 group-hover:text-violet-light",
  "group-hover:border-cyan/40 group-hover:text-cyan",
  "group-hover:border-amber/40 group-hover:text-amber",
  "group-hover:border-violet/40 group-hover:text-violet-light",
];

const iconColors = [
  "text-violet",
  "text-cyan",
  "text-violet-light",
  "text-cyan",
  "text-amber",
  "text-violet",
];

export function Skills() {
  return (
    <section id="skills" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader label="// skills" title="Tech I Work With" />
        </AnimatedSection>

        <div className="grid grid-rows-[1fr_1fr] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => {
            const Icon = groupIcons[i];
            return (
              <AnimatedSection key={group.title} delay={i * 0.08} className="h-full">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="group h-full rounded-xl border border-border bg-card p-5 transition-colors duration-300 hover:border-border-hover hover:bg-card-hover"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <Icon size={20} className={iconColors[i]} />
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      {group.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-200 ${groupColors[i]}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
