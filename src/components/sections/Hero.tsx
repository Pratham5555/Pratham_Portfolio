"use client";

import { motion } from "framer-motion";
import { TypeWriter } from "@/components/ui/TypeWriter";
import { DeveloperAvatar } from "@/components/avatar/DeveloperAvatar";

const phrases = [
  "Full-Stack Developer",
  "MERN Stack Engineer",
  "Real-Time Systems Builder",
  "Mobile App Developer",
  "Problem Solver",
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Background gradient blobs */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet/15 blur-[120px]"
        style={{ animation: "blob-drift 8s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-cyan/10 blur-[120px]"
        style={{ animation: "blob-drift 10s ease-in-out infinite 2s" }}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Text content */}
        <div className="flex flex-col justify-center">
          <motion.p
            {...fadeUp(0.1)}
            className="mb-2 font-mono text-sm text-violet"
          >
            Hey there, I&apos;m
          </motion.p>

          <motion.h1
            {...fadeUp(0.2)}
            className="mb-4 font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted bg-clip-text text-transparent">
              Pratham
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">
              Maheshwari
            </span>
          </motion.h1>

          <motion.div
            {...fadeUp(0.4)}
            className="mb-6 h-8 font-heading text-xl font-medium text-muted md:text-2xl"
          >
            <TypeWriter phrases={phrases} />
          </motion.div>

          <motion.p
            {...fadeUp(0.5)}
            className="mb-8 max-w-lg text-base leading-relaxed text-muted"
          >
            CS undergrad at JIIT Noida who builds full-stack web apps,
            real-time systems, and mobile experiences. I like turning
            everyday frustrations into software that actually works.
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-gradient-to-r from-violet to-violet-light px-6 py-3 font-mono text-sm font-medium text-white shadow-lg shadow-violet/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet/30"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border px-6 py-3 font-mono text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-violet/40 hover:text-foreground"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          <DeveloperAvatar className="relative h-72 w-72 md:h-80 md:w-80 lg:h-96 lg:w-96" />
        </motion.div>
      </div>
    </section>
  );
}
