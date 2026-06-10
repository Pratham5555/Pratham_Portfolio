"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const BPM = 124;
const STEP = 60 / BPM / 4; // 16th-note duration

// Chord progression: Am → F → C → G (each chord = 1 bar = 16 steps)
const CHORDS: number[][] = [
  [220, 261.63, 329.63],    // Am: A3 C4 E4
  [174.61, 220, 261.63],    // F:  F3 A3 C4
  [261.63, 329.63, 392],    // C:  C4 E4 G4
  [196, 246.94, 293.66],    // G:  G3 B3 D4
];
const BASS_ROOTS = [55, 43.65, 65.41, 49];  // A1 F1 C2 G1

function buildSynthwave(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 2.5);
  master.connect(ctx.destination);

  // Stereo delay for width
  const delay = ctx.createDelay(1);
  delay.delayTime.value = STEP * 3; // dotted-eighth feel
  const delayFb = ctx.createGain();
  delayFb.gain.value = 0.3;
  const delayOut = ctx.createGain();
  delayOut.gain.value = 0.2;
  delay.connect(delayFb);
  delayFb.connect(delay);
  delay.connect(delayOut);
  delayOut.connect(master);

  // Lead filter — resonant lowpass for that classic synth sweep
  const leadFilter = ctx.createBiquadFilter();
  leadFilter.type = "lowpass";
  leadFilter.frequency.value = 1800;
  leadFilter.Q.value = 4;
  leadFilter.connect(master);
  leadFilter.connect(delay);

  // Filter LFO — slow sweep up and down
  const filterLfo = ctx.createOscillator();
  const filterLfoGain = ctx.createGain();
  filterLfo.frequency.value = 0.15;
  filterLfoGain.gain.value = 800;
  filterLfo.connect(filterLfoGain);
  filterLfoGain.connect(leadFilter.frequency);
  filterLfo.start();

  // Pad bus — warm detuned sawtooths behind everything
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 600;
  padFilter.Q.value = 0.5;
  padFilter.connect(master);

  // Bass bus
  const bassFilter = ctx.createBiquadFilter();
  bassFilter.type = "lowpass";
  bassFilter.frequency.value = 250;
  bassFilter.Q.value = 1;
  bassFilter.connect(master);

  return { master, delay, leadFilter, padFilter, bassFilter };
}

