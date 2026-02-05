"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

export interface DrawingFlowerHandle {
  getPaths: () => SVGGeometryElement[];
}

interface DrawingFlowerProps {
  className?: string;
  strokeWidth?: number;
  animate?: boolean;
  width?: number;
  height?: number;
  petalCount?: number;
  stroke?: string;
}

const DrawingFlower = forwardRef<DrawingFlowerHandle, DrawingFlowerProps>(
  (
    {
      className,
      strokeWidth = 5,
      animate = true,
      width = 700,
      height = 450,
      petalCount = 26,
      stroke = "#111",
    },
    ref
  ) => {
  const pathsRef = useRef<SVGGeometryElement[]>([]);

  useEffect(() => {
    if (!animate) return;
    const paths = pathsRef.current;
    if (!paths.length) return;

    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: "power2.out",
      stagger: 0.04,
    });
  }, [animate]);

  const registerPath = (element: SVGGeometryElement | null) => {
    if (!element) return;
    if (!pathsRef.current.includes(element)) {
      pathsRef.current.push(element);
    }
  };

  useImperativeHandle(ref, () => ({
    getPaths: () => pathsRef.current,
  }));

  const cx = 260;
  const cy = 165;

  const Petal = ({
    angle,
    innerR = 70,
    outerR = 190,
    spread = 0.55,
  }: {
    angle: number;
    innerR?: number;
    outerR?: number;
    spread?: number;
  }) => {
    const rad = (angle * Math.PI) / 180;
    const tipX = cx + Math.cos(rad) * outerR;
    const tipY = cy + Math.sin(rad) * outerR;
    const baseX = cx + Math.cos(rad) * innerR;
    const baseY = cy + Math.sin(rad) * innerR;

    const leftRad = rad - spread;
    const rightRad = rad + spread;
    const leftX = cx + Math.cos(leftRad) * ((innerR + outerR) / 2);
    const leftY = cy + Math.sin(leftRad) * ((innerR + outerR) / 2);
    const rightX = cx + Math.cos(rightRad) * ((innerR + outerR) / 2);
    const rightY = cy + Math.sin(rightRad) * ((innerR + outerR) / 2);

    const wobble = (Math.sin(rad * 7) + Math.cos(rad * 5)) * 2.2;

    const d = `
      M ${baseX} ${baseY}
      Q ${leftX + wobble} ${leftY - wobble} ${tipX} ${tipY}
      Q ${rightX - wobble} ${rightY + wobble} ${baseX} ${baseY}
      Z
    `;

    return (
      <path
        ref={registerPath}
        d={d}
        fill="#F3C540"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    );
  };

  const petals = Array.from({ length: petalCount }, (_, i) => {
    const a = (360 / petalCount) * i - 90;
    const outerR = i % 2 === 0 ? 204 : 188;
    const innerR = i % 2 === 0 ? 70 : 76;
    const spread = i % 2 === 0 ? 0.68 : 0.6;
    return <Petal key={i} angle={a} innerR={innerR} outerR={outerR} spread={spread} />;
  });

  const svgWidth = className ? "100%" : width;
  const svgHeight = className ? "100%" : height;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox="0 0 700 520"
      className={className}
      role="img"
      aria-label="Sunflower drawing"
    >
      <g>{petals}</g>

      <g opacity="0.35" stroke={stroke} strokeWidth="2" fill="none">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (360 / 10) * i - 90;
          const rad = (a * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * 92;
          const y1 = cy + Math.sin(rad) * 92;
          const x2 = cx + Math.cos(rad) * 130;
          const y2 = cy + Math.sin(rad) * 130;
          return <path ref={registerPath} key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} />;
        })}
      </g>

      <circle
        ref={registerPath}
        cx={cx}
        cy={cy}
        r="72"
        fill="#8B4B1A"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle
        ref={registerPath}
        cx={cx}
        cy={cy}
        r="52"
        fill="#6F3714"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle
        ref={registerPath}
        cx={cx}
        cy={cy}
        r="20"
        fill="#A8652A"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      <g opacity="0.9">
        {Array.from({ length: 70 }, (_, i) => {
          const t = i * 0.48;
          const r = Math.sqrt(i) * 4.2;
          const x = cx + Math.cos(t) * r;
          const y = cy + Math.sin(t) * r;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 3 === 0 ? 3 : 2.4}
              fill={i % 2 === 0 ? "#2B170E" : "#3B2115"}
            />
          );
        })}
      </g>

      <path
        ref={registerPath}
        d="M 260 235
           C 258 320, 262 380, 262 480"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        ref={registerPath}
        d="M 260 235
           C 250 325, 252 390, 252 480"
        fill="none"
        stroke="#6BA64A"
        strokeWidth="16"
        strokeLinecap="round"
      />

      <g>
        <path
          ref={registerPath}
          d="M 248 330
             C 200 305, 165 325, 150 350
             C 175 370, 210 375, 252 350
             C 260 345, 260 338, 248 330 Z"
          fill="#84B95C"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <path
          ref={registerPath}
          d="M 170 350
             C 205 345, 225 345, 248 336"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          opacity="0.7"
          strokeLinecap="round"
        />

        <path
          ref={registerPath}
          d="M 270 320
             C 320 295, 355 315, 372 340
             C 350 365, 315 370, 272 342
             C 262 336, 262 328, 270 320 Z"
          fill="#84B95C"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <path
          ref={registerPath}
          d="M 350 342
             C 315 336, 295 335, 272 327"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          opacity="0.7"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
});

DrawingFlower.displayName = "DrawingFlower";

export default DrawingFlower;
