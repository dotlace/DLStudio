"use client";

import Navbar from "@/app/components/common/navbar";
import LandingHero from "@/app/sections/Hero/landing-hero";
import LandingIntro from "@/app/sections/Intro/landing-intro";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      <Navbar />
      <LandingHero />
      <LandingIntro />
    </div>
  );
}
