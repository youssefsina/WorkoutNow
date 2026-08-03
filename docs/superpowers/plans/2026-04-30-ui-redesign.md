# WorkoutNow UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the purple/indigo AI-template aesthetic with a bold editorial fitness design — warm cream backgrounds, near-black text, and a strong red accent (#E8452A) throughout the entire app.

**Architecture:** Update CSS design tokens first (all semantic color references cascade), then rebuild the landing page from scratch, then update layout shell components and auth pages. Protected app pages inherit new colors automatically from CSS vars.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS (CSS vars), Framer Motion, Space Grotesk + Inter fonts

---

## File Map

| File | Change |
|------|--------|
| `src/app/globals.css` | New color tokens: red primary, cream bg, charcoal dark |
| `tailwind.config.ts` | Extended: custom shadows, animation tokens |
| `src/app/page.tsx` | Complete rewrite: editorial landing page |
| `src/components/layout/Sidebar.tsx` | Dark sidebar with red active states |
| `src/components/layout/BottomNav.tsx` | Red active state, adaptive glass |
| `src/components/layout/Header.tsx` | Remove violet gradient line |
| `src/app/(protected)/dashboard/page.tsx` | Update bar/welcome card colors |
| `src/app/(auth)/login/page.tsx` | Cream bg, clean editorial auth |
| `src/app/(auth)/signup/page.tsx` | Cream bg, clean editorial auth |

---

### Task 1: Update Design Tokens

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] Replace indigo primary with bold red `hsl(9, 78%, 52%)` in light mode
- [ ] Set background to warm cream `hsl(30, 25%, 96%)` in light mode
- [ ] Set dark background to deep charcoal `hsl(220, 15%, 7%)`
- [ ] Update all chart colors (red, orange, teal, yellow, green)
- [ ] Add custom shadow and animation utilities to tailwind.config.ts
- [ ] Commit

### Task 2: Rebuild Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Remove LiquidChrome import and dark overlay
- [ ] Cream/warm background, near-black text
- [ ] Editorial nav: logo left, links center, Login + Get Started right
- [ ] Hero: bold headline left, X-shaped CSS visual right
- [ ] Stats bar below hero
- [ ] Features section with clean cards
- [ ] CTA section
- [ ] Footer
- [ ] Commit

### Task 3: Update Sidebar

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`

- [ ] Replace `bg-primary dark:bg-[hsl(238,22%,10%)]` with always-dark near-black
- [ ] Red active indicator and icon color
- [ ] Commit

### Task 4: Update BottomNav

**Files:**
- Modify: `src/components/layout/BottomNav.tsx`

- [ ] Replace purple pill active color with red
- [ ] Adaptive glass: white glass in light, dark glass in dark
- [ ] Commit

### Task 5: Update Header

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] Remove `from-primary to-violet-500` gradient
- [ ] Use single-color red border or no decorative line
- [ ] Commit

### Task 6: Update Dashboard Colors

**Files:**
- Modify: `src/app/(protected)/dashboard/page.tsx`

- [ ] Update `barActive` from indigo to red
- [ ] Update `barHas` to red/warm tones
- [ ] Update welcome card from `from-primary to-violet-700` to red gradient
- [ ] Commit

### Task 7: Update Auth Pages

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/signup/page.tsx`

- [ ] Replace `radial-gradient from-primary/20` bg with cream side-split layout
- [ ] Clean editorial card design
- [ ] Commit
