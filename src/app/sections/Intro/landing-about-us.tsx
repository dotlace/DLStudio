"use client";

import { useRef } from "react";

const LandingAboutUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-black" style={{ zIndex: 5 }}>
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:py-32">
        <div className="h-[40vh]" />
      </div>
    </section>
  );
};

export default LandingAboutUs;
