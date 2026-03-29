"use client";

import { useEffect, useRef } from "react";

interface PlasmaBackgroundProps {
  className?: string;
}

export default function PlasmaBackground({ className = "" }: PlasmaBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let time = 0;
    let width = 0;
    let height = 0;
    const renderScale = 0.28;

    const resize = () => {
      width = Math.max(1, Math.floor(window.innerWidth * renderScale));
      height = Math.max(1, Math.floor(window.innerHeight * renderScale));
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const plasma = (x: number, y: number, t: number) => {
      const nx = x / width - 0.5;
      const ny = y / height - 0.5;
      const radial = Math.sqrt(nx * nx + ny * ny);

      const waveA = Math.sin(nx * 12 + t * 0.58 + Math.cos(ny * 5 - t * 0.22));
      const waveB = Math.sin(ny * 13 - t * 0.7 + Math.sin(nx * 6 + t * 0.18));
      const waveC = Math.sin(radial * 20 - t * 0.95 + Math.cos((nx - ny) * 9));
      const waveD = Math.cos((nx + ny) * 9 + t * 0.42);
      const ring = Math.sin(radial * 30 - t * 1.25);

      return waveA * 0.26 + waveB * 0.24 + waveC * 0.22 + waveD * 0.18 + ring * 0.1;
    };

    const render = () => {
      time += 0.012;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const value = plasma(x, y, time);
          const idx = (y * width + x) * 4;
          const tone = value * Math.PI;
          const glow = Math.max(0, value) * 82;
          const hueShift = Math.sin((x / width) * 4 + time * 0.5) * 0.5 + 0.5;

          const red = Math.floor((Math.sin(tone + 0.4) * 0.5 + 0.5) * 66 + 18 + hueShift * 18);
          const green = Math.floor((Math.sin(tone + 2.1) * 0.5 + 0.5) * 115 + 22);
          const blue = Math.floor((Math.sin(tone + 4.25) * 0.5 + 0.5) * 210 + 38);

          data[idx] = Math.min(255, red + glow * 0.52);
          data[idx + 1] = Math.min(255, green + glow * 0.24);
          data[idx + 2] = Math.min(255, blue + glow);
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = window.requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full scale-110 blur-[14px] saturate-[1.45]"
        style={{ background: "#040814" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(147,197,253,0.16),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(96,165,250,0.12),transparent_24%),radial-gradient(circle_at_50%_82%,rgba(56,189,248,0.14),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,20,0.08),rgba(4,8,20,0.68))]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:120px_120px]" />
    </div>
  );
}
