'use client';

import { useEffect, useRef } from "react";

interface CircleNetworkProps {
  className?: string;
  startAnimation?: boolean;
}

interface Point {
  x: number;
  y: number;
  id: number;
}

interface Edge {
  from: Point;
  to: Point;
  progress: number;
  speed: number;
  id: number;
}

interface Burst {
  center: Point;
  type: 'triangle' | 'pyramid' | 'hexagon';
  life: number;
  maxLife: number;
  rotation: number;
  scale: number;
}

export default function CircleNetwork({ className = "", startAnimation = false }: CircleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const burstsRef = useRef<Burst[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const edgeIdCounterRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Don't start animation until startAnimation is true
    if (!startAnimation) return;

    // Initialize points in a circular network pattern
    const initializePoints = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const points: Point[] = [];

      // Create points in multiple circular rings (Da Vinci circle concept)
      const rings = 3;
      const pointsPerRing = [6, 12, 18];
      
      for (let ring = 0; ring < rings; ring++) {
        const radius = (Math.min(width, height) * 0.15) * (ring + 1);
        const numPoints = pointsPerRing[ring];
        
        for (let i = 0; i < numPoints; i++) {
          const angle = (Math.PI * 2 * i) / numPoints;
          points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            id: points.length,
          });
        }
      }

      // Add center point
      points.push({ x: centerX, y: centerY, id: points.length });

      pointsRef.current = points;
      edgesRef.current = [];
      burstsRef.current = [];
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePoints();
    };

    setCanvasSize();

    // Spawn a new edge between random points
    const spawnEdge = () => {
      const points = pointsRef.current;
      if (points.length < 2) return;

      const from = points[Math.floor(Math.random() * points.length)];
      let to = points[Math.floor(Math.random() * points.length)];
      
      // Ensure different points
      while (to.id === from.id) {
        to = points[Math.floor(Math.random() * points.length)];
      }

      edgesRef.current.push({
        from,
        to,
        progress: 0,
        speed: 0.003 + Math.random() * 0.005,
        id: edgeIdCounterRef.current++,
      });
    };

    // Draw triangle burst
    const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.strokeStyle = `rgba(80, 80, 80, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw pyramid burst (3D wireframe effect)
    const drawPyramid = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.strokeStyle = `rgba(80, 80, 80, ${opacity})`;
      ctx.lineWidth = 2;
      
      // Base triangle
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size + size * 0.3;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Apex point
      const apexX = 0;
      const apexY = -size * 0.8;
      
      // Lines from base to apex
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size + size * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(apexX, apexY);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    // Draw hexagon burst
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.strokeStyle = `rgba(80, 80, 80, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Draw points
      pointsRef.current.forEach((point) => {
        ctx.fillStyle = "rgba(80, 80, 80, 0.6)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw edges
      edgesRef.current = edgesRef.current.filter((edge) => {
        edge.progress += edge.speed;

        if (edge.progress >= 1) {
          // Spawn burst
          const burstTypes: ('triangle' | 'pyramid' | 'hexagon')[] = ['triangle', 'pyramid', 'hexagon'];
          const randomType = burstTypes[Math.floor(Math.random() * burstTypes.length)];
          
          burstsRef.current.push({
            center: edge.to,
            type: randomType,
            life: 0,
            maxLife: 1.5,
            rotation: Math.random() * Math.PI * 2,
            scale: 0,
          });
          return false; // Remove edge
        }

        // Draw animated line
        const currentX = edge.from.x + (edge.to.x - edge.from.x) * edge.progress;
        const currentY = edge.from.y + (edge.to.y - edge.from.y) * edge.progress;

        // Line trail effect
        const gradient = ctx.createLinearGradient(edge.from.x, edge.from.y, currentX, currentY);
        gradient.addColorStop(0, "rgba(80, 80, 80, 0)");
        gradient.addColorStop(0.5, "rgba(80, 80, 80, 0.3)");
        gradient.addColorStop(1, "rgba(80, 80, 80, 0.8)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw glowing head
        ctx.fillStyle = "rgba(80, 80, 80, 1)";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();

        return true; // Keep edge
      });

      // Update and draw bursts
      burstsRef.current = burstsRef.current.filter((burst) => {
        burst.life += 0.016;
        
        if (burst.life >= burst.maxLife) {
          return false; // Remove burst
        }

        // Animate scale and opacity
        const progress = burst.life / burst.maxLife;
        burst.scale = 10 + progress * 40;
        const opacity = Math.max(0, 1 - progress);
        burst.rotation += 0.02;

        // Draw burst based on type
        switch (burst.type) {
          case 'triangle':
            drawTriangle(ctx, burst.center.x, burst.center.y, burst.scale, burst.rotation, opacity);
            break;
          case 'pyramid':
            drawPyramid(ctx, burst.center.x, burst.center.y, burst.scale, burst.rotation, opacity);
            break;
          case 'hexagon':
            drawHexagon(ctx, burst.center.x, burst.center.y, burst.scale, burst.rotation, opacity);
            break;
        }

        return true; // Keep burst
      });

      // Spawn new edges periodically
      if (Math.random() < 0.03 && edgesRef.current.length < 8) {
        spawnEdge();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    const handleResize = () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setCanvasSize();
      animate();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startAnimation]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        zIndex: 5,
        mixBlendMode: 'screen',
      }}
    />
  );
}
