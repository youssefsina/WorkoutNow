"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SpecimenCard from "@/components/landing/SpecimenCard";
import NowShowing from "@/components/landing/NowShowing";

// ─── Data ────────────────────────────────────────────────────

const COLLECTION = [
  {
    no: "— 01",
    icon: "auto_awesome",
    title: "Smart Generator",
    desc: "Select your equipment and target muscles. A curated workout assembles in seconds — sets, reps, and rest periods included.",
  },
  {
    no: "— 02",
    icon: "history",
    title: "Session Archive",
    desc: "Every completed session is cataloged automatically. Mark favorites. Return to what worked.",
  },
  {
    no: "— 03",
    icon: "monitoring",
    title: "Progress Gallery",
    desc: "Streak counters, weekly targets, total volume, and monthly hours — rendered in one clean dashboard.",
  },
];

const EXHIBITION = [
  {
    no: "I",
    tag: "Equipment",
    title: "Select Equipment",
    desc: "Choose the apparatus available to you — barbells, machines, cables, or bodyweight. Your choice defines the palette.",
  },
  {
    no: "II",
    tag: "Muscles",
    title: "Target Muscles",
    desc: "Define the muscle groups you want to develop. Precision over generality. Every session has an intention.",
  },
  {
    no: "III",
    tag: "Session",
    title: "Generate & Train",
    desc: "Review the curated exercise list. Begin the session. Your performance is logged — permanently.",
  },
];

const TICKER_ITEMS = [
  "GENERATE WORKOUTS", "TRACK PROGRESS", "FAVORITE EXERCISES",
  "BUILD CONSISTENCY", "TRAIN SMARTER", "LOG SESSIONS",
];

const ARCHIVE_CARDS = [
  { icon: "local_fire_department", label: "Current Streak", val: "Track it"    },
  { icon: "emoji_events",          label: "Weekly Goal",    val: "4 sessions"  },
  { icon: "history",               label: "All Sessions",   val: "Every log"   },
  { icon: "favorite",              label: "Favorites",      val: "Save any"    },
];

