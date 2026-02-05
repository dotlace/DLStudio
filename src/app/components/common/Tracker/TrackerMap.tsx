"use client";

import { useEffect, useState, useRef } from "react";

interface TrackerNote {
  id: string;
  label: string;
  sectionId: string;
}

interface TrackerMapProps {
  sections?: Array<{ id: string; label: string }>;
}

export default function TrackerMap({ sections = [] }: TrackerMapProps) {
  const [trackerNotes, setTrackerNotes] = useState<TrackerNote[]>([]);
  const lastScrollYRef = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    // Track scroll direction
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      lastScrollYRef.current = currentScrollY;
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Create IntersectionObserver to track sections
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          const section = sections.find((s) => s.id === sectionId);
          
          if (!section) return;

          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY >= lastScrollY;
          lastScrollY = currentScrollY;

          const rect = entry.boundingClientRect;
          const viewportTop = 0;
          const viewportBottom = window.innerHeight;
          
          // Section is entering viewport from bottom (scrolling down)
          if (entry.isIntersecting && rect.top >= viewportTop && rect.top < viewportBottom) {
            if (isScrollingDown) {
              setTrackerNotes((prev) => {
                // Check if note already exists
                if (prev.some((note) => note.sectionId === sectionId)) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    id: `tracker-${sectionId}-${Date.now()}`,
                    label: section.label,
                    sectionId: section.id,
                  },
                ];
              });
            }
          }
          
          // Section is above viewport (scrolled past) - remove when scrolling up
          if (rect.bottom < viewportTop && !isScrollingDown) {
            setTrackerNotes((prev) =>
              prev.filter((note) => note.sectionId !== sectionId)
            );
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.1, 0.5],
      }
    );

    // Observe all sections after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      clearTimeout(timeoutId);
    };
  }, [sections]);

  if (trackerNotes.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-[calc(1px+5rem)] md:top-[calc(1px+5.5rem)] lg:top-[calc(1px+6rem)] left-0 right-0 z-30 px-4 md:px-8 lg:px-12">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
        {trackerNotes.map((note) => (
          <div
            key={note.id}
            className="shrink-0 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 hover:bg-white/20 animate-in fade-in slide-in-from-top-2"
          >
            {note.label}
          </div>
        ))}
      </div>
    </div>
  );
}
