"use client";

import { useState } from "react";

export function PresentDeck({ slides }: { slides: React.ReactNode[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  function next() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }
  function back() {
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="present-deck">
      <div className="present-counter">
        {index + 1} / {total}
      </div>
      <div className="present-slide">{slides[index]}</div>
      <div className="present-controls">
        <button className="present-back-btn" onClick={back} disabled={index === 0} aria-label="Previous slide">
          ← Back
        </button>
        <button
          className="present-next-btn"
          onClick={next}
          disabled={index === total - 1}
          aria-label="Next slide"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
