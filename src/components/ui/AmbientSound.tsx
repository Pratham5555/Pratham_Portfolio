"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/*
 * Headless ambient-sound controller. There is intentionally NO visible
 * button — playback is toggled exclusively from the command palette
 * (the floating button was removed because it drifted on iOS scroll).
 *
 *  - Listens for the `portfolio:toggle-sound` event to start/stop.
 *  - Broadcasts `portfolio:sound-state` so the palette label can sync.
 *  - Defaults to OFF (browsers block autoplay anyway).
 *
 * Arrangement is a relaxed synthwave: moderate energy (steady kick + bass)
 * but a sparse 8th-note lead instead of the previous busy 16th-note arp —
 * fewer notes "in between", easier on the ears for ambient listening.
 */

const BPM = 112; // relaxed groove (was 124)
const STEP = 60 / BPM / 4; // 16th-note grid

// Chord progression: Am → F → C → G (each chord = 1 bar = 16 steps)
const CHORDS: number[][] = [
  [220, 261.63, 329.63], // Am: A3 C4 E4
  [174.61, 220, 261.63], // F:  F3 A3 C4
  [261.63, 329.63, 392], // C:  C4 E4 G4
  [196, 246.94, 293.66], // G:  G3 B3 D4
];
const BASS_ROOTS = [55, 43.65, 65.41, 49]; // A1 F1 C2 G1

function buildSynthwave(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 2.5);
  master.connect(ctx.destination);

  // Stereo-ish delay for width
  const delay = ctx.createDelay(1);
  delay.delayTime.value = STEP * 3; // dotted-eighth feel
  const delayFb = ctx.createGain();
  delayFb.gain.value = 0.28;
  const delayOut = ctx.createGain();
  delayOut.gain.value = 0.18;
  delay.connect(delayFb);
  delayFb.connect(delay);
  delay.connect(delayOut);
  delayOut.connect(master);

  // Lead filter — resonant lowpass for that classic synth sweep
  const leadFilter = ctx.createBiquadFilter();
  leadFilter.type = "lowpass";
  leadFilter.frequency.value = 1600;
  leadFilter.Q.value = 3.5;
  leadFilter.connect(master);
  leadFilter.connect(delay);

  // Filter LFO — slow sweep up and down
  const filterLfo = ctx.createOscillator();
  const filterLfoGain = ctx.createGain();
  filterLfo.frequency.value = 0.12;
  filterLfoGain.gain.value = 700;
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

      // ---- Lead melody: sparse 8th notes (every other step) ----
      if (beatInBar % 2 === 0) {
        const arpNotes = [...chord, chord[0] * 2];
        const arpFreq = arpNotes[(beatInBar / 2) % arpNotes.length];

        const leadOsc = ctx.createOscillator();
        const leadOsc2 = ctx.createOscillator();
        const leadEnv = ctx.createGain();
        leadOsc.type = "sawtooth";
        leadOsc2.type = "sawtooth";
        leadOsc.frequency.value = arpFreq;
        leadOsc2.frequency.value = arpFreq * 1.005; // slight detune for width
        leadEnv.gain.setValueAtTime(0, nextTime);
        leadEnv.gain.linearRampToValueAtTime(0.045, nextTime + 0.015);
        leadEnv.gain.exponentialRampToValueAtTime(0.001, nextTime + STEP * 1.7);
        leadOsc.connect(leadEnv);
        leadOsc2.connect(leadEnv);
        leadEnv.connect(leadFilter);
        leadOsc.start(nextTime);
        leadOsc2.start(nextTime);
        leadOsc.stop(nextTime + STEP * 2);
        leadOsc2.stop(nextTime + STEP * 2);
      }

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

      // ---- Kick (steady pulse on beats 1 & 9 — the "energy") ----
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

export function AmbientSound() {
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

  // Toggle in response to the command palette.
  useEffect(() => {
    const handler = () => {
      if (isPlaying) stop();
      else start();
    };
    window.addEventListener("portfolio:toggle-sound", handler);
    return () => window.removeEventListener("portfolio:toggle-sound", handler);
  }, [isPlaying, start, stop]);

  // Broadcast play state so the palette shows the right label.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:sound-state", { detail: { playing: isPlaying } })
    );
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (stopArpRef.current) stopArpRef.current();
      ctxRef.current?.close();
    };
  }, []);

  return null;
}
