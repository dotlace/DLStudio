"use client";

import { forwardRef } from "react";

interface LandingTestimonialsProps {}

const LandingTestimonials = forwardRef<HTMLDivElement, LandingTestimonialsProps>((props, sectionRef) => {
  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-pink-50">
    </div>
  );
});

LandingTestimonials.displayName = "LandingTestimonials";

export default LandingTestimonials;
