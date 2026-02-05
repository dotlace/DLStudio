'use client';

import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Ordinary from "@/app/sections/Intro/TextDesign/Ordinary";

gsap.registerPlugin(ScrollTrigger);

interface LandingIntroProps {}

const LandingIntro = forwardRef<HTMLDivElement, LandingIntroProps>((props, sectionRef) => {
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const explore = exploreRef.current;
    if (!explore) return;

    // Initial hidden state for reveal
    gsap.set(explore, { clipPath: "inset(100% 0 0 0)", opacity: 0 });

    const hero = document.getElementById("hero");
    if (!hero) {
      gsap.set(explore, { clipPath: "inset(0 0 0 0)", opacity: 1 });
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=500",
      scrub: 1,
      onUpdate: (self) => {
        const progress = Math.max(0, self.progress - 0.3);
        const clipValue = (1 - progress * 1.5) * 100;
        explore.style.clipPath = `inset(${Math.max(0, clipValue)}% 0 0 0)`;
        const opacity = Math.min(progress * 2, 1);
        explore.style.opacity = opacity.toString();
      },
    });

    const intro = document.getElementById("intro");
    const parallaxTween = intro
      ? gsap.to(explore, {
          y: -200,
          ease: "none",
          scrollTrigger: {
            trigger: intro,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        })
      : null;

    return () => {
      trigger.kill();
      if (parallaxTween) {
        parallaxTween.scrollTrigger?.kill();
        parallaxTween.kill();
      }
    };
  }, []);

  return (
    <div
      id="intro"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black"
      style={{ zIndex: 20 }}
    >
      {/* EXPLORE Text - placed at top of intro */}
      <div
        ref={exploreRef}
        className="absolute top-0 left-0 right-0 flex items-start justify-center z-30 pointer-events-none overflow-visible pt-0 -translate-y-2"
      >
        <div
          className="font-orbitron font-semibold text-white/25 tracking-tight whitespace-nowrap select-none leading-[0.8]"
          style={{ fontSize: "14vw" }}
        >
         DOTLACE

        </div>
      </div>

      <div className="relative w-full h-[2vh] md:h-[4vh]" />
      <div className="mt-16 md:mt-24">
        <Ordinary />
      </div>
    </div>
  );
});

LandingIntro.displayName = "LandingIntro";
export default LandingIntro;
