"use client";

import { motion } from "framer-motion";

interface DeveloperAvatarProps {
  className?: string;
}

const floatAnimation = (delay: number, duration: number = 3) => ({
  y: [0, -8, 0],
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export function DeveloperAvatar({ className }: DeveloperAvatarProps) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="violet-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9a6700" />
            <stop offset="100%" stopColor="#d39e00" />
          </linearGradient>
          <linearGradient id="screen-glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9a6700" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d39e00" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="desk-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e0dc" />
            <stop offset="100%" stopColor="#d9d6d0" />
          </linearGradient>
        </defs>

        {/* Desk */}
        <rect x="60" y="280" width="280" height="12" rx="6" fill="url(#desk-grad)" stroke="#00000008" strokeWidth="1" />
        <rect x="120" y="292" width="8" height="50" rx="2" fill="#d4d1cc" />
        <rect x="272" y="292" width="8" height="50" rx="2" fill="#d4d1cc" />

        {/* Laptop base */}
        <rect x="110" y="258" width="180" height="22" rx="4" fill="#c8c5c0" stroke="#00000010" strokeWidth="1" />
        <rect x="170" y="268" width="60" height="4" rx="2" fill="#b5b2ad" />

        {/* Laptop screen */}
        <g>
          <rect x="125" y="148" width="150" height="110" rx="6" fill="#1a1a2e" stroke="#00000015" strokeWidth="1.5" />
          <rect x="133" y="156" width="134" height="94" rx="3" fill="url(#screen-glow)" />

          {/* Code lines on screen */}
          <rect x="143" y="168" width="50" height="3" rx="1.5" fill="#9a6700" opacity="0.7" />
          <rect x="143" y="178" width="80" height="3" rx="1.5" fill="#94a3b8" opacity="0.4" />
          <rect x="153" y="188" width="65" height="3" rx="1.5" fill="#d39e00" opacity="0.5" />
          <rect x="153" y="198" width="45" height="3" rx="1.5" fill="#94a3b8" opacity="0.3" />
          <rect x="153" y="208" width="70" height="3" rx="1.5" fill="#f59e0b" opacity="0.4" />
          <rect x="143" y="218" width="55" height="3" rx="1.5" fill="#9a6700" opacity="0.5" />
          <rect x="143" y="228" width="35" height="3" rx="1.5" fill="#94a3b8" opacity="0.3" />
          <rect x="143" y="238" width="60" height="3" rx="1.5" fill="#d39e00" opacity="0.4" />
        </g>

        {/* Character body - hoodie */}
        <path
          d="M175 230 C175 210, 165 185, 165 175 C165 155, 180 140, 200 135 C220 140, 235 155, 235 175 C235 185, 225 210, 225 230"
          fill="#3d2f12"
          stroke="#9a670040"
          strokeWidth="1"
        />

        {/* Hoodie details */}
        <path d="M195 155 L200 180 L205 155" fill="none" stroke="#9a670030" strokeWidth="1.5" />

        {/* Neck */}
        <rect x="192" y="128" width="16" height="12" rx="4" fill="#c9a87c" />

        {/* Head */}
        <ellipse cx="200" cy="110" rx="28" ry="30" fill="#d4b08c" />

        {/* Hair */}
        <path
          d="M172 105 C172 82, 185 72, 200 70 C215 72, 228 82, 228 105 C228 95, 222 85, 200 82 C178 85, 172 95, 172 105Z"
          fill="#1a1a2e"
        />
        <path d="M172 105 C170 100, 171 92, 175 87" fill="none" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />

        {/* Eyes */}
        <ellipse cx="189" cy="112" rx="3.5" ry="4" fill="#1a1a2e" />
        <ellipse cx="211" cy="112" rx="3.5" ry="4" fill="#1a1a2e" />
        <circle cx="190.5" cy="111" r="1.2" fill="white" opacity="0.8" />
        <circle cx="212.5" cy="111" r="1.2" fill="white" opacity="0.8" />

        {/* Eyebrows */}
        <path d="M184 106 Q189 103 194 106" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M206 106 Q211 103 216 106" fill="none" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth - slight smile */}
        <path d="M194 123 Q200 127 206 123" fill="none" stroke="#8b6f5a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Glasses */}
        <rect x="181" y="107" width="17" height="13" rx="3" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <rect x="203" y="107" width="17" height="13" rx="3" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M198 113 L203 113" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M181 113 L176 111" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M220 113 L225 111" fill="none" stroke="#94a3b8" strokeWidth="1.2" />

        {/* Arms reaching to laptop */}
        <path
          d="M170 195 C155 210, 140 240, 145 258"
          fill="none"
          stroke="#3d2f12"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M230 195 C245 210, 260 240, 255 258"
          fill="none"
          stroke="#3d2f12"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Hands */}
        <circle cx="148" cy="260" r="8" fill="#d4b08c" />
        <circle cx="252" cy="260" r="8" fill="#d4b08c" />

        {/* Coffee mug */}
        <g>
          <rect x="280" y="255" width="20" height="24" rx="3" fill="#9a6700" stroke="#9a670020" strokeWidth="1" />
          <path d="M300 262 C310 262, 310 272, 300 272" fill="none" stroke="#9a6700" strokeWidth="2.5" />
          {/* Steam */}
          <motion.path
            d="M286 252 Q288 246 286 240"
            fill="none"
            stroke="#9a670050"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M293 250 Q295 244 293 238"
            fill="none"
            stroke="#9a670050"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{ opacity: [0.5, 0.8, 0.5], y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </g>
      </svg>

      {/* Floating code symbols */}
      <motion.div
        className="absolute left-4 top-8 font-mono text-2xl font-bold text-violet/40"
        animate={floatAnimation(0, 3.5)}
      >
        {"{ }"}
      </motion.div>
      <motion.div
        className="absolute right-8 top-16 font-mono text-lg text-rose/30"
        animate={floatAnimation(0.8, 4)}
      >
        {"</>"}
      </motion.div>
      <motion.div
        className="absolute bottom-16 left-8 font-mono text-xl text-amber/25"
        animate={floatAnimation(1.5, 3)}
      >
        {"=>"}
      </motion.div>
      <motion.div
        className="absolute bottom-24 right-4 font-mono text-sm text-violet/30"
        animate={floatAnimation(0.5, 3.8)}
      >
        {"const"}
      </motion.div>
      <motion.div
        className="absolute left-16 top-[45%] font-mono text-xs text-rose/20"
        animate={floatAnimation(2, 4.2)}
      >
        {"async"}
      </motion.div>
    </div>
  );
}
