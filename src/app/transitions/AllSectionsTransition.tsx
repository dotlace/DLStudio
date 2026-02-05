"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SectionConfig {
  sectionRef: React.RefObject<HTMLDivElement>;
  revealElements?: (React.RefObject<HTMLElement> | React.RefObject<HTMLDivElement>)[]; // Elements that need to move out to reveal next section
  revealDirection?: "left" | "right" | "up" | "down" | "split-horizontal"; // How elements move out
}

interface AllSectionsTransitionProps {
  sections: SectionConfig[];
}

export default function AllSectionsTransition({
  sections,
}: AllSectionsTransitionProps) {
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (sections.length < 2) return;

    // Clean up previous triggers
    scrollTriggersRef.current.forEach((trigger) => trigger.kill());
    scrollTriggersRef.current = [];

    const resizeHandlers: (() => void)[] = [];

    // Process each section pair (current and next)
    for (let i = 0; i < sections.length - 1; i++) {
      const currentSection = sections[i];
      const nextSection = sections[i + 1];

      if (!currentSection.sectionRef.current || !nextSection.sectionRef.current) {
        continue;
      }

      const current = currentSection.sectionRef.current;
      const next = nextSection.sectionRef.current;
      const revealElements = currentSection.revealElements || [];
      const direction = currentSection.revealDirection || "split-horizontal";

      // Position next section directly behind current section (same position)
      // Use a function to calculate position after layout
      const positionNextSection = () => {
        requestAnimationFrame(() => {
          const currentRect = current.getBoundingClientRect();
          const scrollY = window.scrollY;
          const currentTop = currentRect.top + scrollY;
          const currentHeight = currentRect.height;

          // Position intro section exactly behind hero (same top position)
          gsap.set(next, {
            position: "absolute",
            top: `${currentTop}px`,
            left: 0,
            width: "100%",
            height: `${currentHeight}px`,
            zIndex: i, // Behind current section
            opacity: 0,
            pointerEvents: "none",
          });
        });
      };

      // Initial positioning with delay to ensure layout is ready
      setTimeout(() => {
        positionNextSection();
      }, 100);
      
      // Store handler for cleanup
      resizeHandlers.push(positionNextSection);
      
      // Update on resize
      window.addEventListener("resize", positionNextSection);

      // Ensure hero section has viewport height
      gsap.set(current, {
        minHeight: "100vh",
        height: "100vh",
      });

      // Create ScrollTrigger for this section transition
      const scrollTrigger = ScrollTrigger.create({
        trigger: current,
        start: "top top",
        end: () => `+=${window.innerHeight * 1.5}`, // Fixed scroll distance (1.5x viewport height)
        scrub: 1,
        pin: true,
        pinSpacing: false, // No extra spacing
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          // Move reveal elements based on direction
          revealElements.forEach((elementRef, index) => {
            if (!elementRef?.current) return;

            const element = elementRef.current;
            let xOffset = 0;
            let yOffset = 0;
            const opacity = 1 - progress;
            const scale = 1 - progress * 0.2;

            switch (direction) {
              case "left":
                xOffset = -windowWidth * 1.5 * progress;
                break;
              case "right":
                xOffset = windowWidth * 1.5 * progress;
                break;
              case "up":
                yOffset = -windowHeight * 1.5 * progress;
                break;
              case "down":
                yOffset = windowHeight * 1.5 * progress;
                break;
              case "split-horizontal":
                // First element goes left, second goes right, etc.
                if (index % 2 === 0) {
                  xOffset = -windowWidth * 1.5 * progress;
                } else {
                  xOffset = windowWidth * 1.5 * progress;
                }
                break;
            }

            gsap.set(element, {
              x: xOffset,
              y: yOffset,
              opacity: opacity,
              scale: scale,
              force3D: true,
            });
          });

          // Reveal next section
          gsap.set(next, {
            opacity: progress,
            zIndex: progress > 0.3 ? i + 2 : i + 1,
            pointerEvents: progress > 0.5 ? "auto" : "none",
          });
        },
      });

      scrollTriggersRef.current.push(scrollTrigger);
    }

    return () => {
      resizeHandlers.forEach((handler) => {
        window.removeEventListener("resize", handler);
      });
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      ScrollTrigger.getAll().forEach((trigger) => {
        if (scrollTriggersRef.current.includes(trigger)) {
          trigger.kill();
        }
      });
    };
  }, [sections]);

  return null;
}
