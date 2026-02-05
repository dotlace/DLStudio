"use client";

import { useState, useEffect } from "react";
import DTSLogo from "./dtsLogo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    // Start closing animation
    setIsAnimating(false);
    // Delay unmounting until animation completes
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 1200);
  };

  useEffect(() => {
    if (isMenuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
      // Trigger animation after a tiny delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const menuItems = [
    "Home",
    "About Us",
    "Websites",
    "Contact us",
  ];

  return (
    <>
      {/* Top Bar - Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/20 backdrop-blur-sm h-1" />

      {/* Main Navigation Bar */}
      <nav className="fixed top-1 left-0 right-0 z-40 w-full bg-black/10 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 md:px-12 md:py-6">
          {/* Logo */}
          <DTSLogo />

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group flex flex-col gap-1.5 p-2 transition-all duration-300 hover:opacity-70 active:scale-95"
            aria-label="Open menu"
          >
            <span className="h-[2px] w-6 bg-white transition-all duration-300 group-hover:w-7" />
            <span className="h-[2px] w-6 bg-white transition-all duration-300" />
            <span className="h-[2px] w-6 bg-white transition-all duration-300 group-hover:w-7" />
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Sheet */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-1000 ease-out ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* Left Section - Image (1/3) */}
          <div
            className={`hidden lg:block w-1/3 bg-gray-200 relative overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isAnimating
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            {/* Placeholder for image - you can replace with actual image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`text-gray-500 text-sm transition-opacity duration-700 ${
                    isAnimating ? "opacity-100 delay-500" : "opacity-0 delay-0"
                  }`}
                >
                  Image Placeholder
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Menu Content (2/3) */}
          <div
            className={`w-full lg:w-2/3 bg-white relative overflow-y-auto transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isAnimating
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            {/* Background Watermark */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-opacity duration-1500 ${
                isAnimating ? "opacity-5 delay-300" : "opacity-0 delay-0"
              }`}
            >
              <span className="text-[20rem] font-bold text-gray-300">
                STUDIOS
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full min-h-screen">
              {/* Top Section - Close Button */}
              <div className="flex items-start justify-end p-6 sm:p-8 md:p-12">
                <button
                  onClick={handleClose}
                  className={`group flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800 active:scale-95 sm:px-5 sm:py-2.5 sm:text-base ${
                    isAnimating
                      ? "translate-y-0 opacity-100 scale-100 delay-200"
                      : "-translate-y-4 opacity-0 scale-95 delay-0"
                  }`}
                  aria-label="Close menu"
                >
                  <span className="uppercase tracking-wider">CLOSE</span>
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Main Navigation - Centered Vertically */}
              <div className="flex-1 flex items-center justify-center">
                <nav className="flex flex-col gap-6 sm:gap-8 md:gap-10 -mt-24 sm:-mt-32 md:-mt-40">
                  {menuItems.map((item, index) => {
                    // Opening: 400, 500, 600, 700, 800ms
                    // Closing: 800, 700, 600, 500, 400ms (exact reverse)
                    const openingDelay = 400 + index * 100;
                    const closingDelay = 400 + (menuItems.length - 1 - index) * 100;
                    const delay = isAnimating ? openingDelay : closingDelay;
                    return (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={handleClose}
                        className={`group relative inline-block text-2xl font-bold uppercase tracking-wide text-black transition-all duration-500 hover:text-gray-700 hover:scale-105 sm:text-3xl md:text-4xl lg:text-5xl ${
                          isAnimating
                            ? "translate-x-0 opacity-100"
                            : "translate-x-8 opacity-0"
                        }`}
                        style={{
                          transitionDelay: `${delay}ms`,
                        }}
                      >
                        {item.split("").map((letter, letterIndex) => (
                          <span
                            key={letterIndex}
                            className="inline-block transition-all duration-300 group-hover:animate-[shutter_0.3s_ease-in-out]"
                            style={{
                              animationDelay: `${letterIndex * 0.05}s`,
                            }}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </span>
                        ))}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Section - Copyright */}
              <div className="p-6 sm:p-8 md:p-12 flex justify-center">
                <div
                  className={`text-sm text-gray-500 sm:text-base transition-all duration-700 ${
                    isAnimating
                      ? "translate-y-0 opacity-100 delay-200"
                      : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  2025© DotLace Studio
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
