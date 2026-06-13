"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  GitHubIcon,
  LinkedInIcon,
  LeetCodeIcon,
  MailIcon,
} from "@/components/icons";
import { SITE } from "@/lib/constants";

/* ----------------------------------------------------------------------- */
/* Inline icons (kept local so the palette is self-contained)              */
/* ----------------------------------------------------------------------- */

function CommandGlyph({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function JumpIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 6h6v6" />
      <path d="m15 6-9 9" />
      <path d="M5 19h14" />
    </svg>
  );
}

function CopyIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function WaveIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12h2l2-5 4 14 4-18 3 9h5" />
    </svg>
  );
}

function SearchIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/* ----------------------------------------------------------------------- */
/* Command model                                                           */
/* ----------------------------------------------------------------------- */

interface CommandItem {
  id: string;
  label: string;
  group: "Navigate" | "Connect" | "Actions";
  icon: ReactNode;
  hint?: string;
  keywords?: string;
  run: () => void;
}

const GROUP_ORDER: CommandItem["group"][] = ["Navigate", "Connect", "Actions"];

export function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [isMac, setIsMac] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent));
  }, []);

  /* Track ambient-sound state broadcast by <AmbientSound /> */
  useEffect(() => {
    const onState = (e: Event) => {
      const detail = (e as CustomEvent<{ playing: boolean }>).detail;
      if (detail) setSoundOn(detail.playing);
    };
    window.addEventListener("portfolio:sound-state", onState);
    return () => window.removeEventListener("portfolio:sound-state", onState);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const openPalette = useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  /* Global hotkey: ⌘K / Ctrl+K — and let the navbar open us via event */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) restoreFocusRef.current = document.activeElement as HTMLElement | null;
          return !v;
        });
      }
    };
    const onOpen = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:open-command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:open-command", onOpen);
    };
  }, [openPalette]);

  /* Lock body scroll + autofocus input + restore focus on close */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(t);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  const go = useCallback(
    (id: string | null) => {
      close();
      // Defer so the overflow:hidden lock is released before we scroll.
      requestAnimationFrame(() => {
        if (!id) {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
          return;
        }
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    },
    [close, reduceMotion]
  );

  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
    });
  }, []);

  const openLink = useCallback((href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  }, []);

  const commands = useMemo<CommandItem[]>(() => {
    return [
      // Navigate
      { id: "top", label: "Go to Top", group: "Navigate", icon: <JumpIcon />, keywords: "home hero start", run: () => go(null) },
      { id: "about", label: "About", group: "Navigate", icon: <JumpIcon />, keywords: "who bio story", run: () => go("about") },
      { id: "projects", label: "Projects", group: "Navigate", icon: <JumpIcon />, keywords: "work built portfolio", run: () => go("projects") },
      { id: "skills", label: "Skills", group: "Navigate", icon: <JumpIcon />, keywords: "tech stack tools", run: () => go("skills") },
      { id: "contact", label: "Contact", group: "Navigate", icon: <JumpIcon />, keywords: "reach connect hire", run: () => go("contact") },
      // Connect
      { id: "github", label: "GitHub", group: "Connect", icon: <GitHubIcon size={18} />, hint: "open", keywords: "code repos source", run: () => { close(); openLink(SITE.github); } },
      { id: "linkedin", label: "LinkedIn", group: "Connect", icon: <LinkedInIcon size={18} />, hint: "open", keywords: "profile network job", run: () => { close(); openLink(SITE.linkedin); } },
      { id: "leetcode", label: "LeetCode", group: "Connect", icon: <LeetCodeIcon size={18} />, hint: "open", keywords: "dsa competitive problems", run: () => { close(); openLink(SITE.leetcode); } },
      { id: "email", label: "Email Me", group: "Connect", icon: <MailIcon size={18} />, hint: "mailto", keywords: "mail write hello reach", run: () => { close(); window.location.href = `mailto:${SITE.email}`; } },
      // Actions
      {
        id: "sound",
        label: soundOn ? "Stop Ambient Synthwave" : "Play Ambient Synthwave",
        group: "Actions",
        icon: <WaveIcon />,
        hint: soundOn ? "on" : "off",
        keywords: "music audio sound vibe play mute",
        run: () => { close(); window.dispatchEvent(new Event("portfolio:toggle-sound")); },
      },
      {
        id: "copy-email",
        label: "Copy Email Address",
        group: "Actions",
        icon: copied === "copy-email" ? <CheckIcon className="text-rose" /> : <CopyIcon />,
        hint: copied === "copy-email" ? "copied" : SITE.email,
        keywords: "clipboard mail",
        run: () => copy(SITE.email, "copy-email"),
      },
      {
        id: "copy-link",
        label: "Copy Link to This Site",
        group: "Actions",
        icon: copied === "copy-link" ? <CheckIcon className="text-rose" /> : <CopyIcon />,
        hint: copied === "copy-link" ? "copied" : "share",
        keywords: "url share clipboard",
        run: () => copy(typeof window !== "undefined" ? window.location.href : SITE.url, "copy-link"),
      },
    ];
  }, [go, close, openLink, copy, copied, soundOn]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    const tokens = q.split(/\s+/);
    return commands.filter((c) => {
      const hay = `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [query, commands]);

  // Reset highlight whenever the result set changes.
  useEffect(() => {
    setActive(0);
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const c of filtered) {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    }
    // Flatten in stable group order so the active index lines up with render.
    const flat: CommandItem[] = [];
    const sections: { group: string; items: CommandItem[] }[] = [];
    for (const g of GROUP_ORDER) {
      const items = map.get(g);
      if (items?.length) {
        sections.push({ group: g, items });
        flat.push(...items);
      }
    }
    return { flat, sections };
  }, [filtered]);

  const runActive = useCallback(() => {
    const item = grouped.flat[active];
    item?.run();
  }, [grouped.flat, active]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (grouped.flat.length ? (i + 1) % grouped.flat.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (grouped.flat.length ? (i - 1 + grouped.flat.length) % grouped.flat.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runActive();
      }
    },
    [close, grouped.flat.length, runActive]
  );

  // Keep the active row scrolled into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!mounted) return null;

  const modKey = isMac ? "⌘" : "Ctrl";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.15 }}
          aria-hidden={false}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close command palette"
            onClick={close}
            className="absolute inset-0 cursor-default bg-[#1c1503]/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onKeyDown}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl shadow-violet/10 ring-1 ring-white/40"
          >
            {/* Top accent line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-violet via-rose to-violet" />

            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3.5">
              <SearchIcon className="shrink-0 text-violet" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or jump to…"
                aria-label="Search commands"
                className="w-full bg-transparent font-sans text-base text-foreground outline-none placeholder:text-muted-dark"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden shrink-0 rounded-md border border-black/10 bg-white/60 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline-block">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {grouped.flat.length === 0 ? (
                <div className="px-3 py-10 text-center font-mono text-sm text-muted">
                  No matches for “{query}”
                </div>
              ) : (
                grouped.sections.map((section) => (
                  <div key={section.group} className="mb-1">
                    <div className="px-3 pb-1 pt-2 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-dark">
                      {section.group}
                    </div>
                    {section.items.map((item) => {
                      const idx = grouped.flat.indexOf(item);
                      const isActive = idx === active;
                      return (
                        <button
                          key={item.id}
                          data-idx={idx}
                          type="button"
                          onMouseMove={() => setActive(idx)}
                          onClick={item.run}
                          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-100 ${
                            isActive ? "bg-violet/12 text-foreground" : "text-muted hover:bg-black/[0.03]"
                          }`}
                        >
                          <span className={isActive ? "text-violet" : "text-muted-dark"}>
                            {item.icon}
                          </span>
                          <span className="flex-1 font-sans text-sm font-medium">{item.label}</span>
                          {item.hint && (
                            <span className="max-w-[45%] truncate font-mono text-[11px] text-muted-dark">
                              {item.hint}
                            </span>
                          )}
                          {isActive && (
                            <kbd className="hidden shrink-0 rounded-md border border-violet/20 bg-violet/10 px-1.5 py-0.5 font-mono text-[10px] text-violet sm:inline-block">
                              ↵
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between border-t border-black/5 px-4 py-2.5 font-mono text-[11px] text-muted-dark">
              <span className="flex items-center gap-1.5">
                <CommandGlyph size={12} className="text-violet" />
                Command Palette
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <span className="flex items-center gap-1"><Key>↑</Key><Key>↓</Key> navigate</span>
                <span className="flex items-center gap-1"><Key>↵</Key> select</span>
                <span className="flex items-center gap-1"><Key>{modKey}</Key><Key>K</Key> toggle</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-black/10 bg-white/60 px-1 py-0.5 font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}
