"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-surface/70 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="font-heading text-xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-violet to-rose bg-clip-text text-transparent">
            PM
          </span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-mono text-sm transition-colors duration-200",
                  activeSection === link.href.slice(1)
                    ? "text-violet-light"
                    : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-violet to-rose" />
                )}
              </a>
            ))}
          </div>

          <ThemeToggle />

          {/* Command palette trigger — the ⌘K power-tool. On mobile this is
             the primary navigation entry point (the palette lists every
             section plus links & actions), replacing a hamburger menu. */}
          <button
            onClick={() => window.dispatchEvent(new Event("portfolio:open-command"))}
            aria-label="Open command palette and menu"
            className="glass flex h-11 w-11 cursor-pointer items-center justify-center gap-2 rounded-full text-muted transition-colors duration-200 hover:text-foreground sm:h-10 sm:w-auto sm:px-3"
          >
            <SearchIcon size={16} className="shrink-0" />
            <span className="hidden font-mono text-xs sm:inline">Quick nav</span>
            <kbd className="hidden rounded border border-black/10 bg-white/50 px-1.5 py-0.5 font-mono text-[10px] dark:border-white/15 dark:bg-white/10 sm:inline-block">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
        </div>
      </div>
    </nav>
  );
}
