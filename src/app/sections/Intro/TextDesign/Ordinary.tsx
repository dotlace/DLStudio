"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Ordinary = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const tween = gsap.fromTo(
      text,
      { scale: 1.1, y: 0 },
      {
        scale: 0.75,
        y: -160,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 20%",
          end: "bottom 10%",
          scrub: 1,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[200vh] bg-black text-white overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      <div className="sticky top-0 min-h-screen flex items-center justify-center isolate">
        <div className="relative w-full max-w-[1200px] px-6">
          <div className="absolute inset-x-0 top-1/2 -translate-y-[40%] mx-auto h-[55vh] w-[55vh] bg-white" />

          <div
            ref={textRef}
            className="relative z-10 mt-32 mx-auto w-full max-w-[98vw] text-center text-[14vw] sm:text-[12vw] leading-[0.85] font-semibold tracking-tight text-white mix-blend-difference"
          >
            <div className="whitespace-nowrap">From ordinary</div>
            <div className="whitespace-nowrap">to extraordinary</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ordinary;
