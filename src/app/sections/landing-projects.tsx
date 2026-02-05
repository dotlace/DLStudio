"use client";

import { forwardRef } from "react";

interface LandingProjectsProps {}

const LandingProjects = forwardRef<HTMLDivElement, LandingProjectsProps>((props, sectionRef) => {
  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-yellow-50">
    </div>
  );
});

LandingProjects.displayName = "LandingProjects";

export default LandingProjects;
