"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  GitHubIcon,
  LinkedInIcon,
  LeetCodeIcon,
  MailIcon,
} from "@/components/icons";
import { socialLinks } from "@/data/social";

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  leetcode: LeetCodeIcon,
  mail: MailIcon,
};

export function Contact() {
  return (
    <section id="contact" className="relative py-20 lg:py-28">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute -bottom-20 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-violet/8 blur-[120px]"
        style={{ animation: "blob-drift 10s ease-in-out infinite" }}
      />

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader label="// contact" title="Let&apos;s Connect" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-muted">
            I&apos;m always open to interesting conversations, collaboration
            opportunities, or just a friendly hello. Feel free to reach out.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              return (
                <motion.div
                  key={link.label}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    target={link.icon !== "mail" ? "_blank" : undefined}
                    rel={link.icon !== "mail" ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 transition-colors duration-200 hover:border-violet/30 hover:bg-card-hover"
                    aria-label={link.label}
                  >
                    <Icon
                      size={20}
                      className="text-muted transition-colors group-hover:text-violet-light"
                    />
                    <span className="font-mono text-sm text-muted transition-colors group-hover:text-foreground">
                      {link.label}
                    </span>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <a
            href="mailto:pratham.maheshwari5@gmail.com"
            className="inline-block rounded-full bg-gradient-to-r from-violet to-cyan px-8 py-3 font-mono text-sm font-medium text-white shadow-lg shadow-violet/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet/30"
          >
            Say Hello
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
