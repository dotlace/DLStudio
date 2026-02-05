"use client";

import { forwardRef } from "react";
import PhaseIndicator from "./PhaseIndicator";

interface PhaseBendProps {}

const PhaseBend = forwardRef<HTMLDivElement, PhaseBendProps>((props, phasesRef) => {
  return (
    <div
      ref={phasesRef}
      className="absolute bottom-6 md:bottom-12 lg:bottom-14 laptop:bottom-14 desktop:bottom-16 ultrawide:bottom-20 z-30 flex items-end justify-between w-full px-3 md:px-8 lg:px-12 laptop:px-12 desktop:px-16 ultrawide:px-20"
    >
      {/* 001 is now positioned independently in landing-hero.tsx */}
      <div className="invisible">
        <PhaseIndicator 
          number="00I" 
          label="IMAGINE" 
          delay={0}
        />
      </div>
      
      <PhaseIndicator 
        number="00II" 
        label="DESIGN" 
        delay={0.2}
      />
      
      <PhaseIndicator 
        number="00III" 
        label="BUILD" 
        delay={0.4}
      />
      
      {/* 004 is now positioned independently above I BREAK text */}
      <div className="invisible">
        <PhaseIndicator 
          number="00IV" 
          label="INTERACT" 
          delay={0.6}
        />
      </div>
    </div>
  );
});

PhaseBend.displayName = "PhaseBend";

export default PhaseBend;
