"use client";

import { useEffect, useRef } from "react";

type PlasmaDirection = "forward" | "reverse" | "pingpong";

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: PlasmaDirection;
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  className?: string;
}

const vertexShaderSource = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;

out vec4 fragColor;

bool finite1(float x) {
  return !(isnan(x) || isinf(x));
}

vec3 sanitize(vec3 c) {
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i = 0.0;
  float d = 0.0;
  float z = 0.0;
  float T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0);
  vec3 p = vec3(0.0);
  vec3 S = vec3(0.0);

  for (vec2 r = iResolution.xy, Q = vec2(0.0); ++i < 60.0; O += o.w / d * o.xyz) {
    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    Q = p.xz *= mat2(cos(p.y + vec4(0.0, 11.0, 33.0, 0.0) - T));
    z += d = abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4;
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));
  }

  o.xyz = tanh(O / 1e4);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = clamp(length(rgb) * uOpacity, 0.0, 1.0);
  fragColor = vec4(finalColor, alpha);
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.trim().replace("#", "");
  const value = normalized.length === 3
    ? normalized
        .split("")
        .map((part) => `${part}${part}`)
        .join("")
    : normalized;

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
  if (!result) {
    return [0.2235, 0.1843, 0.7764];
  }

  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error.";
    gl.deleteShader(shader);
    throw new Error(info);
  }

  return shader;
};

const createProgram = (gl: WebGL2RenderingContext, vertex: string, fragment: string) => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Failed to create program.");
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program link error.";
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(info);
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
};

export default function Plasma({
  color = "#392fc6",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
  className = "",
}: PlasmaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileViewport = window.matchMedia("(max-width: 767px)").matches;

    if (reducedMotion || mobileViewport) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
    });

    if (!gl) {
      container.removeChild(canvas);
      return;
    }

    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;
    let dpr = 1;
    const resolutionScale = mouseInteractive ? 0.72 : 0.82;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    const positionBuffer = gl.createBuffer();
    const vao = gl.createVertexArray();

    if (!positionBuffer || !vao) {
      gl.deleteProgram(program);
      container.removeChild(canvas);
      return;
    }

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const uniforms = {
      iResolution: gl.getUniformLocation(program, "iResolution"),
      iTime: gl.getUniformLocation(program, "iTime"),
      uCustomColor: gl.getUniformLocation(program, "uCustomColor"),
      uUseCustomColor: gl.getUniformLocation(program, "uUseCustomColor"),
      uSpeed: gl.getUniformLocation(program, "uSpeed"),
      uDirection: gl.getUniformLocation(program, "uDirection"),
      uScale: gl.getUniformLocation(program, "uScale"),
      uOpacity: gl.getUniformLocation(program, "uOpacity"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uMouseInteractive: gl.getUniformLocation(program, "uMouseInteractive"),
    };

    const directionMultiplier = direction === "reverse" ? -1 : 1;
    const customColor = hexToRgb(color);
    const mouse = new Float32Array([0, 0]);
    const targetMouse = new Float32Array([0, 0]);

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.35);

      canvas.width = Math.floor(width * dpr * resolutionScale);
      canvas.height = Math.floor(height * dpr * resolutionScale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!mouseInteractive) {
        return;
      }

      const rect = container.getBoundingClientRect();
      targetMouse[0] = (event.clientX - rect.left) * dpr * resolutionScale;
      targetMouse[1] = (rect.height - (event.clientY - rect.top)) * dpr * resolutionScale;
    };

    const clearMouse = () => {
      const rect = container.getBoundingClientRect();
      targetMouse[0] = rect.width * 0.5 * dpr * resolutionScale;
      targetMouse[1] = rect.height * 0.5 * dpr * resolutionScale;
    };

    updateSize();
    clearMouse();
    mouse[0] = targetMouse[0];
    mouse[1] = targetMouse[1];

    resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    if (mouseInteractive) {
      container.addEventListener("pointermove", handlePointerMove, { passive: true });
      container.addEventListener("pointerleave", clearMouse, { passive: true });
    }

    const startedAt = performance.now();

    const render = (timestamp: number) => {
      if (disposed) {
        return;
      }

      const elapsed = (timestamp - startedAt) * 0.001;
      let timeValue = elapsed;
      let directionValue = directionMultiplier;

      if (direction === "pingpong") {
        const segmentDuration = 10;
        const cycleTime = elapsed % segmentDuration;
        const headingForward = Math.floor(elapsed / segmentDuration) % 2 === 0;
        const unit = cycleTime / segmentDuration;
        const smooth = unit * unit * (3 - 2 * unit);
        timeValue = headingForward ? smooth * segmentDuration : (1 - smooth) * segmentDuration;
        directionValue = 1;
      }

      mouse[0] += (targetMouse[0] - mouse[0]) * 0.08;
      mouse[1] += (targetMouse[1] - mouse[1]) * 0.08;

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.iTime, timeValue);
      gl.uniform3f(uniforms.uCustomColor, customColor[0], customColor[1], customColor[2]);
      gl.uniform1f(uniforms.uUseCustomColor, color ? 1 : 0);
      gl.uniform1f(uniforms.uSpeed, speed * 0.4);
      gl.uniform1f(uniforms.uDirection, directionValue);
      gl.uniform1f(uniforms.uScale, Math.max(scale, 0.1));
      gl.uniform1f(uniforms.uOpacity, opacity);
      gl.uniform2f(uniforms.uMouse, mouse[0], mouse[1]);
      gl.uniform1f(uniforms.uMouseInteractive, mouseInteractive ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);

      animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();

      if (mouseInteractive) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", clearMouse);
      }

      gl.deleteBuffer(positionBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [color, direction, mouseInteractive, opacity, scale, speed]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(91,71,255,0.34),transparent_20%),radial-gradient(circle_at_78%_22%,rgba(111,164,255,0.18),transparent_24%),linear-gradient(180deg,#050816_0%,#060814_100%)]" />
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(5,8,22,0.2)_62%,rgba(5,8,22,0.72)_100%)]" />
    </div>
  );
}
