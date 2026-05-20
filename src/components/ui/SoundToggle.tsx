"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// A-minor pentatonic: A4, C5, E5, G5, A5, C6
const ARPEGGIO_NOTES = [440, 523.25, 659.25, 783.99, 880, 1046.5];
// ascending + descending (without repeating endpoints) for a smooth loop
const NOTE_SEQUENCE = [
  ...ARPEGGIO_NOTES,
  ...ARPEGGIO_NOTES.slice(1, -1).reverse(),
];
const NOTE_SPACING = 1.15; // seconds between arpeggio notes

function buildAmbient(ctx: AudioContext) {
  // Master bus
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 3);
  master.connect(ctx.destination);

  // Feedback delay (simulates reverb tail)
  const delay = ctx.createDelay(2.5);
  delay.delayTime.value = 0.42;
  const delayFb = ctx.createGain();
  delayFb.gain.value = 0.38;
  const delayOut = ctx.createGain();
  delayOut.gain.value = 0.28;
  delay.connect(delayFb);
  delayFb.connect(delay);
  delay.connect(delayOut);
  delayOut.connect(master);

  // Warm lowpass filter on the pad bus
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 1100;
  padFilter.Q.value = 0.8;
  padFilter.connect(master);
  padFilter.connect(delay);

  // Bass drone — A1 (55 Hz) slightly detuned x3 for stereo width
  [55, 55.35, 54.65].forEach((freq) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.value = 0.28;
    osc.connect(g);
    g.connect(padFilter);
    osc.start();
  });

  // Mid pad — A2 (110 Hz) + E3 (165 Hz) for harmonic depth
  [110, 110.5, 109.5, 165].forEach((freq) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = freq === 165 ? "triangle" : "sine";
    osc.frequency.value = freq;
    g.gain.value = freq === 165 ? 0.045 : 0.07;
    osc.connect(g);
    g.connect(padFilter);
    osc.start();
  });

  // Air shimmer — A5 (880 Hz), barely audible
  const shimmer = ctx.createOscillator();
  const shimmerG = ctx.createGain();
  shimmer.type = "sine";
  shimmer.frequency.value = 880;
  shimmerG.gain.value = 0.01;
  shimmer.connect(shimmerG);
  shimmerG.connect(master);
  shimmer.start();

  // Slow LFO — gives the pad a breathing quality
  const lfo = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.frequency.value = 0.07;
  lfoG.gain.value = 0.055;
  lfo.connect(lfoG);
  lfoG.connect(master.gain);
  lfo.start();

  return { master, delay };
}

function startArpeggio(
  ctx: AudioContext,
  master: GainNode,
  delay: DelayNode
): () => void {
  let noteIndex = 0;
  let nextTime = ctx.currentTime + 1.8;
  let running = true;

  const tick = () => {
    if (!running) return;
    while (nextTime < ctx.currentTime + 0.18) {
      const freq = NOTE_SEQUENCE[noteIndex % NOTE_SEQUENCE.length];
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, nextTime);
      env.gain.linearRampToValueAtTime(0.038, nextTime + 0.05);
      env.gain.exponentialRampToValueAtTime(0.0001, nextTime + NOTE_SPACING * 0.88);
      osc.connect(env);
      env.connect(delay);
      env.connect(master);
      osc.start(nextTime);
      osc.stop(nextTime + NOTE_SPACING);
      noteIndex++;
      nextTime += NOTE_SPACING;
    }
    setTimeout(tick, 55);
  };

  tick();
  return () => {
    running = false;
  };
}

export function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopArpRef = useRef<(() => void) | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(async () => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();
    if (ctx.state === "suspended") await ctx.resume();
    ctxRef.current = ctx;

    const { master, delay } = buildAmbient(ctx);
    masterRef.current = master;
    stopArpRef.current = startArpeggio(ctx, master, delay);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (stopArpRef.current) {
      stopArpRef.current();
      stopArpRef.current = null;
    }
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 1.6);
      fadeTimerRef.current = setTimeout(() => {
        ctx.close();
        ctxRef.current = null;
        masterRef.current = null;
      }, 1700);
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  }, [isPlaying, start, stop]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (stopArpRef.current) stopArpRef.current();
      ctxRef.current?.close();
    };
  }, []);

  return (
    /*
     * Outer shell: fixed position, explicit pixel size so it NEVER
     * recalculates from children. overflow-visible so rings paint
     * outside without creating a scroll-trigger.
     * Safe-area padding for iOS notches/home bars.
     */
    <div
      className="fixed z-50"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))",
        right: "max(1.25rem, env(safe-area-inset-right, 1.25rem))",
        width: 48,
        height: 48,
        /* Promote to its own GPU layer — prevents repaint jank */
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      {/*
       * Pulse rings: always in DOM (no AnimatePresence / no DOM
       * insertion jank). Active state is toggled via CSS class so
       * the browser handles the animation entirely on the compositor
       * thread — zero JS involvement, zero layout impact.
       * animation-delay staggers the three rings.
       */}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`sound-ring pointer-events-none absolute inset-0 rounded-full border border-violet/30${isPlaying ? " active" : ""}`}
          style={{
            animationDelay: `${i * 0.85}s`,
            transformOrigin: "center center",
          }}
        />
      ))}

      {/* Inner glow overlay — always mounted, opacity toggled smoothly */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-violet/25 to-cyan/20"
        animate={{ opacity: isPlaying ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* The actual button — absolute inset-0 so it never resizes the container */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
        title={isPlaying ? "Sound on — click to mute" : "Play ambient sound"}
        className="absolute inset-0 flex items-center justify-center rounded-full border border-border bg-card shadow-lg shadow-black/40 backdrop-blur-sm transition-colors hover:border-violet/40 hover:bg-card-hover"
        style={{ touchAction: "manipulation" }}
      >
        <span className="relative z-10">
          {isPlaying ? <SoundOnIcon /> : <SoundOffIcon />}
        </span>
      </motion.button>
    </div>
  );
}

function SoundOnIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-violet-light"
    >
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        fill="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.4, delay: 0.2, repeat: Infinity, ease: "easeInOut" as const }}
      />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-muted"
    >
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        fill="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="23"
        y1="9"
        x2="17"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="9"
        x2="23"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
