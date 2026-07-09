"use client";

import { useEffect, useRef, useState } from "react";

export function SlideDeck({ slides }: { slides: React.ReactNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: clamped * el.clientHeight, behavior: "smooth" });
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(active + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(active - 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo reads latest `active` via closure over containerRef only
  }, [active, slides.length]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    if (index !== active) setActive(index);
  }

  return (
    <div className="slide-deck" ref={containerRef} onScroll={handleScroll}>
      {slides.map((slide, i) => (
        <section className="slide" key={i}>
          {slide}
        </section>
      ))}
      <div className="slide-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slide-dot${i === active ? " active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
