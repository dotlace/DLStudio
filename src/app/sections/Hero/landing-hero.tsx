'use client';

import { useEffect, useRef, useState, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AbstractBackground from "@/app/sections/Hero/background/AbstractBackground";
import CircleNetwork from "@/app/sections/Hero/Drawing/CircleNetwork";
import VerticalText from "@/app/sections/Hero/TextAnimations/VerticalText";
import PhaseBend from "@/app/sections/Hero/PhaseBend/PhaseBend";
import PhaseIndicator from "@/app/sections/Hero/PhaseBend/PhaseIndicator";

gsap.registerPlugin(ScrollTrigger);

interface LandingHeroProps {}

const LandingHero = forwardRef<HTMLDivElement, LandingHeroProps>((props, sectionRef) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const upperTextRef = useRef<HTMLDivElement>(null);
  const lowerTextRef = useRef<HTMLDivElement>(null);
  const bottomLeftTextRef = useRef<HTMLDivElement>(null);
  const phasesRef = useRef<HTMLDivElement>(null);
  const phase001Ref = useRef<HTMLDivElement>(null);
  const phase004Ref = useRef<HTMLDivElement>(null);
  const visualAutoRevealDone = useRef(false);
  const visualScrollEngaged = useRef(false);

  // Refs for "I BREAK THINGS..." lines
  const breakLine1Ref = useRef<HTMLDivElement>(null);
  const breakLine2Ref = useRef<HTMLDivElement>(null);
  const breakLine3Ref = useRef<HTMLDivElement>(null);
  const breakLine4Ref = useRef<HTMLDivElement>(null);
  const breakLine5Ref = useRef<HTMLDivElement>(null);
  const breakLine6Ref = useRef<HTMLDivElement>(null);
  const breakLine7Ref = useRef<HTMLDivElement>(null);
  const breakLine8Ref = useRef<HTMLDivElement>(null);

  // Refs for "VISUAL EXPERIMENTS..." list items
  const visualExp1Ref = useRef<HTMLDivElement>(null);
  const visualExp2Ref = useRef<HTMLDivElement>(null);
  const visualExp3Ref = useRef<HTMLDivElement>(null);
  const visualExp4Ref = useRef<HTMLDivElement>(null);
  const visualExp6Ref = useRef<HTMLDivElement>(null);
  // Ref for IDX/AK section
  const idxAkRef = useRef<HTMLDivElement>(null);

  const [backgroundRevealed, setBackgroundRevealed] = useState(false);
  const [lowerTextRevealed, setLowerTextRevealed] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const background = backgroundRef.current;
    const rightText = rightTextRef.current;
    const upperText = upperTextRef.current;
    const lowerText = lowerTextRef.current;
    const bottomLeftText = bottomLeftTextRef.current;
    const phases = phasesRef.current;
    const phase001 = phase001Ref.current;
    const phase004 = phase004Ref.current;

    // Break lines
    const breakLine1 = breakLine1Ref.current;
    const breakLine2 = breakLine2Ref.current;
    const breakLine3 = breakLine3Ref.current;
    const breakLine4 = breakLine4Ref.current;
    const breakLine5 = breakLine5Ref.current;
    const breakLine6 = breakLine6Ref.current;
    const breakLine7 = breakLine7Ref.current;
    const breakLine8 = breakLine8Ref.current;

    // Visual experiments
    const visualExp1 = visualExp1Ref.current;
    const visualExp2 = visualExp2Ref.current;
    const visualExp3 = visualExp3Ref.current;
    const visualExp4 = visualExp4Ref.current;
    const visualExp6 = visualExp6Ref.current;

    // IDX/AK
    const idxAk = idxAkRef.current;

    // Initial states
    if (rightText) gsap.set(rightText, { opacity: 1, clipPath: "inset(0 100% 0 0)" });
    if (bottomLeftText) gsap.set(bottomLeftText, { opacity: 1 });
    if (phases) gsap.set(phases, { clipPath: "inset(0 0 100% 0)" });
    if (phase001) gsap.set(phase001, { clipPath: "inset(0 0 100% 0)" });
    if (phase004) gsap.set(phase004, { clipPath: "inset(0 0 100% 0)" });
    if (background) gsap.set(background, { opacity: 0 });

    // ✅ Smooth reveal from barrier: I BREAK text lines
    const breakLines = [
      breakLine1,
      breakLine2,
      breakLine3,
      breakLine4,
      breakLine5,
      breakLine6,
      breakLine7,
      breakLine8,
    ].filter(Boolean) as HTMLDivElement[];
    if (breakLines.length) {
      gsap.set(breakLines, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        x: -12,
        filter: "blur(8px)",
        willChange: "clip-path, transform, filter, opacity",
      });
    }

    // IDX/AK reveal from left barrier
    if (idxAk) {
      gsap.set(idxAk, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 1,
      });
    }

    // ✅ Smooth reveal from barrier: Visual Experience list (from gray separator)
    const visualLines = [visualExp1, visualExp2, visualExp3, visualExp4].filter(Boolean) as HTMLDivElement[];
    if (visualLines.length) {
      gsap.set(visualLines, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        x: -12,
        filter: "blur(8px)",
        willChange: "clip-path, transform, filter, opacity",
      });
    }

    const tl = gsap.timeline();

    // Step 1: reveal background
    if (background) {
      tl.to(background, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => setBackgroundRevealed(true),
      });
    }

    // Step 2: reveal right block container
    if (rightText) {
      tl.to(
        rightText,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: "power2.out",
        },
        "+=0.2"
      );
    }

    // Step 2.5: smooth I BREAK reveal from barrier
    if (breakLines.length) {
      tl.to(
        breakLines,
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.08,
        },
        "-=0.45"
      );
    }

    // Bottom left: IDX/AK then Visual Experience lines
    if (bottomLeftText) {
      if (idxAk) {
        tl.to(
          idxAk,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.4,
            ease: "power1.out",
          },
          "-=0.25"
        );
      }
      if (visualLines.length) {
        tl.to(
          visualLines,
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
            onComplete: () => {
              visualAutoRevealDone.current = true;
              setLowerTextRevealed(true);
            },
          },
          "-=0.1"
        );
      }
    }

    // Phase indicators reveal from bottom
    if (phases) {
      tl.to(
        phases,
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    if (phase001) {
      tl.to(
        phase001,
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.8"
      );
    }

    if (phase004) {
      tl.to(
        phase004,
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.8"
      );
    }

    // ScrollTrigger masks/wipes
    if (upperText) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=400",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const clipValue = progress * 100;
          upperText.style.clipPath = `inset(0 0 ${clipValue}% 0)`;
        },
      });
    }

    if (lowerText) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=600",
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, self.progress - 0.3);
          const clipValue = progress * 140;
          lowerText.style.clipPath = `inset(0 0 ${Math.min(clipValue, 100)}% 0)`;
        },
      });
    }

    if (bottomLeftText) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, self.progress - 0.2);
          const clipValue = progress * 120;
          bottomLeftText.style.clipPath = `inset(${Math.min(clipValue, 100)}% 0 0 0)`;
        },
      });
    }

    if (visualLines.length) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=900",
        scrub: 1,
        onUpdate: (self) => {
          if (!visualScrollEngaged.current) {
            if (self.progress === 0) return;
            visualScrollEngaged.current = true;
          }
          const perLine = 1 / visualLines.length;
          const delay = 0.08;
          const totalSpan = 1 + delay * (visualLines.length - 1);
          const adjustedProgress = Math.min(self.progress * totalSpan, 1);
          visualLines.forEach((line, index) => {
            const revealIndex = self.direction === 1 ? visualLines.length - 1 - index : index;
            const lineStart = perLine * revealIndex + delay * revealIndex;
            const lineProgress = Math.min(Math.max(1 - (adjustedProgress - lineStart) / perLine, 0), 1);
            const clipValue = 100 - lineProgress * 100;
            line.style.clipPath = `inset(0 ${clipValue}% 0 0)`;
            line.style.opacity = lineProgress.toString();
            line.style.transform = `translateX(${(-12 * (1 - lineProgress)).toFixed(2)}px)`;
            line.style.filter = `blur(${(8 * (1 - lineProgress)).toFixed(2)}px)`;
          });
          if (self.progress <= 0.02) setLowerTextRevealed(true);
          if (self.progress >= 0.98) setLowerTextRevealed(false);
        },
      });
    }

    if (phases) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, self.progress - 0.1);
          const clipValue = progress * 120;
          phases.style.clipPath = `inset(0 0 ${Math.min(clipValue, 100)}% 0)`;
        },
      });
    }

    if (phase001) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, self.progress - 0.1);
          const clipValue = progress * 120;
          phase001.style.clipPath = `inset(0 0 ${Math.min(clipValue, 100)}% 0)`;
        },
      });
    }

    if (phase004) {
      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.max(0, self.progress - 0.1);
          const clipValue = progress * 120;
          phase004.style.clipPath = `inset(0 0 ${Math.min(clipValue, 100)}% 0)`;
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black"
      style={{ zIndex: 10, overflow: "visible" }}
    >
      <div ref={heroRef} className="relative w-full min-h-screen pb-[25vh] md:pb-[40vh]">
        {/* Abstract Background */}
        <div ref={backgroundRef} className="absolute inset-0">
          <AbstractBackground />
        </div>

        {/* Circle Network Animation */}
        <CircleNetwork startAnimation={lowerTextRevealed} />

        {/* Plus Sign Line Drawer Animation */}
        <VerticalText startAnimation={backgroundRevealed} />

        {/* Phase Indicator 001 */}
        <div
          ref={phase001Ref}
          className="absolute z-40 hidden md:block top-[22%] md:top-[24%] lg:top-[26%] laptop:top-[24%] desktop:top-[28%] ultrawide:top-[30%] left-[18%] md:left-[20%] lg:left-[22%] laptop:left-[20%] desktop:left-[24%]"
        >
          <PhaseIndicator number="001" label="PHASE/IMAGINE" delay={0} />
        </div>

        {/* Phase Indicator 004 */}
        <div
          ref={phase004Ref}
          className="absolute z-40 hidden md:block top-[22%] md:top-[24%] lg:top-[26%] laptop:top-[24%] desktop:top-[28%] ultrawide:top-[30%] right-[20%] md:right-[22%] lg:right-[24%] laptop:right-[24%] desktop:right-[28%]"
        >
          <PhaseIndicator number="004" label="PHASE/INTERACT" delay={0.6} />
        </div>

        {/* Right Text Block */}
        <div className="relative md:absolute md:right-6 lg:right-8 laptop:right-6 desktop:right-8 ultrawide:right-10 z-30 mt-24 md:mt-0 px-6 md:px-0 md:top-[28%] lg:top-[30%] laptop:top-[30%] desktop:top-[32%] ultrawide:top-[34%]">
          <div ref={rightTextRef} className="max-w-[280px] md:max-w-[320px] lg:max-w-[380px] mx-auto md:mx-0">
            <div className="text-white space-y-3 md:space-y-4">
              {/* Upper Text - We See Imagination */}
              <div ref={upperTextRef} className="text-lg md:text-xl lg:text-2xl laptop:text-xs desktop:text-2xl ultrawide:text-3xl font-light leading-tight">
                <div className="relative pl-4 md:pl-5">
                  {/* barrier stays visible */}
                  <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#39ff14]" />

                  {/* lines reveal from the barrier */}
                  <div ref={breakLine1Ref}>WE SEE</div>
                  <div ref={breakLine2Ref}>
                    <span className="text-[#39ff14]">IMAGINATION AS</span>
                  </div>
                  <div ref={breakLine3Ref}>THE MOST HUMAN</div>
                  <div ref={breakLine4Ref}>
                    <span className="text-[#39ff14]">FORM OF CREATIVITY</span>
                    </div>
                  <div ref={breakLine5Ref}>THE FORCE THAT</div>
                  <div ref={breakLine6Ref}>TURN IDEAS INTO</div>
                  <div ref={breakLine7Ref}>
                    <span className="text-[#39ff14]">MEANINGFUL</span>
                  </div>
                  <div ref={breakLine8Ref}>
                    <span className="text-[#39ff14]">EXPERIENCES</span>
                  </div>
                </div>
              </div>

              {/* Invisible Barrier Line 1 */}
              <div className="relative w-full h-[2px]" style={{ zIndex: 40 }}>
                <div className="absolute inset-0 bg-transparent" />
              </div>

              {/* Lower Text - ADAM */}
              <div ref={lowerTextRef} className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6">
                <div className="w-1 h-10 md:h-12 bg-[#39ff14]" />
                <div>
                  <div className="text-lg md:text-xl lg:text-2xl laptop:text-base desktop:text-2xl ultrawide:text-2xl font-semibold">DotLace</div>
                  <div className="text-xs md:text-sm lg:text-base laptop:text-[10px] desktop:text-base ultrawide:text-base text-white/70 mt-1">
                    VISUAL CREATORS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Text Block */}
        <div
          ref={bottomLeftTextRef}
          className="relative md:absolute md:left-8 lg:left-12 laptop:left-12 desktop:left-16 ultrawide:left-20 bottom-12 md:bottom-24 lg:bottom-26 laptop:bottom-26 desktop:bottom-28 ultrawide:bottom-32 z-30 mt-16 md:mt-0 px-6 md:px-0"
        >
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 lg:gap-12">
            {/* Left Section */}
            <div ref={idxAkRef} className="flex flex-col gap-1 text-sm md:text-base laptop:text-sm desktop:text-base ultrawide:text-base">
              <div className="text-white font-semibold tracking-wide">UX/UI</div>
              <div className="text-[#39ff14] font-bold text-lg md:text-xl laptop:text-lg desktop:text-xl ultrawide:text-xl">2026</div>
            </div>

            {/* Gray Vertical Separator (this is the barrier for the list) */}
            <div className="w-1 h-32 md:h-40 bg-gray-700" />

            {/* Right Section - List (smooth reveal from barrier) */}
            <div className="flex flex-col gap-2 md:gap-3 text-sm md:text-base lg:text-lg laptop:text-base desktop:text-lg ultrawide:text-lg md:-ml-2 lg:-ml-3 desktop:-ml-4 font-ranade">
              <div ref={visualExp1Ref} className="text-white font-medium tracking-wide">
                VISUAL EXPERIMENTS
              </div>
              <div ref={visualExp2Ref} className="text-white font-medium tracking-wide">
                FUNCTIONS & FEATURES
              </div>
              <div ref={visualExp3Ref} className="text-white font-medium tracking-wide">
                SOUND & MOTION
              </div>
              <div ref={visualExp4Ref} className="text-white font-medium tracking-wide">
                WORDS & MOMENTS
              </div>
              
            </div>
          </div>
        </div>

        {/* Phase Bend */}
        <PhaseBend ref={phasesRef} />

      </div>
    </div>
  );
});

LandingHero.displayName = "LandingHero";
export default LandingHero;
