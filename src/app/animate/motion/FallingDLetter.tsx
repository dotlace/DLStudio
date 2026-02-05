"use client";

import { useEffect, useState } from "react";

interface FallingDLetterProps {
  heroDRef: React.RefObject<HTMLElement>;
  basketRef: React.RefObject<HTMLDivElement>;
  onCollected?: () => void;
}

export default function FallingDLetter({ heroDRef, basketRef, onCollected }: FallingDLetterProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroDRef.current || !basketRef.current || isCollected) return;

      const heroRect = heroDRef.current.getBoundingClientRect();
      const basketRect = basketRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate when animation should start (when hero D is scrolled past)
      const heroBottom = heroRect.bottom + scrollY;
      const animationStart = heroBottom - windowHeight * 0.5;
      const animationEnd = heroBottom + windowHeight * 1.5;
      const totalDistance = animationEnd - animationStart;

      if (scrollY < animationStart) {
        setIsVisible(false);
        setScrollProgress(0);
        return;
      }

      if (scrollY > animationEnd) {
        setIsVisible(true);
        setScrollProgress(1);
        // Collect the letter when it reaches the basket
        if (!isCollected && onCollected) {
          setIsCollected(true);
          onCollected();
        }
        return;
      }

      setIsVisible(true);
      const progress = (scrollY - animationStart) / totalDistance;
      setScrollProgress(Math.max(0, Math.min(1, progress)));

      // Collect when progress is near completion
      if (progress > 0.95 && !isCollected && onCollected) {
        setIsCollected(true);
        onCollected();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [heroDRef, basketRef, onCollected, isCollected]);

  if (!isVisible || !heroDRef.current || !basketRef.current || isCollected) {
    return null;
  }

  const heroRect = heroDRef.current.getBoundingClientRect();
  const basketRect = basketRef.current.getBoundingClientRect();

  // Start position (center of hero D)
  const startX = heroRect.left + heroRect.width / 2;
  const startY = heroRect.top + heroRect.height / 2;

  // End position (center of basket)
  const endX = basketRect.left + basketRect.width / 2;
  const endY = basketRect.top + basketRect.height / 2;

  // Interpolate positions
  const currentX = startX + (endX - startX) * scrollProgress;
  const currentY = startY + (endY - startY) * scrollProgress;

  // Scale down as it approaches basket
  const scale = 1 - (scrollProgress * 0.7);

  return (
    <div
      style={{
        position: "fixed",
        top: `${currentY}px`,
        left: `${currentX}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 1000,
        pointerEvents: "none",
        transition: scrollProgress > 0.95 ? "all 0.3s ease-out" : "none",
        opacity: 1 - scrollProgress * 0.3,
      }}
      className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl laptop:text-[9rem] desktop:text-[10rem] ultrawide:text-[11rem] font-bold uppercase text-black"
    >
      D
    </div>
  );
}
