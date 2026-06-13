"use client";

import { useState, useEffect, useCallback } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";

/*
 * Light/dark theme toggle. The actual `.dark` class is set on <html> by an
 * inline no-FOUC script in the root layout before paint; this component just
 * reads/flips that class and persists the choice to localStorage.
 * It can also be toggled from the command palette via a custom event.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const apply = useCallback((next: boolean) => {
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable — ignore */
    }
    setDark(next);
    window.dispatchEvent(
      new CustomEvent("portfolio:theme-state", { detail: { dark: next } })
    );
  }, []);

  const toggle = useCallback(() => {
    apply(!document.documentElement.classList.contains("dark"));
  }, [apply]);

  // Let the command palette flip the theme too.
  useEffect(() => {
    const handler = () => toggle();
    window.addEventListener("portfolio:toggle-theme", handler);
    return () => window.removeEventListener("portfolio:toggle-theme", handler);
  }, [toggle]);

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="glass flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-violet transition-colors duration-200 hover:text-violet-light sm:h-10 sm:w-10"
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted && dark ? <SunIcon size={17} /> : <MoonIcon size={17} />}
    </button>
  );
}
