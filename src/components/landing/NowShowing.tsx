"use client";

const ARTWORKS = [
  {
    id: "PUSH",
    title: "Push",
    subtitle: "Upper Strength",
    medium: "Chest · Shoulders · Triceps",
    edition: "Vol. I",
    svg: (
      <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden>
        <defs>
          <linearGradient id="ns-push-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const y = 30 + i * 24;
          const w = 200 - i * 22;
          const opacity = 0.12 + i * 0.11;
          return (
            <rect key={i} x="30" y={y} width={w} height={7} rx="1"
              fill={i < 4 ? `rgba(99,102,241,${opacity})` : "var(--g-svg-lo)"} />
          );
        })}
        <rect x="30" y="54" width="200" height="7" rx="1" fill="url(#ns-push-grad)" />
        {[30, 80, 130, 180, 230].map((x) => (
          <line key={x} x1={x} y1="178" x2={x} y2="172" stroke="var(--g-svg-lo)" strokeWidth="1" />
        ))}
        <line x1="30" y1="180" x2="230" y2="180" stroke="var(--g-svg-lo)" strokeWidth="1" />
        <circle cx="234" cy="32" r="3" fill="#6366f1" opacity="0.8" />
      </svg>
    ),
  },
  {
    id: "PULL",
    title: "Pull",
    subtitle: "Back Depth",
    medium: "Back · Biceps · Rear Delts",
    edition: "Vol. II",
    svg: (
      <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden>
        <defs>
          <radialGradient id="ns-pull-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[70, 55, 40, 28, 18, 10].map((r, i) => (
          <circle key={r} cx="130" cy="100" r={r}
            fill="none"
            stroke={i === 0 ? "rgba(99,102,241,0.55)" : "var(--g-svg-lo)"}
            strokeWidth={i === 0 ? "1.5" : "1"} />
        ))}
        <circle cx="130" cy="100" r="70" fill="url(#ns-pull-grad)" />
        <circle cx="130" cy="100" r="3.5" fill="#6366f1" opacity="0.9" />
        <line x1="30" y1="100" x2="80" y2="100" stroke="var(--g-svg-lo)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="180" y1="100" x2="230" y2="100" stroke="var(--g-svg-lo)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="130" y1="20" x2="130" y2="70" stroke="var(--g-svg-lo)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1="130" y1="130" x2="130" y2="180" stroke="var(--g-svg-lo)" strokeWidth="1" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    id: "LEGS",
    title: "Legs",
    subtitle: "Foundation",
    medium: "Quads · Hamstrings · Glutes",
    edition: "Vol. III",
    svg: (
      <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden>
        <defs>
          <linearGradient id="ns-legs-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon points="130,28 210,168 50,168" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5" />
        <polygon points="130,55 188,168 72,168"  fill="rgba(99,102,241,0.06)" stroke="var(--g-svg-lo)" strokeWidth="1" />
        <polygon points="130,82 166,168 94,168"  fill="rgba(99,102,241,0.10)" stroke="var(--g-svg-lo)" strokeWidth="1" />
        <polygon points="130,109 144,168 116,168" fill="url(#ns-legs-grad)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
        <line x1="30" y1="168" x2="230" y2="168" stroke="var(--g-svg-mid)" strokeWidth="1" />
        <circle cx="130" cy="28" r="2.5" fill="#6366f1" opacity="0.85" />
        {[50, 72, 94, 116, 144, 166, 188, 210].map((x) => (
          <line key={x} x1={x} y1="168" x2={x} y2="174" stroke="var(--g-svg-lo)" strokeWidth="1" />
        ))}
      </svg>
    ),
  },
];

export default function NowShowing() {
  return (
    <section className="ns-section">
      <div className="ns-container">
        {/* Section header */}
        <div className="ns-header">
          <div>
            <div className="ns-label">Now Showing</div>
            <h2 className="ns-h2">The Catalogue</h2>
          </div>
          <span className="ns-count">03 works</span>
        </div>

        {/* Artwork grid */}
        <div className="ns-grid">
          {ARTWORKS.map((art) => (
            <article key={art.id} className="ns-card">
              <div className="ns-art-area">
                <div className="ns-art-id">{art.id}</div>
                {art.svg}
              </div>
              <div className="ns-divider" />
              <div className="ns-meta">
                <div className="ns-meta-left">
                  <h3 className="ns-title">{art.title}</h3>
                  <p className="ns-subtitle">{art.subtitle}</p>
                </div>
                <div className="ns-meta-right">
                  <span className="ns-edition">{art.edition}</span>
                </div>
              </div>
              <div className="ns-medium">{art.medium}</div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .ns-section {
          border-top: 1px solid var(--g-border-lo);
          padding-top: 5.5rem;
          padding-bottom: 5.5rem;
        }
        .ns-container {
          max-width: 1280px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        @media (min-width: 1024px) {
          .ns-container { padding-left: 2.5rem; padding-right: 2.5rem; }
        }
        .ns-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 3.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--g-border-lo);
        }
        .ns-label {
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--g-fg-lo);
          margin-bottom: 0.625rem;
        }
        .ns-h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--g-fg);
        }
        .ns-count {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--g-fg-xs);
        }
        .ns-grid {
          display: grid;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .ns-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .ns-card {
          border: 1px solid var(--g-border-lo);
          border-radius: 2px;
          background: var(--g-surf);
          overflow: hidden;
          transition: border-color 0.25s, background 0.25s;
          cursor: default;
        }
        .ns-card:hover {
          border-color: var(--g-border);
          background: var(--g-surf-hover);
        }
        .ns-art-area {
          position: relative;
          padding: 2rem 2rem 1.25rem;
          background:
            linear-gradient(180deg, rgba(99,102,241,0.04) 0%, transparent 100%),
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%);
          border-bottom: 1px solid var(--g-border-xs);
        }
        .ns-art-id {
          position: absolute;
          top: 1.125rem;
          left: 1.5rem;
          font-size: 0.56rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--g-fg-xs);
        }
        .ns-divider {
          height: 1px;
          background: var(--g-border-xs);
        }
        .ns-meta {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.125rem 1.375rem 0.5rem;
        }
        .ns-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--g-fg);
          margin-bottom: 0.2rem;
        }
        .ns-subtitle {
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          color: var(--g-fg-lo);
          text-transform: uppercase;
        }
        .ns-edition {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(99,102,241,0.75);
          padding: 0.18rem 0.5rem;
          border: 1px solid rgba(99,102,241,0.28);
          border-radius: 1px;
          white-space: nowrap;
        }
        .ns-medium {
          padding: 0 1.375rem 1.25rem;
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--g-fg-xs);
        }
      `}</style>
    </section>
  );
}
