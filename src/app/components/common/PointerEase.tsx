"use client";

import { useEffect, useRef } from "react";

const PointerEase = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    if (window.matchMedia("(pointer: coarse)").matches) {
      ring.style.display = "none";
      dot.style.display = "none";
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = 0;

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const animate = () => {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * 0.08;
      ringY += dy * 0.08;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMove);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-9999 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-10000 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ willChange: "transform" }}
      />
    </>
  );
};

export default PointerEase;
