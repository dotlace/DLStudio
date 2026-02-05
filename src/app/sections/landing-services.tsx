"use client";

import { forwardRef } from "react";

interface LandingServicesProps {}

const LandingServices = forwardRef<HTMLDivElement, LandingServicesProps>((props, sectionRef) => {
  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-green-50">
    </div>
  );
});

LandingServices.displayName = "LandingServices";

export default LandingServices;
