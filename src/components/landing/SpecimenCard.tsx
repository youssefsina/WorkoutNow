"use client";

import Link from "next/link";

const MOCK_EXERCISES = [
  { name: "BARBELL SQUAT",       detail: "4 × 6–8"   },
  { name: "ROMANIAN DEADLIFT",   detail: "3 × 10–12" },
  { name: "LEG PRESS",           detail: "3 × 12–15" },
  { name: "WALKING LUNGES",      detail: "3 × 20"    },
  { name: "STANDING CALF RAISE", detail: "4 × 15–20" },
];

const META = [
  { label: "Medium",   value: "Compound · Strength" },
  { label: "Edition",  value: "5 of ∞"              },
  { label: "Duration", value: "45 – 60 min"          },
];

export default function SpecimenCard() {
  return (
    <div className="specimen-wrap">
      <div className="specimen">
        {/* ── Header ── */}
        <div className="specimen-header">
          <span className="gallery-label">Curated Workout · Legs</span>
          <div className="specimen-dots">
            <span className="specimen-dot specimen-dot-accent" />
            <span className="specimen-dot specimen-dot-dim" />
            <span className="specimen-dot specimen-dot-ghost" />
          </div>
        </div>

        {/* ── SVG Art ── */}
        <div className="specimen-art">
          <svg viewBox="0 0 360 100" preserveAspectRatio="xMidYMid meet" className="specimen-art-svg" aria-hidden>
            <defs>
              <linearGradient id="spec-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"  stopColor="#6366f1" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"  />
              </linearGradient>
            </defs>

            <line x1="20"  y1="20" x2="220" y2="20" stroke="var(--g-svg-lo)"  strokeWidth="1" />
            <line x1="20"  y1="35" x2="320" y2="35" stroke="var(--g-svg-mid)" strokeWidth="1" />
            <line x1="20"  y1="50" x2="340" y2="50" stroke="url(#spec-grad)"  strokeWidth="1.5" />
            <line x1="20"  y1="65" x2="280" y2="65" stroke="var(--g-svg-lo)"  strokeWidth="1" />
            <line x1="20"  y1="80" x2="160" y2="80" stroke="var(--g-svg-lo)"  strokeWidth="1" />

            <line x1="180" y1="8"  x2="180" y2="92" stroke="var(--g-svg-lo)"  strokeWidth="1" strokeDasharray="2 4" />

            <circle cx="340" cy="50" r="2.5" fill="#6366f1" />

            {[20, 100, 180, 260, 340].map((x) => (
              <line key={x} x1={x} y1="93" x2={x} y2="89" stroke="var(--g-svg-lo)" strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* ── Metadata block ── */}
        <div className="specimen-meta">
          {META.map((m) => (
            <div key={m.label} className="specimen-meta-row">
              <span className="specimen-meta-label">{m.label}</span>
              <span className="specimen-meta-value">{m.value}</span>
            </div>
          ))}
        </div>

        {/* ── Exercise list ── */}
        <div>
          {MOCK_EXERCISES.map((ex, i) => (
            <div
              key={i}
              className={`gallery-exercise-row${i < MOCK_EXERCISES.length - 1 ? " gallery-exercise-row-border" : ""}`}
            >
              <div className="gallery-exercise-left">
                <span className="gallery-exercise-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="gallery-exercise-name">{ex.name}</span>
              </div>
              <span className="gallery-exercise-detail">{ex.detail}</span>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <Link href="/signup" className="specimen-footer">
          <span className="gallery-label">Generated · 5 exercises</span>
          <span className="specimen-cta">
            Acquire
            <span className="material-symbols-outlined" style={{ fontSize: "0.8rem" }}>north_east</span>
          </span>
        </Link>
      </div>

      {/* Caption (gallery wall plaque) */}
      <div className="specimen-caption">
        <span>WorkoutNow Generator</span>
        <span>SS · {new Date().getFullYear()}</span>
      </div>

      <style>{`
        .specimen-wrap { display: none; }
        @media (min-width: 1024px) { .specimen-wrap { display: block; } }

        .specimen {
          border: 1px solid var(--g-border);
          border-radius: 2px;
          overflow: hidden;
          background: var(--g-surf);
          position: relative;
          transition: border-color 0.25s, transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .specimen:hover { border-color: var(--g-border); }

        /* corner crosses */
        .specimen::before,
        .specimen::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background:
            linear-gradient(var(--g-fg-lo), var(--g-fg-lo)) center / 100% 1px no-repeat,
            linear-gradient(var(--g-fg-lo), var(--g-fg-lo)) center / 1px 100% no-repeat;
          pointer-events: none;
        }
        .specimen::before { top: -4px; left: -4px; }
        .specimen::after  { bottom: -4px; right: -4px; }

        .specimen-header {
          padding: 0.875rem 1.5rem;
          border-bottom: 1px solid var(--g-border-lo);
          display: flex; align-items: center; justify-content: space-between;
        }
        .specimen-dots { display: flex; gap: 5px; align-items: center; }
        .specimen-dot { width: 6px; height: 6px; border-radius: 50%; }
        .specimen-dot-accent { background: #6366f1; box-shadow: 0 0 8px rgba(99,102,241,0.6); }
        .specimen-dot-dim    { background: var(--g-fg-xs); }
        .specimen-dot-ghost  { background: var(--g-border-lo); }

        .specimen-art {
          padding: 1.5rem 1.5rem 0.75rem;
          background:
            linear-gradient(180deg, rgba(99,102,241,0.04) 0%, transparent 100%),
            radial-gradient(ellipse 60% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%);
          border-bottom: 1px solid var(--g-border-xs);
        }
        .specimen-art-svg {
          width: 100%; height: auto; display: block;
        }

        .specimen-meta {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--g-border-lo);
          display: grid; gap: 0.5rem;
        }
        .specimen-meta-row {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: 1rem;
        }
        .specimen-meta-label {
          font-size: 0.58rem; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--g-fg-lo);
        }
        .specimen-meta-value {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.78rem; letter-spacing: -0.01em;
          color: var(--g-fg-hi);
          font-variant-numeric: tabular-nums;
        }

        .specimen-footer {
          padding: 0.875rem 1.5rem;
          border-top: 1px solid var(--g-border-lo);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(99,102,241,0.04);
          text-decoration: none;
          transition: background 0.2s;
        }
        .specimen-footer:hover { background: rgba(99,102,241,0.09); }
        .specimen-cta {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--g-fg); font-weight: 600;
          padding: 0.28rem 0.7rem;
          border: 1px solid rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.12);
          border-radius: 1px;
          transition: all 0.2s;
        }
        .specimen-footer:hover .specimen-cta {
          background: #6366f1;
          border-color: #6366f1;
          color: #fff;
          box-shadow: 0 0 24px rgba(99,102,241,0.4);
        }

        .specimen-caption {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 0.875rem;
          font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--g-fg-xs);
          padding: 0 0.25rem;
        }
      `}</style>
    </div>
  );
}
