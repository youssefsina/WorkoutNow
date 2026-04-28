<p align="center">
  <img src="logo.png" alt="WorkoutNow Logo" width="100" />
</p>

<h1 align="center">WorkoutNow</h1>

<p align="center">
  <strong>Generate personalised workouts in three steps — pick your equipment, tap target muscles on an interactive body map, and train with video-guided exercises, set tracking, rest timers, and streak-based analytics.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-E91E63?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <a href="https://workout-now-rho.vercel.app">🌐 Live Demo</a> ·
  <a href="#features">✨ Features</a> ·
  <a href="#getting-started">🚀 Getting Started</a> ·
  <a href="#api-routes">📡 API</a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Features](#features)
  - [Smart Workout Generator & Interactive Body Map](#smart-workout-generator--interactive-body-map)
  - [Active Workout Session](#active-workout-session)
  - [Dashboard & Analytics](#dashboard--analytics)
  - [Workout History](#workout-history)
  - [Favourite Exercises](#favourite-exercises)
  - [Profile & Achievements](#profile--achievements)
  - [Landing Page](#landing-page)
  - [Mobile-First Bottom Navigation](#mobile-first-bottom-navigation)
  - [Dark & Light Theme](#dark--light-theme)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Authentication & Route Protection](#authentication--route-protection)
- [State Management](#state-management)
- [Deployment](#deployment)

---

## Overview

WorkoutNow lets users skip the planning and jump straight into training:

1. **Choose equipment** — select what you have available (barbell, dumbbells, cables, bodyweight, machines, kettlebells, resistance bands, etc.)
2. **Target muscles** — tap on an interactive SVG body map to select the muscle groups you want to work
3. **Generate & train** — the app queries ExerciseDB to build a tailored exercise list; the active workout screen walks you through each exercise with video/GIF demos, set counters, rep ranges, and a rest timer

Every completed session is saved automatically. The dashboard visualises streaks, weekly goals, and training hours.

---

## Architecture

```
┌──────────────────────────────────────────────┐
│              Next.js 14 (App Router)         │
│                                              │
│  ┌─────────────────┐   ┌──────────────────┐  │
│  │  React UI/Pages │   │  API Routes      │  │
│  │  (Framer Motion │   │  /api/v1/*       │  │
│  │   + Recharts)   │   │  (JWT-protected) │  │
│  └───────┬─────────┘   └────────┬─────────┘  │
│          │                      │            │
│     lib/api.ts             lib/auth.ts       │
│     (typed fetch)          (JWT verify)      │
│          │                      │            │
│          └──────────┬───────────┘            │
│                     │                        │
│               Prisma ORM                     │
│                     │                        │
└─────────────────────┼────────────────────────┘
                      │
              ┌───────┴────────┐     ┌─────────────────┐
              │  Supabase      │     │  ExerciseDB     │
              │  PostgreSQL    │     │  (RapidAPI)     │
              │  + Auth        │     │  Exercise data  │
              └────────────────┘     └─────────────────┘
```

**Request flow:**
```
Client → lib/api.ts → /api/v1/* → lib/auth.ts (JWT) → Prisma → Supabase DB
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 3** |
| Database | **PostgreSQL** via Supabase |
| ORM | **Prisma 5** |
| Auth | **Supabase Auth** (JWT) |
| State | **Zustand 5** |
| Charts | **Recharts 3** (shadcn-style) |
| Animation | **Framer Motion 12**, GSAP, Three.js, OGL |
| Exercise data | **ExerciseDB** (RapidAPI) |
| Notifications | **react-hot-toast** |
| Deployment | **Vercel** |

---

## Project Structure

```
WorkoutNow/
├── public/
│   ├── logo.png                     # App logo (used as favicon + throughout UI)
│   └── apple-touch-icon.png
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page with LiquidChrome WebGL bg
│   │   ├── layout.tsx               # Root layout (ThemeProvider, Toaster, meta)
│   │   ├── globals.css              # CSS variables, theme tokens, animations
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx       # Sign-in form
│   │   │   └── signup/page.tsx      # Registration form
│   │   ├── (protected)/
│   │   │   ├── dashboard/page.tsx   # Stats, charts, streak, recent activity
│   │   │   ├── workout-generator/
│   │   │   │   └── page.tsx         # 3-step wizard (equipment → muscles → generate)
│   │   │   ├── workout/
│   │   │   │   └── active/page.tsx  # Live workout execution with timer
│   │   │   ├── history/page.tsx     # Paginated session log
│   │   │   ├── favorites/page.tsx   # Saved exercise collection
│   │   │   └── profile/page.tsx     # User settings & achievement badges
│   │   └── api/v1/
│   │       ├── health/route.ts
│   │       ├── exercises/
│   │       │   ├── equipment/route.ts
│   │       │   └── muscles/route.ts
│   │       ├── workouts/
│   │       │   ├── generate/route.ts
│   │       │   ├── complete/route.ts
│   │       │   ├── history/route.ts
│   │       │   ├── favorites/route.ts
│   │       │   ├── favorites/toggle/route.ts
│   │       │   ├── search/route.ts
│   │       │   ├── replace-exercise/route.ts
│   │       │   ├── exercise/[id]/route.ts
│   │       │   └── cache-stats/route.ts
│   │       └── user/
│   │           ├── ensure/route.ts
│   │           ├── profile/route.ts
│   │           └── stats/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # Auth gate + layout wrapper
│   │   │   ├── Header.tsx           # Mobile header (logo + theme toggle)
│   │   │   ├── Sidebar.tsx          # Desktop hover-expand sidebar
│   │   │   └── BottomNav.tsx        # Mobile bottom tab bar (Framer Motion)
│   │   ├── ui/
│   │   │   ├── LiquidChrome.tsx     # WebGL liquid background (OGL shader)
│   │   │   ├── ParticlesBackground.tsx
│   │   │   ├── PlasmaBackground.tsx
│   │   │   ├── Waves.tsx
│   │   │   ├── ColorBends.tsx
│   │   │   ├── Plasma.tsx
│   │   │   ├── FlowingMenu.tsx
│   │   │   ├── StaggeredMenu.tsx
│   │   │   └── ThemeToggle.tsx      # Dark/light mode toggle
│   │   ├── workout/
│   │   │   ├── BodyMap.tsx          # Interactive SVG anatomical body selector
│   │   │   ├── ExerciseCard.tsx
│   │   │   └── ExerciseDetailsModal.tsx
│   │   └── ThemeProvider.tsx        # CSS variable-based theme system
│   ├── lib/
│   │   ├── api.ts                   # Typed fetch wrapper (workoutAPI, userAPI, exerciseAPI)
│   │   ├── auth.ts                  # requireAuth() / isAuthUser() — server-side JWT verify
│   │   ├── exercisedb.ts            # ExerciseDB (RapidAPI) HTTP client
│   │   ├── workoutGeneration.ts     # Generation logic + 24h exercise cache
│   │   ├── prisma.ts                # Singleton PrismaClient
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   ├── store/
│   │   ├── useAuthStore.ts          # Supabase session + user (Zustand)
│   │   └── useWorkoutStore.ts       # Wizard state (persisted to localStorage)
│   └── middleware.ts                # Edge route protection
├── prisma/
│   └── schema.prisma                # Database models & enums
├── .github/
│   └── workflows/
│       └── keep-supabase-alive.yml  # Daily ping to prevent project pausing
├── tailwind.config.ts
├── vercel.json
└── package.json
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Supabase account | — |
| RapidAPI key (ExerciseDB) | — |

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/youssefsina/WorkoutNow.git
cd WorkoutNow

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Fill in your environment variables (see below)

# 5. Push the database schema
npx prisma db push

# 6. Start the dev server
npm run dev
```

The app runs at **`http://localhost:3000`**.

**Other useful commands:**
```bash
npm run build        # prisma generate + next build
npm run lint         # ESLint
npx prisma studio    # Visual database browser
```

---

## Environment Variables

Create a `.env` file in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server-side JWT verification

# Database
DATABASE_URL=                     # Supabase PostgreSQL connection string

# ExerciseDB (RapidAPI)
EXERCISEDB_API_KEY=
EXERCISEDB_API_HOST=
```

---

## Features

### Smart Workout Generator & Interactive Body Map

The generator is a **3-step wizard** at `/workout-generator`:

| Step | What it does |
|------|-------------|
| **1 — Equipment** | Grid of toggleable equipment cards (barbell, dumbbell, cable, machine, kettlebell, resistance band, bodyweight, etc.) with Material Symbols icons. Tap to select; active cards glow with primary-colour ring and checkmark. |
| **2 — Body Map** | Interactive **SVG anatomical body diagram** (`BodyMap.tsx`) showing front + back views. Click a muscle region (chest, back, shoulders, arms, core, glutes, legs, calves) to toggle it — selected muscles glow with the accent colour. Tag chips below the map show active selections. Muscle list is fetched live from the API. |
| **3 — Preview** | Generates exercises by calling ExerciseDB via `/api/v1/workouts/generate`. Results display as `ExerciseCard` components with images, muscle badges, and a "View Details" button opening `ExerciseDetailsModal` with full instructions, tips, and video/GIF. |

### Active Workout Session

Located at `/workout/active`. Real-time workout execution with:

- **Live timer** — elapsed `MM:SS` in monospace format
- **Progress bar** — completed/skipped vs total exercises
- **Exercise card** — video (`.mp4`) or animated GIF demo, floating muscle + equipment badges, sets/reps/rest stats, expandable instructions and pro tips, inline favourite toggle
- **Set tracker** — increments through each set with auto-advance on completion
- **Rest timer** — animated countdown overlay between sets (skippable)
- **Workout queue** — scrollable bottom list with colour-coded status (current, done, skipped)
- **Skip / Save** — per-exercise skip and favourite actions
- **Quit dialog** — confirmation before abandoning mid-session
- **Complete Workout** — saves session (exercise count, names, duration) via API and redirects to dashboard
- **Swipe navigation** — swipe left/right on mobile to browse exercises

### Dashboard & Analytics

Located at `/dashboard`. Full Framer Motion animated dashboard:

- **Gradient welcome card** — personalised greeting (`Welcome back, [name] 👋`) with quick-access CTA buttons to generator and history
- **Stat cards** — 3-column grid showing Total Workouts, This Week count, and Monthly Hours, each with staggered entrance animation
- **Weekly Activity chart** — 7-day bar chart (Recharts) with lime-green highlight for today's bar and theme-adaptive colours
- **Current Streak card** — gradient orange/red card with fire icon, streak count, and personal best record
- **Weekly Goal progress** — animated progress bar (`blue → violet` gradient) tracking 4-session weekly target with motivational nudge or "Goal reached 🎉" badge
- **Recent Activity feed** — last 5 sessions with staggered Framer Motion entrance, showing date, time, duration, and exercise name

### Workout History

Located at `/history`:

- Full paginated log of all completed sessions
- Sessions grouped by date with section headers
- Each entry shows exercise count, first three exercise names, duration, and completion time
- Aggregate stats at the top (total sessions, total training time)
- "Load more" infinite scroll — 20 sessions per page

### Favourite Exercises

Located at `/favorites`:

- Saved collection of exercises bookmarked during workouts
- Cards with exercise image (fetched on demand), body-part badge, and save date
- Remove from favourites via heart toggle
- "View Details" opens the `ExerciseDetailsModal`
- Empty state with CTA to the generator

### Profile & Achievements

Located at `/profile`:

- **Display name** and **avatar** — editable; avatar uploaded to Supabase Storage
- **Physical stats** — weight (kg) and height (cm)
- **Fitness goal** — choose from: Build Muscle, Lose Weight, General Fitness, Increase Strength, Improve Endurance
- **Achievement badges** — 10 milestone badges earned from real stats:

| Badge | Condition |
|-------|-----------|
| 🥇 First Step | 1 workout completed |
| 🏃 Getting Started | 5 workouts |
| 💪 Committed | 10 workouts |
| ⭐ Dedicated | 25 workouts |
| 🔥 Beast Mode | 50 workouts |
| 🔥 On Fire | 3-day streak |
| 🗓️ Week Warrior | 7-day streak |
| 🚀 Unstoppable | 30-day streak |
| ⏱️ Hour Grinder | 60+ min trained in a month |
| 📅 Regular | 4 sessions in one week |

Locked badges appear greyed out; earned badges display gradient icons.

### Landing Page

The root `/` page features:

- **LiquidChrome WebGL background** — an OGL-based shader that responds to mouse movement
- **Feature cards** — Generator, History & Favourites, Progress Dashboard
- **3-step "How It Works"** workflow section
- **Trust stats row** — 3 steps to generate, sessions tracked, 100% free
- **CTAs** — Sign In / Get Started / Star on GitHub
- **Dark/light mode toggle**
- **Responsive** — fully functional on mobile and desktop

### Mobile-First Bottom Navigation

A dark frosted-glass **bottom tab bar** visible on mobile screens:

- **5 tabs**: Home, Generate, History, Favorites, Profile
- **Active state**: lime-green (`#a3e635`) filled icon + label + dot indicator
- **Framer Motion** spring animation with `layoutId` for smooth tab transitions
- **Safe area** support for iPhone notch (`safe-area-inset-bottom`)
- Hidden on desktop — desktop uses the hover-expandable sidebar instead

### Dark & Light Theme

Full dark/light mode support across every page:

- CSS custom properties (`--background`, `--foreground`, `--primary`, etc.) defined in `globals.css`
- `ThemeProvider` wraps the entire app and reads from `localStorage`
- Theme toggle button appears in the mobile header and desktop sidebar
- All charts, cards, and components adapt colours dynamically

---

## API Routes

All protected routes verify the JWT via `requireAuth()` → `isAuthUser()` before any database access.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/exercises/equipment` | List available equipment types |
| `GET` | `/api/v1/exercises/muscles` | List muscle groups |
| `GET` | `/api/v1/workouts/exercise/[id]` | Get full exercise details |
| `POST` | `/api/v1/workouts/generate` | Generate workout from equipment + muscles |
| `POST` | `/api/v1/workouts/complete` | Save a completed session |
| `GET` | `/api/v1/workouts/history` | Paginated session history |
| `GET` | `/api/v1/workouts/favorites` | List saved favourite exercises |
| `POST` | `/api/v1/workouts/favorites/toggle` | Add / remove a favourite |
| `GET` | `/api/v1/workouts/search` | Search exercises by name |
| `POST` | `/api/v1/workouts/replace-exercise` | Swap one exercise for another |
| `GET` | `/api/v1/workouts/cache-stats` | In-memory exercise cache stats |
| `POST` | `/api/v1/user/ensure` | Upsert user row on first login |
| `GET/PATCH` | `/api/v1/user/profile` | Get or update user profile |
| `GET` | `/api/v1/user/stats` | Get workout statistics |

---

## Database Schema

Managed with **Prisma 5**. Core models:

| Model | Description |
|-------|-------------|
| `User` | Supabase Auth UID as PK; display name, avatar, physical stats, fitness goal, streak counters |
| `WorkoutSession` | One row per completed session; exercise count, names array, duration |
| `SessionExercise` | Per-exercise detail within a session (sets, reps, rest, image) |
| `FavoriteExercise` | User ↔ ExerciseDB exercise ID link (with exercise name, image, body part) |
| `Exercise` | Seeded reference data from ExerciseDB |
| `Equipment` | Seeded equipment reference |
| `Muscle` | Seeded muscle groups with primary/secondary exercise relations |

**Enums:**
- `FitnessGoal`: `LOSE_WEIGHT`, `BUILD_MUSCLE`, `STAY_FIT`, `GET_FIT`, `INCREASE_STRENGTH`, `IMPROVE_ENDURANCE`
- `Difficulty`: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`

---

## Authentication & Route Protection

Supabase Auth handles sign-up and sign-in:

1. **Sign in** → Supabase issues a JWT
2. **`useAuthStore.initialize()`** reads the session and calls `userAPI.ensure()` to upsert the Prisma `User` row (keyed by Supabase UID)
3. **`src/middleware.ts`** protects all `(protected)` routes at the edge — unauthenticated requests redirect to `/login`
4. **Every API route** calls `requireAuth()` which verifies the JWT using the Supabase admin client (service role key)

`AppShell` waits for the `initialized` flag before rendering any protected content to prevent flash-of-unauthenticated-content (FOUC).

---

## State Management

Two **Zustand** stores:

### `useAuthStore`
- Supabase session and user object
- `initialize()` — called once on app mount; sets up the auth state listener
- Module-level guards prevent double-initialization in React StrictMode

### `useWorkoutStore`
- Wizard state: `currentStep`, `selectedEquipment`, `selectedMuscles`, `generatedExercises`
- Active workout helpers: `replaceExercise`, `removeExercise`, `reset`
- **Persisted** to `localStorage` under key `workout-wizard-v2` so in-progress workouts survive page refreshes

---

## Deployment

The app is deployed on **Vercel** at [workout-now-rho.vercel.app](https://workout-now-rho.vercel.app).

A GitHub Actions workflow (`.github/workflows/keep-supabase-alive.yml`) runs daily to ping the Supabase API and prevent the free-tier project from pausing due to inactivity.

---

<p align="center">
  <sub>Built by <a href="https://github.com/youssefsina">Youssef Sina</a> · MIT License</sub>
</p>
