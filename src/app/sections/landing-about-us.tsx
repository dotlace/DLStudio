"use client";

import { forwardRef } from "react";

interface LandingAboutUsProps {
  aboutUsDSpaceRef: React.RefObject<HTMLDivElement>;
}

const LandingAboutUs = forwardRef<HTMLDivElement, LandingAboutUsProps>((props, sectionRef) => {
  const { aboutUsDSpaceRef } = props;
  
  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-purple-50" style={{ zIndex: 1 }}>
      <div ref={aboutUsDSpaceRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 opacity-0 pointer-events-none" />
    </div>
  );
});

LandingAboutUs.displayName = "LandingAboutUs";

export default LandingAboutUs;
