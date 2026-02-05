"use client";

import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VerticalTextProps {
  startAnimation?: boolean;
}

const VerticalText = forwardRef<HTMLDivElement, VerticalTextProps>(
  ({ startAnimation }, containerRef) => {
    const verticalLineRef = useRef<HTMLDivElement>(null);
    const horizontalLineRef = useRef<HTMLDivElement>(null);
    const uiTextRef = useRef<HTMLDivElement>(null);
    const uxTextRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      console.log("VerticalText mounted, startAnimation:", startAnimation);
      
      if (!startAnimation) {
        console.log("Animation not started yet");
        return;
      }

      const verticalLine = verticalLineRef.current;
      const horizontalLine = horizontalLineRef.current;
      const uiText = uiTextRef.current;
      const uxText = uxTextRef.current;

      console.log("Lines:", { verticalLine, horizontalLine, uiText, uxText });

      if (!verticalLine || !horizontalLine || !uiText || !uxText) {
        console.log("Elements not found!");
        return;
      }

      // Set initial state - lines are completely invisible
      gsap.set(verticalLine, { scaleY: 0, opacity: 0, transformOrigin: "center center" });
      gsap.set(horizontalLine, { scaleX: 0, opacity: 0, transformOrigin: "center center" });
      gsap.set(uiText, { x: 50, opacity: 0 }); // Start from right, hidden
      gsap.set(uxText, { x: -50, opacity: 0 }); // Start from left, hidden

      console.log("Starting + animation...");

      // Create timeline for + drawing animation
      const tl = gsap.timeline({ 
        delay: 0.3,
        onStart: () => console.log("Animation started!"),
        onComplete: () => console.log("Animation complete!")
      });

      // Draw vertical line first (from center outward)
      tl.to(verticalLine, {
        scaleY: 1,
        opacity: 0.9,
        duration: 0.8,
        ease: "power2.out",
      });

      // Draw horizontal line (from center outward)
      tl.to(horizontalLine, {
        scaleX: 1,
        opacity: 0.9,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4"); // Start slightly before vertical completes

      // After lines are drawn, UI text comes out to the left
      tl.to(uiText, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "+=0.2"); // Start 0.2s after lines complete

      // UX text comes out to the right (simultaneous with UI)
      tl.to(uxText, {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.6"); // Start at same time as UI

      // Setup scroll-triggered reverse animations with barriers
      // Get the hero section (parent of this component)
      const heroSection = wrapperRef.current?.parentElement;
      
      // Plus sign de-drawing: reverse the drawing animation on scroll
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Reverse vertical line drawing (scale back down)
          gsap.set(verticalLine, {
            scaleY: 1 - progress,
            opacity: 0.9 * (1 - progress),
          });
          
          // Reverse horizontal line drawing (scale back down)
          gsap.set(horizontalLine, {
            scaleX: 1 - progress,
            opacity: 0.9 * (1 - progress),
          });
        },
      });
      
      // UI text slides back to the right behind barrier (clips from right edge)
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Clip from right side as text slides right
          const clipValue = progress * 100;
          gsap.set(uiText, {
            clipPath: `inset(0 ${clipValue}% 0 0)`,
            x: progress * 50, // Slight movement to the right
          });
        },
      });

      // UX text slides back to the left behind barrier (clips from left edge)
      ScrollTrigger.create({
        trigger: heroSection,
        start: "top top",
        end: "+=500",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          // Clip from left side as text slides left
          const clipValue = progress * 100;
          gsap.set(uxText, {
            clipPath: `inset(0 0 0 ${clipValue}%)`,
            x: progress * -50, // Slight movement to the left
          });
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };

    }, [startAnimation, containerRef]);

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node;
          if (typeof containerRef === 'function') {
            containerRef(node);
          } else if (containerRef) {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        className="absolute inset-0 pointer-events-none z-25 hidden md:flex items-center justify-center"
      >
        {/* Plus Sign Container */}
        <div className="relative w-64 h-96 md:w-80 md:h-[32rem] lg:w-96 lg:h-[36rem]">
          {/* Vertical Line */}
          <div
            ref={verticalLineRef}
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
            style={{ 
              backgroundColor: "#2a2a2a",
              opacity: 0
            }}
          />
          
          {/* Horizontal Line */}
          <div
            ref={horizontalLineRef}
            className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2"
            style={{ 
              backgroundColor: "#2a2a2a",
              opacity: 0
            }}
          />

          {/* Quadrant 1 (NW/Top-Left) - UI Text with right barrier */}
          <div className="absolute right-1/2 top-1/4 mr-4 md:mr-6 lg:mr-8">
            {/* Invisible barrier on the right side of UI */}
            <div className="absolute -right-4 top-0 bottom-0 w-[1px] bg-transparent pointer-events-none" />
            
            <div
              ref={uiTextRef}
              style={{ 
                opacity: 0
              }}
            >
              <div className="font-kola text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-wider">
                UI
              </div>
            </div>
          </div>

          {/* Quadrant 4 (SE/Bottom-Right) - UX Text with left barrier */}
          <div className="absolute left-1/2 bottom-1/4 ml-4 md:ml-6 lg:ml-8">
            {/* Invisible barrier on the left side of UX */}
            <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-transparent pointer-events-none" />
            
            <div
              ref={uxTextRef}
              style={{ 
                opacity: 0
              }}
            >
              <div className="font-kola text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-wider">
                UX
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VerticalText.displayName = "VerticalText";

export default VerticalText;
