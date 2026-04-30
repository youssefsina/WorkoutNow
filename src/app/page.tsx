"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

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

const MOCK_EXERCISES = [
  { name: "BARBELL SQUAT",       detail: "4 × 6–8"   },
  { name: "ROMANIAN DEADLIFT",   detail: "3 × 10–12" },
  { name: "LEG PRESS",           detail: "3 × 12–15" },
  { name: "WALKING LUNGES",      detail: "3 × 20"    },
  { name: "STANDING CALF RAISE", detail: "4 × 15–20" },
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
  return (
    <div className="gallery-root">
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
        <section className="gallery-hero gallery-container">
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

            {/* ── Right: artwork panel ── */}
            <div className="gallery-artwork-wrap">
              <div className="gallery-artwork">
                {/* Artwork header */}
                <div className="gallery-artwork-header">
                  <span className="gallery-label">Curated Workout · Legs</span>
                  <div className="gallery-artwork-dots">
                    <span className="gallery-dot gallery-dot-accent" />
                    <span className="gallery-dot gallery-dot-dim" />
                    <span className="gallery-dot gallery-dot-ghost" />
                  </div>
                </div>

                {/* Exercise list */}
                <div>
                  {MOCK_EXERCISES.map((ex, i) => (
                    <div key={i} className={`gallery-exercise-row${i < MOCK_EXERCISES.length - 1 ? " gallery-exercise-row-border" : ""}`}>
                      <div className="gallery-exercise-left">
                        <span className="gallery-exercise-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="gallery-exercise-name">{ex.name}</span>
                      </div>
                      <span className="gallery-exercise-detail">{ex.detail}</span>
                    </div>
                  ))}
                </div>

                {/* Artwork footer */}
                <div className="gallery-artwork-footer">
                  <span className="gallery-label">Generated · 5 exercises</span>
                  <span className="gallery-artwork-cta">Start →</span>
                </div>
              </div>

              {/* Caption */}
              <div className="gallery-artwork-caption">
                <span>WorkoutNow Generator</span>
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
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
        /* Reset & root */
        .gallery-root {
          min-height: 100vh;
          overflow-x: hidden;
          background: #080808;
          color: #eeeeee;
          font-family: 'Inter', sans-serif;
        }

        /* Ambient glow */
        .gallery-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.09) 0%, transparent 65%);
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
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(8,8,8,0.88);
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
          box-shadow: 0 0 16px rgba(255,255,255,0.07);
        }
        .gallery-logo-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #eeeeee;
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
          color: rgba(255,255,255,0.42);
          text-decoration: none;
          transition: color 0.2s;
        }
        .gallery-nav-link:hover { color: #eeeeee; }
        .gallery-nav-actions {
          display: flex; align-items: center; gap: 0.5rem;
        }
        .gallery-btn-ghost {
          display: none;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          padding: 0.35rem 0.875rem;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
        }
        @media (min-width: 640px) { .gallery-btn-ghost { display: inline-flex; } }
        .gallery-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.24); }
        .gallery-btn-solid {
          display: inline-flex; align-items: center; gap: 0.35rem;
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #080808; background: #eeeeee;
          padding: 0.35rem 1rem;
          border-radius: 2px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .gallery-btn-solid:hover { background: #ffffff; }
        .gallery-btn-icon { font-size: 0.8rem !important; line-height: 1 !important; }
        .gallery-theme-toggle {
          background: transparent !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 2px !important;
          color: rgba(255,255,255,0.45) !important;
          box-shadow: none !important;
        }
        .gallery-theme-toggle:hover {
          background: rgba(255,255,255,0.06) !important;
          color: #fff !important;
        }

        /* ── HERO ── */
        .gallery-hero {
          min-height: calc(100vh - 56px);
          display: flex;
          align-items: center;
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
        .gallery-hero-grid {
          display: grid;
          gap: 3rem;
          align-items: center;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .gallery-hero-grid { grid-template-columns: 1fr 420px; gap: 5rem; }
        }
        .gallery-eyebrow {
          display: flex; align-items: center; gap: 1rem;
          font-size: 0.62rem; letter-spacing: 0.35em; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 2rem;
        }
        .gallery-eyebrow-line {
          display: inline-block; width: 2rem; height: 1px;
          background: rgba(255,255,255,0.28);
          flex-shrink: 0;
        }
        .gallery-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 800;
          line-height: 0.9;
          letter-spacing: -0.05em;
          color: #eeeeee;
        }
        .gallery-h1-outline {
          -webkit-text-stroke: 1px rgba(255,255,255,0.22);
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
          color: rgba(255,255,255,0.44);
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
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.58);
          padding: 0.75rem 1.875rem;
          border-radius: 2px;
          font-size: 0.775rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
        }
        .gallery-cta-outline:hover { color: #fff; border-color: rgba(255,255,255,0.28); }
        .gallery-stats {
          display: flex; gap: 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 2rem;
          margin-top: 2.75rem;
          max-width: 22rem;
        }
        .gallery-stat { padding-right: 2rem; }
        .gallery-stat-val {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem; font-weight: 800;
          letter-spacing: -0.04em; line-height: 1;
        }
        .gallery-stat-sub {
          font-size: 0.58rem; letter-spacing: 0.28em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
          margin-top: 0.4rem;
        }

        /* ── ARTWORK PANEL ── */
        .gallery-artwork-wrap { display: none; }
        @media (min-width: 1024px) { .gallery-artwork-wrap { display: block; } }
        .gallery-artwork {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          background: rgba(255,255,255,0.015);
        }
        .gallery-artwork-header {
          padding: 0.875rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
        }
        .gallery-artwork-dots { display: flex; gap: 5px; align-items: center; }
        .gallery-dot { width: 6px; height: 6px; border-radius: 50%; }
        .gallery-dot-accent  { background: #6366f1; }
        .gallery-dot-dim     { background: rgba(255,255,255,0.15); }
        .gallery-dot-ghost   { background: rgba(255,255,255,0.06); }
        .gallery-exercise-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.875rem 1.5rem;
          transition: background 0.15s;
          cursor: default;
        }
        .gallery-exercise-row:hover { background: rgba(255,255,255,0.03); }
        .gallery-exercise-row-border { border-bottom: 1px solid rgba(255,255,255,0.04); }
        .gallery-exercise-left { display: flex; align-items: center; gap: 0.875rem; }
        .gallery-exercise-num {
          font-size: 0.58rem; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.2); min-width: 1.2rem;
          font-variant-numeric: tabular-nums;
        }
        .gallery-exercise-name {
          font-size: 0.72rem; letter-spacing: 0.07em;
          text-transform: uppercase; font-weight: 500;
          color: rgba(255,255,255,0.85);
        }
        .gallery-exercise-detail {
          font-size: 0.68rem; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.32);
          font-variant-numeric: tabular-nums;
        }
        .gallery-artwork-footer {
          padding: 0.875rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(99,102,241,0.04);
        }
        .gallery-artwork-cta {
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #6366f1;
          padding: 0.22rem 0.6rem;
          border: 1px solid rgba(99,102,241,0.35);
          border-radius: 1px;
        }
        .gallery-artwork-caption {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 0.75rem;
          font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.18);
        }

        /* ── TICKER ── */
        .gallery-ticker-wrap {
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          padding: 0.875rem 0;
        }
        .gallery-ticker {
          display: flex; gap: 0; width: max-content; white-space: nowrap;
          animation: gallery-marquee 28s linear infinite;
        }
        .gallery-ticker-item {
          font-size: 0.62rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
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
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 5.5rem; padding-bottom: 5.5rem;
        }
        .gallery-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 3.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .gallery-section-label {
          font-size: 0.6rem; letter-spacing: 0.35em;
          text-transform: uppercase; color: rgba(255,255,255,0.26);
          margin-bottom: 0.625rem;
        }
        .gallery-section-count {
          font-size: 0.6rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(255,255,255,0.18);
        }
        .gallery-h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800; letter-spacing: -0.04em; line-height: 1;
          color: #eeeeee;
        }
        .gallery-label {
          font-size: 0.6rem; letter-spacing: 0.28em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
        }

        /* ── COLLECTION GRID ── */
        .gallery-grid-3 {
          display: grid; gap: 1.25rem;
        }
        @media (min-width: 768px) { .gallery-grid-3 { grid-template-columns: repeat(3, 1fr); } }
        .gallery-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px;
          padding: 2rem;
          background: rgba(255,255,255,0.018);
          transition: border-color 0.2s, background 0.2s;
          cursor: default;
        }
        .gallery-card:hover {
          border-color: rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.03);
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
          letter-spacing: -0.02em; color: #eeeeee;
          margin-bottom: 0.625rem;
        }
        .gallery-card-body {
          font-size: 0.875rem; line-height: 1.8;
          color: rgba(255,255,255,0.44);
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
          color: rgba(255,255,255,0.38);
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
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 3rem;
        }
        .gallery-step-no {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.68rem; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.2); text-transform: uppercase;
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
          letter-spacing: -0.03em; color: #eeeeee;
          margin-bottom: 0.625rem;
        }
        .gallery-step-body {
          font-size: 0.9rem; line-height: 1.85;
          color: rgba(255,255,255,0.44); max-width: 52ch;
        }

        /* ── ARCHIVE ── */
        .gallery-archive-panel {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px;
          padding: 3.5rem;
          background: linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.03) 50%, transparent 100%);
          position: relative; overflow: hidden;
        }
        @media (max-width: 640px) { .gallery-archive-panel { padding: 2rem; } }
        .gallery-archive-ghost {
          position: absolute; right: 1rem; top: 50%;
          transform: translateY(-50%);
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14rem; font-weight: 900;
          color: rgba(255,255,255,0.025);
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
          color: rgba(255,255,255,0.44); max-width: 44ch;
          margin-top: 1.25rem; margin-bottom: 2.5rem;
        }
        .gallery-archive-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
          min-width: 270px;
        }
        .gallery-archive-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px; padding: 1.25rem;
          background: rgba(0,0,0,0.25);
        }
        .gallery-archive-card-label {
          font-size: 0.62rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
          margin-bottom: 0.25rem;
        }
        .gallery-archive-card-val {
          font-size: 0.875rem; font-weight: 600;
          color: rgba(255,255,255,0.78);
        }

        /* ── FOOTER ── */
        .gallery-footer-wrap {
          border-top: 1px solid rgba(255,255,255,0.06);
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
          color: rgba(255,255,255,0.45); letter-spacing: -0.01em;
        }
        .gallery-footer-copy {
          font-size: 0.6rem; letter-spacing: 0.25em;
          text-transform: uppercase; color: rgba(255,255,255,0.18);
        }
        .gallery-footer-links { display: flex; align-items: center; gap: 1.5rem; }
        .gallery-footer-link {
          font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
          text-decoration: none; transition: color 0.2s;
        }
        .gallery-footer-link:hover { color: rgba(255,255,255,0.65); }
      `}</style>
    </div>
  );
}
