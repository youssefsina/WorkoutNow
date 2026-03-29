"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";

type StaggeredMenuItem = {
  href: string;
  label: string;
  eyebrow?: string;
};

type StaggeredMenuLink = {
  href: string;
  label: string;
};

interface StaggeredMenuProps {
  brand: ReactNode;
  items: StaggeredMenuItem[];
  secondaryLinks?: StaggeredMenuLink[];
  className?: string;
  side?: "left" | "right";
  buttonClassName?: string;
}

export default function StaggeredMenu({
  brand,
  items,
  secondaryLinks = [],
  className = "",
  side = "right",
  buttonClassName = "",
}: StaggeredMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const prelayerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!shellRef.current || !prelayerRef.current || !panelRef.current || !backdropRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const itemRows = gsap.utils.toArray<HTMLElement>("[data-stagger-item]");
      const secondaryRows = gsap.utils.toArray<HTMLElement>("[data-stagger-secondary]");
      const offset = side === "left" ? -110 : 110;

      gsap.set([prelayerRef.current, panelRef.current], { xPercent: offset });
      gsap.set(itemRows, { yPercent: 120, opacity: 0, rotate: 6 });
      gsap.set(secondaryRows, { yPercent: 100, opacity: 0 });
      gsap.set(backdropRef.current, { autoAlpha: 0, pointerEvents: "none" });

      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } });

      timeline
        .to(backdropRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.2 }, 0)
        .to(prelayerRef.current, { xPercent: 0, duration: 0.78 }, 0)
        .to(panelRef.current, { xPercent: 0, duration: 0.9 }, 0.08)
        .to(
          itemRows,
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.7,
            stagger: 0.07,
          },
          0.24,
        )
        .to(
          secondaryRows,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.04,
          },
          0.38,
        );

      timelineRef.current = timeline;
    }, shellRef);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      ctx.revert();
    };
  }, [items, secondaryLinks, side]);

  useEffect(() => {
    if (!timelineRef.current) {
      return;
    }

    if (isOpen) {
      timelineRef.current.play();
      return;
    }

    timelineRef.current.reverse();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div ref={shellRef} className={`relative z-40 ${className}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="landing-staggered-menu"
        onClick={() => setIsOpen((open) => !open)}
        className={`relative z-[70] inline-flex h-12 items-center gap-4 rounded-full border border-white/20 bg-black/35 px-5 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:border-white/40 hover:bg-black/45 ${buttonClassName}`}
      >
        <span className="relative flex w-[4.5rem] justify-start overflow-hidden text-left">
          <span
            className={`transition-transform duration-300 ${isOpen ? "-translate-y-[135%]" : "translate-y-0"}`}
          >
            Menu
          </span>
          <span
            className={`absolute left-0 top-0 transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-[135%]"}`}
          >
            Close
          </span>
        </span>
        <span className="relative block h-3.5 w-5">
          <span
            className={`absolute left-0 top-0 h-px w-5 bg-white transition-all duration-300 ${isOpen ? "top-[0.42rem] rotate-45" : ""}`}
          />
          <span
            className={`absolute left-0 top-[0.42rem] h-px w-5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute left-0 bottom-0 h-px w-5 bg-white transition-all duration-300 ${isOpen ? "bottom-[0.42rem] -rotate-45" : ""}`}
          />
        </span>
      </button>

      <button
        ref={backdropRef}
        type="button"
        aria-label="Close menu"
        onClick={closeMenu}
        className="fixed inset-0 z-40 cursor-default bg-[#040814]/55 backdrop-blur-sm"
      />

      <div
        ref={prelayerRef}
        className={`fixed top-0 z-50 h-screen w-full max-w-[30rem] bg-[#93b6ff]/14 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] md:max-w-[34rem] ${side === "left" ? "left-0" : "right-0"}`}
      />

      <aside
        ref={panelRef}
        id="landing-staggered-menu"
        className={`fixed top-0 z-[60] flex h-screen w-full max-w-[30rem] flex-col overflow-hidden bg-[#050b18]/94 px-6 pb-8 pt-6 text-white shadow-[0_0_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:max-w-[34rem] md:px-8 ${side === "left" ? "left-0 border-r border-white/10" : "right-0 border-l border-white/10"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="max-w-[15rem]">{brand}</div>
          <div className="flex items-center gap-3">
            <span className="text-[0.62rem] uppercase tracking-[0.34em] text-white/45">Workout OS</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/75 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        <nav className="flex-1 py-8">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href} className="overflow-hidden border-b border-white/10 pb-1">
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="group flex items-end justify-between gap-4 py-4 md:py-5"
                >
                  <div className="overflow-hidden">
                    <span
                      data-stagger-item
                      className="block text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-none tracking-[-0.06em] text-white/95 transition duration-300 group-hover:translate-x-2 group-hover:text-[#91b6ff]"
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="overflow-hidden pb-2 text-right">
                    <span
                      data-stagger-item
                      className="block text-[0.68rem] font-medium uppercase tracking-[0.3em] text-white/38"
                    >
                      {item.eyebrow ?? "Open"}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4 border-t border-white/10 pt-5">
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/35">Quick Access</p>
          <div className="flex flex-wrap gap-3">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                data-stagger-secondary
                className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/68 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
