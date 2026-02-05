'use client';

import { useEffect, useRef } from "react";

interface AbstractBackgroundProps {
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  baseOpacity: number;
}

export default function AbstractBackground({
  className = "",
}: AbstractBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
      dotsRef.current = [];
    };

    setCanvasSize();

    const GRID_SPACING = 12;

    const getDotProperties = (
      x: number,
      y: number,
      width: number,
      height: number,
      morphTime: number = 0
    ) => {
      const distFromBottomLeft = Math.sqrt(
        Math.pow(x - 0, 2) + Math.pow(y - height, 2)
      );
      const distFromBottomRight = Math.sqrt(
        Math.pow(x - width, 2) + Math.pow(y - height, 2)
      );

      const swirlIntensity = 0.8 + Math.sin(morphTime * 0.3) * 0.2;
      const spiralFrequency = 3 + Math.sin(morphTime * 0.2) * 0.5;

      const swirlLeft = Math.max(0, 1 - distFromBottomLeft / (height * swirlIntensity));
      const swirlRight = Math.max(0, 1 - distFromBottomRight / (height * swirlIntensity));

      const angleLeft = Math.atan2(y - height, x - 0);
      const angleRight = Math.atan2(y - height, x - width);

      const spiralLeft =
        swirlLeft * Math.sin(angleLeft * spiralFrequency + distFromBottomLeft * 0.01) * 0.5;
      const spiralRight =
        swirlRight * Math.sin(angleRight * spiralFrequency + distFromBottomRight * 0.01) * 0.5;

      const combinedIntensity = Math.max(swirlLeft + spiralLeft, swirlRight + spiralRight);

      const maxDotSize = 8;
      const minDotSize = 1;
      const dotSize = minDotSize + combinedIntensity * (maxDotSize - minDotSize);
      const opacity = Math.min(combinedIntensity * 1.5, 1);

      return { size: dotSize, opacity };
    };

    const generateDots = () => {
      const width = canvas.width;
      const height = canvas.height;
      const dots: Dot[] = [];

      for (let x = 0; x < width; x += GRID_SPACING) {
        for (let y = 0; y < height; y += GRID_SPACING) {
          const { size, opacity } = getDotProperties(x, y, width, height);
          if (opacity > 0.1) {
            dots.push({ x, y, baseX: x, baseY: y, size, baseOpacity: opacity });
          }
        }
      }

      const densityLayers = 2;
      for (let layer = 0; layer < densityLayers; layer++) {
        const offset = (GRID_SPACING / (densityLayers + 1)) * (layer + 1);
        for (let x = offset; x < width; x += GRID_SPACING) {
          for (let y = offset; y < height; y += GRID_SPACING) {
            const { size, opacity } = getDotProperties(x, y, width, height);
            if (opacity > 0.1) {
              dots.push({ x, y, baseX: x, baseY: y, size, baseOpacity: opacity * 0.6 });
            }
          }
        }
      }

      dotsRef.current = dots;
    };

    const getGlobalColor = (time: number) => {
      const colors = [
        { r: 255, g: 255, b: 255 },
        { r: 57, g: 255, b: 20 },
        { r: 0, g: 191, b: 255 },
        { r: 255, g: 20, b: 147 },
        { r: 255, g: 215, b: 0 },
      ];

      const colorDuration = 8;
      const totalCycle = colors.length * colorDuration;
      const normalizedTime = (time % totalCycle) / colorDuration;

      const currentIndex = Math.floor(normalizedTime);
      const nextIndex = (currentIndex + 1) % colors.length;
      const blend = normalizedTime - currentIndex;

      const current = colors[currentIndex];
      const next = colors[nextIndex];

      return {
        r: Math.round(current.r + (next.r - current.r) * blend),
        g: Math.round(current.g + (next.g - current.g) * blend),
        b: Math.round(current.b + (next.b - current.b) * blend),
      };
    };

    const animateDots = () => {
      timeRef.current += 0.016;
      const morphTime = timeRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const globalColor = getGlobalColor(timeRef.current);

      dotsRef.current.forEach((dot) => {
        const { size } = getDotProperties(dot.baseX, dot.baseY, width, height, morphTime);
        const waveX = Math.sin(morphTime * 0.5 + dot.baseY * 0.01) * 2;
        const waveY = Math.cos(morphTime * 0.5 + dot.baseX * 0.01) * 2;

        dot.x = dot.baseX + waveX;
        dot.y = dot.baseY + waveY;
        dot.size = size;

        const opacity = dot.baseOpacity;
        ctx.fillStyle = `rgba(${globalColor.r}, ${globalColor.g}, ${globalColor.b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animateDots);
    };

    const init = () => {
      generateDots();
      timeRef.current = 0;
      animateDots();
    };

    init();

    const handleResize = () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      setCanvasSize();
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const canvasStyle = {
    zIndex: 0,
    imageRendering: "crisp-edges" as const,
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={canvasStyle}
    />
  );
}
