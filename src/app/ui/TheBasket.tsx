"use client";

import { forwardRef, useEffect, useState } from "react";

interface TheBasketProps {
  collectedLetters: string[];
}

const TheBasket = forwardRef<HTMLDivElement, TheBasketProps>(({ collectedLetters }, ref) => {
  const [displayedLetters, setDisplayedLetters] = useState<string[]>([]);

  useEffect(() => {
    // Update displayed letters when collected letters change
    setDisplayedLetters(collectedLetters);
  }, [collectedLetters]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* Basket Container */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-2xl min-w-[200px]">
        <div className="text-white text-sm font-semibold mb-2 uppercase tracking-wide">
          Basket
        </div>
        
        {/* Letters Display - This is where letters should fall into */}
        <div ref={ref} className="flex flex-wrap gap-2 min-h-[60px] items-center justify-center p-3 bg-gray-900 rounded border-2 border-gray-700">
          {displayedLetters.length === 0 ? (
            <span className="text-gray-500 text-xs">Empty</span>
          ) : (
            displayedLetters.map((letter, index) => (
              <div
                key={`${letter}-${index}`}
                className="text-2xl font-bold text-yellow-400 animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

TheBasket.displayName = "TheBasket";

export default TheBasket;
