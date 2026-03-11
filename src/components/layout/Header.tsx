"use client";

export default function Header() {
  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined filled text-lg">bolt</span>
          </div>
          <span className="text-base font-bold tracking-tight">WorkoutNow</span>
        </div>
      </header>
    </>
  );
}
