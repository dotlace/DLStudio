"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroToIntroTransitionProps {
  heroRef: React.RefObject<HTMLDivElement>;
  introRef: React.RefObject<HTMLDivElement>;
}

export default function HeroToIntroTransition({
  heroRef,
  introRef,
}: HeroToIntroTransitionProps) {
  useEffect(() => {
    if (!heroRef.current || !introRef.current) return;

    const hero = heroRef.current;
    const intro = introRef.current;

    // Position intro section behind hero initially (overlay it)
    const heroRect = hero.getBoundingClientRect();
    const heroTop = hero.offsetTop;
    
    gsap.set(intro, {
      position: "absolute",
      top: `${heroTop}px`,
      left: 0,
      width: "100%",
      minHeight: "100vh",
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
    });

    // Get the yellow cards - UXUI (first) and DESIGN (second)
    const cards = hero.querySelectorAll('[class*="bg-[#FFD700]"]');
    const uxuiCard = cards[0] as HTMLElement;
    const designCard = cards[1] as HTMLElement;

    // Reset initial transforms for GSAP control
    if (uxuiCard) {
      gsap.set(uxuiCard, { x: 0, y: 0, clearProps: "transform" });
    }
    if (designCard) {
      gsap.set(designCard, { x: 0, y: 0, clearProps: "transform" });
    }

    // Create ScrollTrigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const windowWidth = window.innerWidth;

        // UXUI card slides to the left
        if (uxuiCard) {
          const xOffset = -windowWidth * 1.5 * progress;
          const opacity = 1 - progress;
          const scale = 1 - progress * 0.2;

          gsap.set(uxuiCard, {
            x: xOffset,
            opacity: opacity,
            scale: scale,
            force3D: true,
          });
        }

        // DESIGN card slides to the right
        if (designCard) {
          const xOffset = windowWidth * 1.5 * progress;
          const opacity = 1 - progress;
          const scale = 1 - progress * 0.2;

          gsap.set(designCard, {
            x: xOffset,
            opacity: opacity,
            scale: scale,
            force3D: true,
          });
        }

        // Reveal intro section (fade in)
        gsap.set(intro, {
          opacity: progress,
          zIndex: progress > 0.3 ? 2 : 1,
          pointerEvents: progress > 0.5 ? "auto" : "none",
        });
      },
    });

    return () => {
      window.removeEventListener("resize", setupPosition);
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === hero) {
          trigger.kill();
        }
      });
    };
  }, [heroRef, introRef]);

  return null;
}
