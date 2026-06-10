"use client";

import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";

const interests = [
  "Full-Stack Development",
  "Real-time Systems",
  "Mobile Apps",
  "Photography",
  "Poetry",
  "Competitive Programming",
];

export function About() {
  return (
    <section id="about" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader label="// about me" title="Who I Am" />
        </AnimatedSection>

        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Photo */}
          <AnimatedSection className="flex justify-center lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet via-cyan to-violet opacity-50 blur-sm" style={{ animation: "gradient-ring 6s linear infinite" }} />
              <div className="relative h-56 w-56 overflow-hidden rounded-full border-2 border-white md:h-64 md:w-64">
                <Image
                  src="/dp.jpeg"
                  alt="Pratham Maheshwari"
                  fill
                  className="object-cover object-[center_15%]"
                  priority
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection delay={0.15} className="lg:col-span-3">
            <div className="space-y-4 text-base leading-relaxed text-muted">
              <p>
                I&apos;m a final-year CS undergrad at JIIT Noida who got into programming
                through competitive coding — started with C++ on LeetCode, got hooked on
                the puzzle-solving, and eventually wanted to build things people actually
                use. That&apos;s when I picked up JavaScript and dove into full-stack
                development.
              </p>
              <p>
                Over the past couple of years, I&apos;ve gone from building REST APIs to
                real-time collaborative editors to a mobile app that classifies waste using
                on-device ML. I interned at The Schedio in Mumbai over the summer, where I
                worked on responsive frontends and learned what shipping production code in
                sprint cycles actually feels like.
              </p>
              <p>
                When I&apos;m not coding, I&apos;m usually out with my camera or scribbling
                poetry. I believe the best software comes from people who notice details —
                and photography taught me that.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="glass rounded-full px-3 py-1 font-mono text-xs text-muted transition-colors hover:text-violet-light hover:shadow-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