// ─── Page ─────────────────────────────────────────────────────

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const scrolled = root.scrollTop || document.body.scrollTop;
      const total = root.scrollHeight - root.clientHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      root.style.setProperty("--scroll-pct", `${pct}%`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor spotlight on hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      hero.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="gallery-root">
      {/* SVG grain texture overlay */}
      <svg className="gallery-grain" aria-hidden>
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* Scroll progress bar */}
      <div className="gallery-progress" aria-hidden />

      {/* Ambient indigo glow at top */}
      <div className="gallery-glow" aria-hidden />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ═══════════════════════════════════════════════════
            NAVBAR
        ═══════════════════════════════════════════════════ */}
        <header className="gallery-header">
          <div className="gallery-container gallery-nav-inner">
            {/* Logo */}
            <Link href="/" className="gallery-logo">
              <div className="gallery-logo-icon">
                <Image src="/logo.png" alt="WorkoutNow" width={32} height={32} className="object-contain" priority />
              </div>
              <span className="gallery-logo-text">WorkoutNow</span>
            </Link>

            {/* Nav links */}
            <nav className="gallery-nav-links">
              {[
                { href: "#collection", label: "Collection" },
                { href: "#exhibition", label: "Exhibition" },
                { href: "#archive",    label: "Archive"    },
              ].map((item) => (
                <a key={item.href} href={item.href} className="gallery-nav-link">
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="gallery-nav-actions">
              <Link href="/login" className="gallery-btn-ghost">Sign In</Link>
              <Link href="/signup" className="gallery-btn-solid">
                Get Started
                <span className="material-symbols-outlined gallery-btn-icon">north_east</span>
              </Link>
              <ThemeToggle className="gallery-theme-toggle" />
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════ */}
        <section ref={heroRef} className="gallery-hero gallery-container">
          {/* Vertical edge label */}
          <div className="gallery-edge-label" aria-hidden>
            Exhibition N°001 · WorkoutNow · {new Date().getFullYear()}
          </div>

          <div className="gallery-hero-grid">

            {/* ── Left: editorial copy ── */}
            <div>
              <div className="gallery-eyebrow">
                <span className="gallery-eyebrow-line" />
                Exhibition N°001
              </div>

              <h1 className="gallery-h1">
                Your<br />
                workout,<br />
                <span className="gallery-h1-outline">built for you.</span>
              </h1>

              <div className="gallery-accent-rule" />

              <p className="gallery-hero-body">
                Generate sessions from your equipment and target muscles.
                Track favorites, history, streaks, and goals —
                all in one place.
              </p>

              <div className="gallery-cta-row">
                <Link href="/signup" className="gallery-cta-primary">
                  Begin Training
                  <span className="material-symbols-outlined gallery-btn-icon">north_east</span>
                </Link>
                <a
                  href="https://github.com/youssefsina/WorkoutNow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-cta-outline"
                >
                  View Source
                </a>
              </div>

              {/* Stats strip */}
              <div className="gallery-stats">
                {[
                  { val: "3",    sub: "steps"    },
                  { val: "∞",    sub: "sessions" },
                  { val: "Free", sub: "always"   },
                ].map((s) => (
                  <div key={s.sub} className="gallery-stat">
                    <div className="gallery-stat-val">{s.val}</div>
                    <div className="gallery-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: SpecimenCard artwork ── */}
            <SpecimenCard />
          </div>

          {/* Scroll cue */}
          <div className="gallery-scroll-cue" aria-hidden>
            <span className="gallery-scroll-line" />
            <span className="gallery-scroll-text">Scroll</span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            MARQUEE TICKER
        ═══════════════════════════════════════════════════ */}
        <div className="gallery-ticker-wrap">
          <div className="gallery-ticker">
            {Array.from({ length: 4 }).flatMap((_, rep) =>
              TICKER_ITEMS.map((t) => (
                <span key={`${t}-${rep}`} className="gallery-ticker-item">
                  {t}
                  <span className="gallery-ticker-sep">◆</span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            NOW SHOWING — Abstract catalogue
        ═══════════════════════════════════════════════════ */}
        <NowShowing />

        {/* ═══════════════════════════════════════════════════
            COLLECTION — Features
        ═══════════════════════════════════════════════════ */}
        <section id="collection" className="gallery-section gallery-container">
          <div className="gallery-section-header">
            <div>
              <div className="gallery-section-label">The Collection</div>
              <h2 className="gallery-h2">Features</h2>
            </div>
            <span className="gallery-section-count">03 works</span>
          </div>

          <div className="gallery-grid-3">
            {COLLECTION.map((card) => (
              <article key={card.no} className="gallery-card">
                <div className="gallery-card-top">
                  <span className="gallery-label">{card.no}</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "1.1rem", color: "rgba(99,102,241,0.65)" }}
                  >
                    {card.icon}
                  </span>
                </div>
                <div className="gallery-card-rule" />
                <h3 className="gallery-card-title">{card.title}</h3>
                <p className="gallery-card-body">{card.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            EXHIBITION — How It Works
        ═══════════════════════════════════════════════════ */}
        <section id="exhibition" className="gallery-section-bordered gallery-container">
          <div className="gallery-exhibition-grid">

            {/* Sticky label */}
            <div className="gallery-exhibition-label">
              <div className="gallery-section-label">The Exhibition</div>
              <h2 className="gallery-h2">
                How it<br />works.
              </h2>
              <p className="gallery-exhibition-sub">
                Three deliberate actions between you and your next session.
              </p>
            </div>

            {/* Steps */}
            <div>
              {EXHIBITION.map((step, i) => (
                <div
                  key={step.no}
                  className={`gallery-step${i < EXHIBITION.length - 1 ? " gallery-step-border" : ""}`}
                >
                  <div className="gallery-step-no">{step.no}</div>
                  <div>
                    <div className="gallery-step-tag">{step.tag}</div>
                    <h3 className="gallery-step-title">{step.title}</h3>
                    <p className="gallery-step-body">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ARCHIVE — Progress / CTA
        ═══════════════════════════════════════════════════ */}
        <section id="archive" className="gallery-section-bordered gallery-container">
          <div className="gallery-archive-panel">
            {/* Ghost number */}
            <div className="gallery-archive-ghost" aria-hidden>∞</div>

            <div className="gallery-archive-inner">
              {/* Copy */}
              <div>
                <div className="gallery-section-label">The Archive</div>
                <h2 className="gallery-h2">
                  See every rep<br />of your progress.
                </h2>
                <p className="gallery-archive-body">
                  Streak counters, weekly targets, total sessions, and monthly
                  volume — all rendered in a single, curated dashboard.
                </p>
                <div className="gallery-cta-row">
                  <Link href="/signup" className="gallery-cta-primary">
                    Start Free
                    <span className="material-symbols-outlined gallery-btn-icon">north_east</span>
                  </Link>
                  <Link href="/login" className="gallery-cta-outline">Sign In</Link>
                </div>
              </div>

              {/* Stats grid */}
              <div className="gallery-archive-cards">
                {ARCHIVE_CARDS.map((item) => (
                  <div key={item.label} className="gallery-archive-card">
                    <span
                      className="material-symbols-outlined filled"
                      style={{ fontSize: "1.1rem", color: "rgba(99,102,241,0.7)", display: "block", marginBottom: "0.75rem" }}
                    >
                      {item.icon}
                    </span>
                    <p className="gallery-archive-card-label">{item.label}</p>
                    <p className="gallery-archive-card-val">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════ */}
        <footer className="gallery-footer-wrap">
          <div className="gallery-container gallery-footer">
            <div className="gallery-footer-logo">
              <div className="gallery-footer-icon">
                <Image src="/logo.png" alt="WorkoutNow" width={24} height={24} className="object-contain" />
              </div>
              <span className="gallery-footer-name">WorkoutNow</span>
            </div>

            <p className="gallery-footer-copy">
              © {new Date().getFullYear()} — Free &amp; Open Source
            </p>

            <div className="gallery-footer-links">
              <Link href="/login"  className="gallery-footer-link">Sign In</Link>
              <Link href="/signup" className="gallery-footer-link">Sign Up</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* ── Theme tokens (light default, dark override) ── */
        .gallery-root {
          --g-bg:           #f6f6f3;
          --g-fg:           #111111;
          --g-fg-hi:        rgba(17,17,17,0.62);
          --g-fg-mid:       rgba(17,17,17,0.46);
          --g-fg-lo:        rgba(17,17,17,0.30);
          --g-fg-xs:        rgba(17,17,17,0.18);
          --g-fg-ghost:     rgba(17,17,17,0.04);
          --g-border:       rgba(0,0,0,0.09);
          --g-border-lo:    rgba(0,0,0,0.06);
          --g-border-xs:    rgba(0,0,0,0.04);
          --g-surf:         rgba(0,0,0,0.025);
          --g-surf-2:       rgba(0,0,0,0.03);
          --g-surf-hover:   rgba(0,0,0,0.05);
          --g-header:       rgba(246,246,243,0.92);
          --g-btn-bg:       #111111;
          --g-btn-fg:       #f6f6f3;
          --g-stroke:       rgba(17,17,17,0.14);
          --g-archive-card: rgba(0,0,0,0.04);
          --g-svg-lo:       rgba(17,17,17,0.12);
          --g-svg-mid:      rgba(17,17,17,0.22);
        }
        html.dark .gallery-root {
          --g-bg:           #080808;
          --g-fg:           #eeeeee;
          --g-fg-hi:        rgba(255,255,255,0.65);
          --g-fg-mid:       rgba(255,255,255,0.44);
          --g-fg-lo:        rgba(255,255,255,0.28);
          --g-fg-xs:        rgba(255,255,255,0.18);
          --g-fg-ghost:     rgba(255,255,255,0.025);
          --g-border:       rgba(255,255,255,0.10);
          --g-border-lo:    rgba(255,255,255,0.06);
          --g-border-xs:    rgba(255,255,255,0.04);
          --g-surf:         rgba(255,255,255,0.015);
          --g-surf-2:       rgba(255,255,255,0.018);
          --g-surf-hover:   rgba(255,255,255,0.03);
          --g-header:       rgba(8,8,8,0.88);
          --g-btn-bg:       #eeeeee;
          --g-btn-fg:       #080808;
          --g-stroke:       rgba(255,255,255,0.22);
          --g-archive-card: rgba(0,0,0,0.25);
          --g-svg-lo:       rgba(255,255,255,0.14);
          --g-svg-mid:      rgba(255,255,255,0.28);
        }

        /* Reset & root */
        .gallery-root {
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--g-bg);
          color: var(--g-fg);
          font-family: 'Inter', sans-serif;
        }

        /* SVG grain */
        .gallery-grain {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.028;
        }

        /* Scroll progress */
        .gallery-progress {
          position: fixed;
          top: 0; left: 0;
          height: 1px;
          width: var(--scroll-pct, 0%);
          background: #6366f1;
          z-index: 200;
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(99,102,241,0.6);
        }

        /* Ambient glow */
        .gallery-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.07) 0%, transparent 65%);
        }
        html.dark .gallery-glow {
          background: radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.10) 0%, transparent 65%);
        }

        /* Layout helpers */
        .gallery-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        @media (min-width: 1024px) {
          .gallery-container { padding-left: 2.5rem; padding-right: 2.5rem; }
        }

        /* ── NAVBAR ── */
        .gallery-header {
          border-bottom: 1px solid var(--g-border-lo);
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--g-header);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .gallery-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
        }
        .gallery-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
        }
        .gallery-logo-icon {
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          background: #fff;
          overflow: hidden;
        }
        .gallery-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--g-fg);
        }
        .gallery-nav-links {
          display: none;
          align-items: center;
          gap: 2.5rem;
        }
        @media (min-width: 1024px) { .gallery-nav-links { display: flex; } }
        .gallery-nav-link {
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--g-fg-mid);
          text-decoration: none;
          transition: color 0.2s;
        }
        .gallery-nav-link:hover { color: var(--g-fg); }
        .gallery-nav-actions {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .gallery-btn-ghost {
          display: none;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--g-fg-mid);
          padding: 0.35rem 0.875rem;
          border: 1px solid var(--g-border);
          border-radius: 2px;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
        }
        @media (min-width: 640px) { .gallery-btn-ghost { display: inline-flex; } }
        .gallery-btn-ghost:hover { color: var(--g-fg); border-color: var(--g-border); }
        .gallery-btn-solid {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--g-btn-fg); background: var(--g-btn-bg);
          padding: 0.35rem 1rem;
          border-radius: 2px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .gallery-btn-solid:hover { opacity: 0.85; }
        .gallery-btn-icon { font-size: 0.8rem !important; line-height: 1 !important; }
        .gallery-theme-toggle {
          background: transparent !important;
          border: 1px solid var(--g-border) !important;
          border-radius: 2px !important;
          color: var(--g-fg-mid) !important;
          box-shadow: none !important;
        }
        .gallery-theme-toggle:hover {
          background: var(--g-surf) !important;
          color: var(--g-fg) !important;
        }

        /* ── HERO ── */
        .gallery-hero {
          min-height: calc(100vh - 56px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 4rem;
          padding-bottom: 5rem;
          position: relative;
          overflow: hidden;
        }
        /* cursor spotlight */
        .gallery-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle 500px at var(--mx, 50%) var(--my, 40%), rgba(99,102,241,0.05), transparent 60%);
        }
        .gallery-hero-grid {
          display: grid;
          gap: 3rem;
          align-items: center;
          width: 100%;
          position: relative;
        }
        @media (min-width: 1024px) {
          .gallery-hero-grid { grid-template-columns: 1fr 420px; gap: 5rem; }
        }

        /* Vertical edge label */
        .gallery-edge-label {
          display: none;
          position: absolute;
          left: -2.5rem;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          transform-origin: center;
          font-size: 0.52rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--g-fg-xs);
          white-space: nowrap;
        }
        @media (min-width: 1280px) { .gallery-edge-label { display: block; } }

        .gallery-eyebrow {
          display: flex; align-items: center; gap: 1rem;
          font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--g-fg-lo);
          margin-bottom: 2rem;
        }
        .gallery-eyebrow-line {
          display: inline-block; width: 2rem; height: 1px;
          background: var(--g-fg-lo);
          flex-shrink: 0;
        }
        .gallery-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.05em;
          color: var(--g-fg);
        }
        .gallery-h1-outline {
          -webkit-text-stroke: 1px var(--g-stroke);
          color: transparent;
        }
        .gallery-accent-rule {
          width: 2.5rem; height: 2px;
          background: #6366f1;
          margin: 2.25rem 0;
        }
        .gallery-hero-body {
          max-width: 44ch;
          font-size: 1rem; line-height: 1.85;
          color: var(--g-fg-mid);
        }
        .gallery-cta-row {
          display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem;
          margin-top: 2.25rem;
        }
        .gallery-cta-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #6366f1; color: #fff;
          padding: 0.75rem 1.875rem;
          border-radius: 2px;
          font-size: 0.775rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 0 40px rgba(99,102,241,0.22);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .gallery-cta-primary:hover {
          background: #7577f2;
          box-shadow: 0 0 60px rgba(99,102,241,0.42);
        }
        .gallery-cta-outline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid var(--g-border);
          color: var(--g-fg-hi);
          padding: 0.75rem 1.875rem;
          border-radius: 2px;
          font-size: 0.775rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
        }
        .gallery-cta-outline:hover { color: var(--g-fg); border-color: var(--g-fg-lo); }
        .gallery-stats {
          display: flex; gap: 0;
          border-top: 1px solid var(--g-border-lo);
          padding-top: 2rem;
          margin-top: 2.75rem;
          max-width: 22rem;
        }
        .gallery-stat { padding-right: 2rem; }
        .gallery-stat-val {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem; font-weight: 800;
          letter-spacing: -0.04em; line-height: 1;
          color: var(--g-fg);
        }
        .gallery-stat-sub {
          font-size: 0.58rem; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--g-fg-lo);
          margin-top: 0.4rem;
        }

        /* Scroll cue */
        .gallery-scroll-cue {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          animation: scroll-cue-pulse 2.4s ease-in-out infinite;
        }
        .gallery-scroll-line {
          display: block;
          width: 1px;
          height: 2.5rem;
          background: linear-gradient(to bottom, var(--g-fg-lo), transparent);
        }
        .gallery-scroll-text {
          font-size: 0.52rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--g-fg-xs);
        }
        @keyframes scroll-cue-pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) translateY(0); }
          50%       { opacity: 0.4; transform: translateX(-50%) translateY(6px); }
        }

        /* ── TICKER ── */
        .gallery-ticker-wrap {
          border-top: 1px solid var(--g-border-lo);
          border-bottom: 1px solid var(--g-border-lo);
          overflow: hidden;
          padding: 0.875rem 0;
        }
        .gallery-ticker {
          display: flex; gap: 0; width: max-content; white-space: nowrap;
          animation: gallery-marquee 28s linear infinite;
        }
        .gallery-ticker-item {
          font-size: 0.62rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--g-fg-xs);
          user-select: none; padding-right: 2rem;
        }
        .gallery-ticker-sep { color: rgba(99,102,241,0.5); margin: 0 0.5rem; }
        @keyframes gallery-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ── SHARED SECTION ── */
        .gallery-section {
          padding-top: 5.5rem; padding-bottom: 5.5rem;
        }
        .gallery-section-bordered {
          border-top: 1px solid var(--g-border-lo);
          padding-top: 5.5rem; padding-bottom: 5.5rem;
        }
        .gallery-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 3.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--g-border-lo);
        }
        .gallery-section-label {
          font-size: 0.6rem; letter-spacing: 0.35em;
          text-transform: uppercase; color: var(--g-fg-lo);
          margin-bottom: 0.625rem;
        }
        .gallery-section-count {
          font-size: 0.6rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--g-fg-xs);
        }
        .gallery-h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800; letter-spacing: -0.04em; line-height: 1;
          color: var(--g-fg);
        }
        .gallery-label {
          font-size: 0.6rem; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--g-fg-lo);
        }

        /* ── COLLECTION GRID ── */
        .gallery-grid-3 {
          display: grid; gap: 1.25rem;
        }
        @media (min-width: 768px) { .gallery-grid-3 { grid-template-columns: repeat(3, 1fr); } }
        .gallery-card {
          border: 1px solid var(--g-border-lo);
          border-radius: 2px;
          padding: 2rem;
          background: var(--g-surf);
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .gallery-card:hover {
          border-color: var(--g-border);
          background: var(--g-surf-hover);
        }
        .gallery-card-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.75rem;
        }
        .gallery-card-rule {
          width: 1.5rem; height: 2px;
          background: rgba(99,102,241,0.5);
          margin-bottom: 1.5rem;
        }
        .gallery-card-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.125rem; font-weight: 700;
          letter-spacing: -0.02em; color: var(--g-fg);
          margin-bottom: 0.625rem;
        }
        .gallery-card-body {
          font-size: 0.875rem; line-height: 1.8;
          color: var(--g-fg-mid);
        }

        /* ── EXHIBITION ── */
        .gallery-exhibition-grid {
          display: grid; gap: 4rem; align-items: start;
        }
        @media (min-width: 1024px) {
          .gallery-exhibition-grid { grid-template-columns: 1fr 2fr; }
          .gallery-exhibition-label { position: sticky; top: 5rem; }
        }
        .gallery-exhibition-sub {
          font-size: 0.875rem; line-height: 1.85;
          color: var(--g-fg-mid);
          margin-top: 1.25rem;
          max-width: 30ch;
        }
        .gallery-step {
          display: grid;
          grid-template-columns: 3rem 1fr;
          gap: 1.5rem;
        }
        .gallery-step-border {
          padding-bottom: 3rem;
          border-bottom: 1px solid var(--g-border-lo);
          margin-bottom: 3rem;
        }
        .gallery-step-no {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.68rem; letter-spacing: 0.18em;
          color: var(--g-fg-xs); text-transform: uppercase;
          padding-top: 0.125rem;
        }
        .gallery-step-tag {
          font-size: 0.58rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(99,102,241,0.65);
          margin-bottom: 0.625rem;
        }
        .gallery-step-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.375rem; font-weight: 700;
          letter-spacing: -0.03em; color: var(--g-fg);
          margin-bottom: 0.625rem;
        }
        .gallery-step-body {
          font-size: 0.9rem; line-height: 1.85;
          color: var(--g-fg-mid); max-width: 52ch;
        }

        /* ── ARCHIVE ── */
        .gallery-archive-panel {
          border: 1px solid var(--g-border-lo);
          border-radius: 2px;
          padding: 3.5rem;
          background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.02) 50%, transparent 100%);
          position: relative; overflow: hidden;
        }
        @media (max-width: 640px) { .gallery-archive-panel { padding: 2rem; } }
        .gallery-archive-ghost {
          position: absolute; right: 1rem; top: 50%;
          transform: translateY(-50%);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14rem; font-weight: 900;
          color: var(--g-fg-ghost);
          letter-spacing: -0.08em; line-height: 1;
          pointer-events: none; user-select: none;
        }
        .gallery-archive-inner {
          position: relative;
          display: grid; gap: 3rem; align-items: center;
        }
        @media (min-width: 1024px) {
          .gallery-archive-inner { grid-template-columns: 1fr auto; }
        }
        .gallery-archive-body {
          font-size: 0.9rem; line-height: 1.85;
          color: var(--g-fg-mid); max-width: 44ch;
          margin-top: 1.25rem; margin-bottom: 2.5rem;
        }
        .gallery-archive-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
          min-width: 270px;
        }
        .gallery-archive-card {
          border: 1px solid var(--g-border-lo);
          border-radius: 2px; padding: 1.25rem;
          background: var(--g-archive-card);
        }
        .gallery-archive-card-label {
          font-size: 0.62rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--g-fg-lo);
          margin-bottom: 0.25rem;
        }
        .gallery-archive-card-val {
          font-size: 0.875rem; font-weight: 600;
          color: var(--g-fg-hi);
        }

        /* ── FOOTER ── */
        .gallery-footer-wrap {
          border-top: 1px solid var(--g-border-lo);
        }
        .gallery-footer {
          display: flex; flex-direction: column;
          align-items: center; justify-content: space-between;
          gap: 1rem; padding-top: 2rem; padding-bottom: 2rem;
        }
        @media (min-width: 640px) { .gallery-footer { flex-direction: row; } }
        .gallery-footer-logo { display: flex; align-items: center; gap: 0.625rem; }
        .gallery-footer-icon {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; background: #fff; overflow: hidden;
        }
        .gallery-footer-name {
          font-size: 0.8rem; font-weight: 700;
          color: var(--g-fg-mid); letter-spacing: -0.01em;
        }
        .gallery-footer-copy {
          font-size: 0.6rem; letter-spacing: 0.25em;
          text-transform: uppercase; color: var(--g-fg-xs);
        }
        .gallery-footer-links { display: flex; align-items: center; gap: 1.5rem; }
        .gallery-footer-link {
          font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--g-fg-lo);
          text-decoration: none; transition: color 0.2s;
        }
        .gallery-footer-link:hover { color: var(--g-fg-hi); }

        /* ── EXERCISE ROWS (used by SpecimenCard) ── */
        .gallery-exercise-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.875rem 1.5rem;
          transition: background 0.15s;
          cursor: default;
        }
        .gallery-exercise-row:hover { background: var(--g-surf); }
        .gallery-exercise-row-border { border-bottom: 1px solid var(--g-border-xs); }
        .gallery-exercise-left { display: flex; align-items: center; gap: 0.875rem; }
        .gallery-exercise-num {
          font-size: 0.58rem; letter-spacing: 0.12em;
          color: var(--g-fg-xs); min-width: 1.2rem;
          font-variant-numeric: tabular-nums;
        }
        .gallery-exercise-name {
          font-size: 0.72rem; letter-spacing: 0.07em;
          text-transform: uppercase; font-weight: 500;
          color: var(--g-fg-hi);
        }
        .gallery-exercise-detail {
          font-size: 0.68rem; letter-spacing: 0.08em;
          color: var(--g-fg-lo);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
