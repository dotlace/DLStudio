"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Square = {
  x: number;
  y: number;
  size: number;
  side: "left" | "top" | "right" | "bottom";
};

const buildFibonacciSquares = (baseUnit: number, count: number): Square[] => {
  const sizes: number[] = [1, 1];
  while (sizes.length < count) {
    sizes.push(sizes[sizes.length - 1] + sizes[sizes.length - 2]);
  }

  const squares: Square[] = [];
  let minX = 0;
  let minY = 0;
  let maxX = sizes[0] * baseUnit;
  let maxY = sizes[0] * baseUnit;

  squares.push({ x: 0, y: 0, size: sizes[0] * baseUnit, side: "right" });

  if (count > 1) {
    const size = sizes[1] * baseUnit;
    squares.push({ x: maxX, y: minY, size, side: "right" });
    maxX += size;
    maxY = Math.max(maxY, minY + size);
  }

  const directions: Array<"up" | "left" | "down" | "right"> = ["up", "left", "down", "right"];
  for (let i = 2; i < count; i += 1) {
    const size = sizes[i] * baseUnit;
    const direction = directions[(i - 2) % directions.length];

    let x = minX;
    let y = minY;
    let side: Square["side"] = "right";

    switch (direction) {
      case "up":
        x = minX;
        y = minY - size;
        side = "top";
        break;
      case "left":
        x = minX - size;
        y = minY;
        side = "left";
        break;
      case "down":
        x = minX;
        y = maxY;
        side = "bottom";
        break;
      case "right":
        x = maxX;
        y = minY;
        side = "right";
        break;
    }

    squares.push({ x, y, size, side });
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + size);
    maxY = Math.max(maxY, y + size);
  }

  return squares;
};

const arcPath = (square: Square) => {
  const { x, y, size, side } = square;
  const r = size;

  switch (side) {
    case "left": {
      const startX = x + size;
      const startY = y;
      const endX = x;
      const endY = y + size;
      return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
    }
    case "top": {
      const startX = x + size;
      const startY = y + size;
      const endX = x;
      const endY = y;
      return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
    }
    case "right": {
      const startX = x;
      const startY = y + size;
      const endX = x + size;
      const endY = y;
      return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
    }
    default: {
      const startX = x;
      const startY = y;
      const endX = x + size;
      const endY = y + size;
      return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
    }
  }
};

const GoldenRatio = () => {
  const spiralPathRef = useRef<SVGPathElement>(null);
  const baseUnit = 36;
  const squares = buildFibonacciSquares(baseUnit, 9);

  const minX = Math.min(...squares.map((s) => s.x));
  const minY = Math.min(...squares.map((s) => s.y));
  const maxX = Math.max(...squares.map((s) => s.x + s.size));
  const maxY = Math.max(...squares.map((s) => s.y + s.size));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const padding = 8;
  const viewBox = [
    minX - padding,
    minY - padding,
    maxX - minX + padding * 2,
    maxY - minY + padding * 2,
  ].join(" ");

  useEffect(() => {
    const path = spiralPathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const trigger = ScrollTrigger.create({
      trigger: "#intro",
      start: "top 75%",
      end: "top 25%",
      scrub: 1,
      onUpdate: (self) => {
        gsap.to(path, {
          strokeDashoffset: length * (1 - self.progress),
          overwrite: true,
          ease: "none",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div className="w-full">
      <svg
        viewBox={viewBox}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Golden ratio spiral and squares"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`rotate(-90 ${centerX} ${centerY})`}
        >
          <path ref={spiralPathRef} d={squares.map(arcPath).join(" ")} />
        </g>
      </svg>
    </div>
  );
};

export default GoldenRatio;
