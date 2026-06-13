"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "@/components/icons";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
        <a href="#" className="font-heading text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet to-rose bg-clip-text text-transparent">
            PM
          </span>
        </a>

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

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted transition-colors hover:text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface/90 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-3 font-mono text-sm transition-colors",
                  activeSection === link.href.slice(1)
                    ? "text-violet-light"
                    : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
