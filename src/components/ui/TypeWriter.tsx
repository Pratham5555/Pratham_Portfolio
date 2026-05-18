"use client";

import { useState, useEffect } from "react";

interface TypeWriterProps {
  phrases: string[];
  className?: string;
}

export function TypeWriter({ phrases, className }: TypeWriterProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentPhrase];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentChar < phrase.length) {
            setCurrentChar((prev) => prev + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          if (currentChar > 0) {
            setCurrentChar((prev) => prev - 1);
          } else {
            setIsDeleting(false);
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentPhrase, phrases]);

  return (
    <span className={className}>
      {phrases[currentPhrase].substring(0, currentChar)}
      <span className="animate-pulse text-violet">|</span>
    </span>
  );
}
