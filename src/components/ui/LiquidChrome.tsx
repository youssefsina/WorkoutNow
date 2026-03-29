"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

interface LiquidChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

export default function LiquidChrome({
  baseColor = [0.1, 0.1, 0.1],
  speed = 1,
  amplitude = 0.6,
  frequencyX = 3,
  frequencyY = 2,
  interactive = true,
  className = "",
  style,
  ...props
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new Renderer({ antialias: true, alpha: false, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform float uTime;
      uniform vec3 uResolution;
      uniform vec3 uBaseColor;
      uniform float uAmplitude;
      uniform float uFrequencyX;
      uniform float uFrequencyY;
      uniform vec2 uMouse;
      varying vec2 vUv;

      vec4 renderImage(vec2 uvCoord) {
        vec2 fragCoord = uvCoord * uResolution.xy;
        vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

        for (float i = 1.0; i < 10.0; i++) {
          uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
          uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
        }

        vec2 diff = uvCoord - uMouse;
        float dist = length(diff);
        float falloff = exp(-dist * 20.0);
        float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
        uv += (diff / (dist + 0.0001)) * ripple * falloff;

        vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
        return vec4(color, 1.0);
      }

      void main() {
        vec4 col = vec4(0.0);
        int samples = 0;

        for (int i = -1; i <= 1; i++) {
          for (int j = -1; j <= 1; j++) {
            vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
            col += renderImage(vUv + offset);
            samples++;
          }
        }

        gl_FragColor = col / float(samples);
      }
    `;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]) },
        uBaseColor: { value: new Float32Array(baseColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const targetMouse = { x: 0.5, y: 0.5 };
    const smoothMouse = { x: 0.5, y: 0.5 };

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      const resolution = program.uniforms.uResolution.value as Float32Array;
      resolution[0] = gl.canvas.width;
      resolution[1] = gl.canvas.height;
      resolution[2] = gl.canvas.width / gl.canvas.height;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (event.clientX - rect.left) / rect.width;
      targetMouse.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        return;
      }

      const touch = event.touches[0];
      const rect = container.getBoundingClientRect();
      targetMouse.x = (touch.clientX - rect.left) / rect.width;
      targetMouse.y = 1 - (touch.clientY - rect.top) / rect.height;
    };

    const resetPointer = () => {
      targetMouse.x = 0.5;
      targetMouse.y = 0.5;
    };

    let animationId = 0;
    const render = (time: number) => {
      animationId = window.requestAnimationFrame(render);

      const lerp = reducedMotion ? 0.035 : 0.09;
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * lerp;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * lerp;

      const mouse = program.uniforms.uMouse.value as Float32Array;
      mouse[0] = smoothMouse.x;
      mouse[1] = smoothMouse.y;
      program.uniforms.uTime.value = time * 0.001 * (reducedMotion ? speed * 0.35 : speed);

      renderer.render({ scene: mesh });
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", resetPointer, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
      container.addEventListener("touchend", resetPointer, { passive: true });
    }

    container.appendChild(gl.canvas);
    animationId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();

      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", resetPointer);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", resetPointer);
      }

      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }

      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, baseColor, frequencyX, frequencyY, interactive, speed]);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full ${className}`}
      style={style}
      {...props}
    />
  );
}
