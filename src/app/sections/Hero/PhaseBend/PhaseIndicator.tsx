"use client";

import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";

interface PhaseIndicatorProps {
  number: string;
  label: string;
  delay?: number; // Animation delay in seconds
  className?: string;
}

const PhaseIndicator = forwardRef<HTMLDivElement, PhaseIndicatorProps>(
  ({ number, label, delay = 0, className = "" }, ref) => {
    const dot1Ref = useRef<HTMLDivElement>(null);
    const dot2Ref = useRef<HTMLDivElement>(null);
    const dot3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const dot1 = dot1Ref.current;
      const dot2 = dot2Ref.current;
      const dot3 = dot3Ref.current;

      if (!dot1 || !dot2 || !dot3) return;

      // Set initial states for dots
      gsap.set([dot1, dot2, dot3], { backgroundColor: "rgba(255, 255, 255, 0.3)" });

      // Create loading animation timeline (loops)
      const loadingTl = gsap.timeline({ 
        delay,
        repeat: -1,
        repeatDelay: 0.5
      });

      // Dot 1 lights up
      loadingTl.to(dot1, {
        backgroundColor: "#39ff14",
        duration: 0.3,
        ease: "power2.out",
      });

      // Dot 2 lights up
      loadingTl.to(dot2, {
        backgroundColor: "#39ff14",
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.1");

      // Dot 3 lights up
      loadingTl.to(dot3, {
        backgroundColor: "#39ff14",
        duration: 0.3,
        ease: "power2.out",
      }, "-=0.1");

      // All dots fade back
      loadingTl.to([dot1, dot2, dot3], {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        duration: 0.3,
        ease: "power2.in",
      }, "+=0.2");

      return () => {
        loadingTl.kill();
      };
    }, [delay]);

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center gap-2 font-rx100 ${className}`}
      >
        {/* Number */}
        <div className="text-white/40 text-xs md:text-sm">{number}</div>
        
        {/* Vertical Line - Between number and label - LONG & DARK GRAY */}
        <div 
          style={{
            width: '2px',
            height: '96px',
            backgroundColor: '#2a2a2a',
            margin: '8px 0'
          }}
        />
        
        {/* Label */}
        <div className="text-white/60 text-[10px] md:text-xs uppercase">
          {label}
        </div>
        
        {/* Loading Indicator */}
        <div className="flex items-center gap-1 mt-1">
          {/* Green horizontal line */}
          <div className="w-4 h-px bg-[#39ff14]" />
          
          {/* Animated dots */}
          <div className="flex gap-0.5">
            <div 
              ref={dot1Ref}
              className="w-px h-1"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
            <div 
              ref={dot2Ref}
              className="w-px h-1"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
            <div 
              ref={dot3Ref}
              className="w-px h-1"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            />
          </div>
        </div>
      </div>
    );
  }
);

PhaseIndicator.displayName = "PhaseIndicator";

export default PhaseIndicator;
