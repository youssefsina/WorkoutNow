"use client";

import { useEffect, useRef } from "react";

interface WavesProps {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  friction?: number;
  tension?: number;
  maxCursorMove?: number;
  className?: string;
}

class Grad {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  dot2(x: number, y: number) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  private grad3 = [
    new Grad(1, 1, 0),
    new Grad(-1, 1, 0),
    new Grad(1, -1, 0),
    new Grad(-1, -1, 0),
    new Grad(1, 0, 1),
    new Grad(-1, 0, 1),
    new Grad(1, 0, -1),
    new Grad(-1, 0, -1),
    new Grad(0, 1, 1),
    new Grad(0, -1, 1),
    new Grad(0, 1, -1),
    new Grad(0, -1, -1),
  ];

  private p = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
    140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
    120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
    33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
    71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
    133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
    63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
    226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
    59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
    152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39,
    253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246,
    97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51,
    145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184,
    84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222,
    114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  private perm = new Array<number>(512);
  private gradP = new Array<Grad>(512);

  constructor(seed = 0) {
    this.seed(seed);
  }

  private seed(seed: number) {
    let localSeed = seed;

    if (localSeed > 0 && localSeed < 1) {
      localSeed *= 65536;
    }

    localSeed = Math.floor(localSeed);
    if (localSeed < 256) {
      localSeed |= localSeed << 8;
    }

    for (let i = 0; i < 256; i += 1) {
      const value = i & 1 ? this.p[i] ^ (localSeed & 255) : this.p[i] ^ ((localSeed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = value;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[value % 12];
    }
  }

  private fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  perlin2(x: number, y: number) {
    let localX = x;
    let localY = y;

    let x0 = Math.floor(localX);
    let y0 = Math.floor(localY);
    localX -= x0;
    localY -= y0;
    x0 &= 255;
    y0 &= 255;

    const n00 = this.gradP[x0 + this.perm[y0]].dot2(localX, localY);
    const n01 = this.gradP[x0 + this.perm[y0 + 1]].dot2(localX, localY - 1);
    const n10 = this.gradP[x0 + 1 + this.perm[y0]].dot2(localX - 1, localY);
    const n11 = this.gradP[x0 + 1 + this.perm[y0 + 1]].dot2(localX - 1, localY - 1);

    const u = this.fade(localX);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(localY));
  }
}

type WavePoint = {
  x: number;
  y: number;
  wave: { x: number; y: number };
  cursor: { x: number; y: number; vx: number; vy: number };
};

const round = (value: number) => Math.round(value * 10) / 10;

export default function Waves({
  lineColor = "rgba(255,255,255,0.58)",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.01,
  waveAmpX = 32,
  waveAmpY = 18,
  xGap = 14,
  yGap = 20,
  friction = 0.92,
  tension = 0.005,
  maxCursorMove = 120,
  className = "",
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.className = "absolute inset-0 h-full w-full";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.background = backgroundColor;
    container.appendChild(canvas);

    const noise = new Noise(Math.random());
    const mouse = { x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0, vs: 0 };

    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let move = 0;
    let lines: WavePoint[][] = [];

    const buildLines = () => {
      lines = [];

      const totalLines = Math.ceil(width / xGap);
      const totalPoints = Math.ceil(height / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i <= totalLines; i += 1) {
        const points: WavePoint[] = [];
        for (let j = 0; j <= totalPoints; j += 1) {
          points.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        lines.push(points);
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.4);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.lineCap = "round";
      context.lineJoin = "round";

      mouse.x = width * 0.5;
      mouse.y = height * 0.5;
      mouse.sx = mouse.x;
      mouse.sy = mouse.y;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.vs = 0;

      buildLines();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      mouse.x = width * 0.5;
      mouse.y = height * 0.5;
    };

    const updateMouse = () => {
      const dx = mouse.x - mouse.sx;
      const dy = mouse.y - mouse.sy;

      mouse.sx += dx * 0.14;
      mouse.sy += dy * 0.14;
      mouse.vx = dx;
      mouse.vy = dy;
      mouse.vs = Math.min(18, Math.sqrt(dx * dx + dy * dy));
    };

    const updateLines = () => {
      move += reducedMotion ? 0.0004 : 0.0018;

      lines.forEach((points) => {
        points.forEach((point) => {
          const nX = noise.perlin2((point.x + move * 120) * waveSpeedX, (point.y + move * 70) * waveSpeedY) * waveAmpX;
          const nY = noise.perlin2((point.x + move * 90) * waveSpeedY, (point.y + move * 120) * waveSpeedX) * waveAmpY;

          point.wave.x = nX;
          point.wave.y = nY;

          const dx = point.x - mouse.sx;
          const dy = point.y - mouse.sy;
          const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const influence = Math.max(0, 1 - distance / maxCursorMove);

          point.cursor.vx += mouse.vx * influence * tension * 1.6;
          point.cursor.vy += mouse.vy * influence * tension * 1.6;
          point.cursor.vx *= friction;
          point.cursor.vy *= friction;
          point.cursor.x += point.cursor.vx;
          point.cursor.y += point.cursor.vy;
          point.cursor.x = Math.max(-maxCursorMove, Math.min(maxCursorMove, point.cursor.x));
          point.cursor.y = Math.max(-maxCursorMove, Math.min(maxCursorMove, point.cursor.y));
        });
      });
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = lineColor;
      context.lineWidth = 1.1;

      lines.forEach((points) => {
        context.beginPath();

        points.forEach((point, index) => {
          const x = round(point.x + point.wave.x + point.cursor.x);
          const y = round(point.y + point.wave.y + point.cursor.y);

          if (index === 0) {
            context.moveTo(x, y);
            return;
          }

          context.lineTo(x, y);
        });

        context.stroke();
      });
    };

    const render = () => {
      updateMouse();
      updateLines();
      draw();
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [
    backgroundColor,
    friction,
    lineColor,
    maxCursorMove,
    tension,
    waveAmpX,
    waveAmpY,
    waveSpeedX,
    waveSpeedY,
    xGap,
    yGap,
  ]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#050311_0%,#09041a_100%)]" />
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(255,255,255,0.04),transparent_18%),linear-gradient(180deg,rgba(5,3,17,0.08),rgba(5,3,17,0.26)_45%,rgba(5,3,17,0.82)_100%)]" />
    </div>
  );
}