function startSynthwave(
  ctx: AudioContext,
  nodes: {
    master: GainNode;
    delay: DelayNode;
    leadFilter: BiquadFilterNode;
    padFilter: BiquadFilterNode;
    bassFilter: BiquadFilterNode;
  }
): () => void {
  let step = 0;
  let nextTime = ctx.currentTime + 0.8;
  let running = true;
  let currentPadOscs: OscillatorNode[] = [];

  const { master, leadFilter, padFilter, bassFilter } = nodes;

  const tick = () => {
    if (!running) return;

    while (nextTime < ctx.currentTime + 0.15) {
      const bar = Math.floor(step / 16) % CHORDS.length;
      const beatInBar = step % 16;
      const chord = CHORDS[bar];

      // ---- Lead arpeggio (16th notes, cycling through chord tones + octave) ----
      const arpNotes = [...chord, chord[0] * 2];
      const arpFreq = arpNotes[beatInBar % arpNotes.length];

      const leadOsc = ctx.createOscillator();
      const leadOsc2 = ctx.createOscillator();
      const leadEnv = ctx.createGain();
      leadOsc.type = "sawtooth";
      leadOsc2.type = "sawtooth";
      leadOsc.frequency.value = arpFreq;
      leadOsc2.frequency.value = arpFreq * 1.005; // slight detune for width
      leadEnv.gain.setValueAtTime(0, nextTime);
      leadEnv.gain.linearRampToValueAtTime(0.04, nextTime + 0.01);
      leadEnv.gain.exponentialRampToValueAtTime(0.001, nextTime + STEP * 0.85);
      leadOsc.connect(leadEnv);
      leadOsc2.connect(leadEnv);
      leadEnv.connect(leadFilter);
      leadOsc.start(nextTime);
      leadOsc2.start(nextTime);
      leadOsc.stop(nextTime + STEP);
      leadOsc2.stop(nextTime + STEP);

      // ---- Bass (hits on beats 1, 5, 9, 13 — quarter notes) ----
      if (beatInBar % 4 === 0) {
        const bassFreq = BASS_ROOTS[bar];
        const bassOsc = ctx.createOscillator();
        const bassOsc2 = ctx.createOscillator();
        const bassEnv = ctx.createGain();
        bassOsc.type = "sawtooth";
        bassOsc2.type = "square";
        bassOsc.frequency.value = bassFreq;
        bassOsc2.frequency.value = bassFreq;
        bassEnv.gain.setValueAtTime(0, nextTime);
        bassEnv.gain.linearRampToValueAtTime(0.12, nextTime + 0.01);
        bassEnv.gain.exponentialRampToValueAtTime(0.001, nextTime + STEP * 3.5);
        bassOsc.connect(bassEnv);
        bassOsc2.connect(bassEnv);
        bassEnv.connect(bassFilter);
        bassOsc.start(nextTime);
        bassOsc2.start(nextTime);
        bassOsc.stop(nextTime + STEP * 4);
        bassOsc2.stop(nextTime + STEP * 4);
      }

      // ---- Pad chord (sustain for entire bar, swap on bar change) ----
      if (beatInBar === 0) {
        currentPadOscs.forEach((o) => {
          try { o.stop(nextTime + 0.05); } catch { /* already stopped */ }
        });
        currentPadOscs = [];

        chord.forEach((freq) => {
          [freq, freq * 1.003, freq * 0.997].forEach((f) => {
            const padOsc = ctx.createOscillator();
            const padGain = ctx.createGain();
            padOsc.type = "sawtooth";
            padOsc.frequency.value = f;
            padGain.gain.setValueAtTime(0, nextTime);
            padGain.gain.linearRampToValueAtTime(0.012, nextTime + STEP * 4);
            padGain.gain.linearRampToValueAtTime(0.008, nextTime + STEP * 16);
            padOsc.connect(padGain);
            padGain.connect(padFilter);
            padOsc.start(nextTime);
            padOsc.stop(nextTime + STEP * 17);
            currentPadOscs.push(padOsc);
          });
        });
      }

      // ---- Kick ghost (sub-bass thump on beats 1, 9) ----
      if (beatInBar === 0 || beatInBar === 8) {
        const kickOsc = ctx.createOscillator();
        const kickEnv = ctx.createGain();
        kickOsc.type = "sine";
        kickOsc.frequency.setValueAtTime(120, nextTime);
        kickOsc.frequency.exponentialRampToValueAtTime(40, nextTime + 0.08);
        kickEnv.gain.setValueAtTime(0.15, nextTime);
        kickEnv.gain.exponentialRampToValueAtTime(0.001, nextTime + 0.2);
        kickOsc.connect(kickEnv);
        kickEnv.connect(master);
        kickOsc.start(nextTime);
        kickOsc.stop(nextTime + 0.25);
      }

      step++;
      nextTime += STEP;
    }

    setTimeout(tick, 40);
  };

  tick();
  return () => {
    running = false;
    currentPadOscs.forEach((o) => {
      try { o.stop(); } catch { /* already stopped */ }
    });
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

    const nodes = buildSynthwave(ctx);
    masterRef.current = nodes.master;
    stopArpRef.current = startSynthwave(ctx, nodes);
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
     * recalculates from children.
     * NO transform/will-change here — on iOS Safari, applying any CSS
     * transform to a position:fixed element makes it behave as
     * position:absolute (scrolls with page). Keep it transform-free.
     * bottom/right use env() safe-area so the button clears the iOS
     * home indicator on notched phones.
     */
    <div
      className="sound-container fixed z-50"
      style={{
        bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        right: "calc(0.75rem + env(safe-area-inset-right, 0px))",
        willChange: "transform",
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

      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-violet/20 to-cyan/15"
        animate={{ opacity: isPlaying ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <button
        onClick={toggle}
        aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
        title={isPlaying ? "Sound on — click to mute" : "Play ambient sound"}
        className="glass-strong absolute inset-0 flex cursor-pointer items-center justify-center rounded-full shadow-lg shadow-black/10 transition-all duration-200 hover:scale-110 hover:shadow-violet/15 active:scale-90"
        style={{ touchAction: "manipulation" }}
      >
        <span className="relative z-10">
          {isPlaying ? <SoundOnIcon /> : <SoundOffIcon />}
        </span>
      </button>
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
      className="text-violet"
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
