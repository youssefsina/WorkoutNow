# WorkoutNow

> **WorkoutNow** is a full-stack fitness web app that generates personalized workouts in three steps — pick your equipment, target muscles on an interactive body map, and get a ready-to-go session with video-guided exercises, set/rep tracking, rest timers, and streak-based progress analytics.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [App Setup](#app-setup)
  - [Landing Page Setup](#landing-page-setup)
- [Environment Variables](#environment-variables)
- [Features](#features)
  - [Workout Generator & Interactive Body Map](#workout-generator--interactive-body-map)
  - [Active Workout Session](#active-workout-session)
  - [Dashboard & Analytics](#dashboard--analytics)
  - [Workout History](#workout-history)
  - [Favorite Exercises](#favorite-exercises)
  - [Profile & Achievements](#profile--achievements)
  - [Landing Page](#landing-page)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Authentication & Route Protection](#authentication--route-protection)
- [State Management](#state-management)

---

## Overview

WorkoutNow lets users skip the planning and jump straight into training. The core flow is:

1. **Choose equipment** — select what you have available (barbell, dumbbells, cables, bodyweight, machines, etc.)
2. **Target muscles** — click on an interactive SVG body map to select the muscle groups you want to work
3. **Generate & train** — the app calls ExerciseDB to build a tailored exercise list; the active workout screen then walks you through each exercise with video/GIF demos, set counters, rep ranges, and a rest timer

Every completed session is saved automatically. The dashboard visualizes streaks, weekly goals, and training hours over time.

---

## Architecture

```
┌─────────────────────────────────────────┐    ┌───────────────────────────┐
│           Main App (Next.js 14)         │    │  Landing Page (Next.js 14)│
│                                         │    │  (separate dev server)    │
│  ┌──────────────────┐  ┌─────────────┐  │    │                           │
│  │  React UI / Pages│  │  API Routes │  │    │  WebGL LiquidChrome bg    │
│  │  (App Router)    │  │  /api/v1/*  │  │    │  Feature sections         │
│  └────────┬─────────┘  └──────┬──────┘  │    │  Sign-up CTAs             │
│           │                   │         │    └───────────────────────────┘
│      lib/api.ts            lib/auth.ts  │
│      (fetch wrapper)       (JWT verify) │
│           │                   │         │
│           └─────────┬─────────┘         │
│                     │                   │
│              Prisma ORM                 │
│                     │                   │
└─────────────────────┼───────────────────┘
                      │
              ┌───────┴────────┐
              │  Supabase      │
              │  PostgreSQL DB │
              │  + Auth        │
              └────────────────┘
```

**Request flow:**
```
Client Component → lib/api.ts → /api/v1/* route → lib/auth.ts (JWT verify) → Prisma → Supabase DB
```

The main Next.js app serves both the frontend React pages and the backend API routes. There is no separate Express or FastAPI process — everything runs inside a single Next.js deployment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 5 |
| Auth | Supabase Auth (JWT) |
| State | Zustand 5 |
| Charts | Recharts |
| Animation | GSAP, Three.js, OGL |
| Exercise data | ExerciseDB (RapidAPI) |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## Project Structure

```
WorkoutNow/
├── src/
│   ├── app/
│   │   ├── (auth)/                   # Public auth pages
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (protected)/              # Authenticated pages
│   │   │   ├── dashboard/page.tsx    # Stats, charts, recent activity
│   │   │   ├── workout-generator/    # 3-step generator wizard
│   │   │   │   └── page.tsx
│   │   │   ├── workout/
│   │   │   │   └── active/page.tsx   # Live workout execution
│   │   │   ├── history/page.tsx      # Paginated session log
│   │   │   ├── favorites/page.tsx    # Saved exercise collection
│   │   │   └── profile/page.tsx      # Settings & achievement badges
│   │   ├── api/v1/
│   │   │   ├── exercises/
│   │   │   │   ├── equipment/route.ts
│   │   │   │   └── muscles/route.ts
│   │   │   ├── workouts/
│   │   │   │   ├── generate/route.ts
│   │   │   │   ├── complete/route.ts
│   │   │   │   ├── history/route.ts
│   │   │   │   ├── favorites/route.ts
│   │   │   │   ├── favorites/toggle/route.ts
│   │   │   │   ├── search/route.ts
│   │   │   │   ├── replace-exercise/route.ts
│   │   │   │   ├── exercise/[id]/route.ts
│   │   │   │   └── cache-stats/route.ts
│   │   │   ├── user/
│   │   │   │   ├── ensure/route.ts   # Upsert Prisma user row on login
│   │   │   │   ├── profile/route.ts
│   │   │   │   └── stats/route.ts
│   │   │   └── health/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Root redirect
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Auth gate + layout wrapper
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx           # Desktop navigation
│   │   │   ├── MobileNav.tsx
│   │   │   └── AnimatedMobileNav.tsx # GSAP-animated mobile menu
│   │   ├── ui/
│   │   │   ├── LiquidChrome.tsx      # WebGL liquid background (OGL)
│   │   │   ├── ParticlesBackground.tsx
│   │   │   ├── PlasmaBackground.tsx
│   │   │   ├── Waves.tsx
│   │   │   ├── ColorBends.tsx
│   │   │   ├── Plasma.tsx
│   │   │   ├── FlowingMenu.tsx
│   │   │   ├── StaggeredMenu.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── workout/
│   │   │   ├── BodyMap.tsx           # Interactive SVG body selector
│   │   │   ├── ExerciseCard.tsx      # Exercise preview card
│   │   │   └── ExerciseDetailsModal.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── api.ts                    # Typed fetch wrapper (workoutAPI, userAPI, exerciseAPI)
│   │   ├── auth.ts                   # requireAuth() / isAuthUser() — server-side JWT verify
│   │   ├── exercisedb.ts             # ExerciseDB (RapidAPI) HTTP client
│   │   ├── workoutGeneration.ts      # Generation logic + 24h exercise cache
│   │   ├── prisma.ts                 # Singleton PrismaClient
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   ├── store/
│   │   ├── useAuthStore.ts           # Supabase session + user (Zustand)
│   │   └── useWorkoutStore.ts        # Wizard state (persisted to localStorage)
│   └── middleware.ts                 # Edge route protection
├── landing/                          # Standalone marketing site
│   └── src/
│       ├── app/page.tsx              # One-page site with LiquidChrome background
│       └── components/
│           ├── ui/
│           │   ├── LiquidChrome.tsx
│           │   └── ThemeToggle.tsx
│           └── ThemeProvider.tsx
├── prisma/
│   └── schema.prisma
├── tailwind.config.ts
├── vercel.json
└── CLAUDE.md
```

---

## Getting Started

### Prerequisites

| Requirement | Version |
|------------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Supabase account | — |
| RapidAPI key (ExerciseDB) | — |

### App Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Fill in your environment variables** (see [Environment Variables](#environment-variables))

4. **Push the database schema:**
   ```bash
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

The app runs at `http://localhost:3000`.

**Other useful commands:**
```bash
npm run build        # prisma generate + next build
npm run lint         # ESLint
npx prisma studio    # Visual database browser
```

### Landing Page Setup

The landing page is a separate Next.js app in the `landing/` directory.

1. ```bash
   cd landing && npm install
   ```

2. ```bash
   npm run dev   # runs on http://localhost:3001
   ```

Set `NEXT_PUBLIC_APP_URL` in `landing/.env` to point to the main app URL (defaults to `http://localhost:3000`).

---

## Environment Variables

Create a `.env` file in the root with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # Server-side JWT verification

# Database
DATABASE_URL=                   # Supabase PostgreSQL connection string

# ExerciseDB (RapidAPI)
EXERCISEDB_API_KEY=
EXERCISEDB_API_HOST=
```

---

## Features

### Workout Generator & Interactive Body Map

The generator is a **3-step wizard** located at `/workout-generator`:

**Step 1 — Equipment Selection**

A grid of cards, each representing a piece of gym equipment (barbell, dumbbell, cable, machine, kettlebell, resistance band, bodyweight, etc.). Each card shows a Material Symbols icon mapped to the equipment type. Tap/click to toggle selection; the card highlights with a primary colour ring and a checkmark badge.

**Step 2 — Interactive Body Map**

The centrepiece of the generator. A clickable **SVG anatomical body diagram** (`BodyMap.tsx`) shows the human body from the front and back. Muscle group regions — chest, back, shoulders, arms, core, glutes, legs, calves — are rendered as SVG paths. Clicking a region toggles it on/off: selected muscles glow with the primary accent colour. A tag list below the map shows active selections. The muscle list is fetched live from `/api/v1/exercises/muscles` so it stays in sync with what ExerciseDB can match.

**Step 3 — Workout Preview**

After clicking "Generate Workout", the app calls `/api/v1/workouts/generate` with the selected equipment and muscles. ExerciseDB is queried and the response is mapped to an exercise list with sets, rep ranges, rest periods, and media URLs. Each result renders as an `ExerciseCard` with an image, target muscle badge, and a "View Details" button that opens an `ExerciseDetailsModal` with full instructions, tips, and video. The stepper bar at the top tracks progress across all three steps.

### Active Workout Session

Located at `/workout/active`. Starts immediately after the generator and tracks:

- **Live timer** — elapsed time displayed in `MM:SS` mono format
- **Progress bar** — shows completed/skipped count vs total exercises
- **Exercise card** (swipeable on mobile) — displays the current exercise with:
  - Video (`.mp4`) or animated GIF demo
  - Floating muscle group and equipment badges
  - Sets / Reps / Rest stats row
  - Expandable instructions and pro-tips panel
  - Inline favourite toggle (heart icon)
- **Set tracker** — increments through each set; after the last set the exercise is marked complete
- **Rest timer** — animated countdown overlay after each set; can be skipped
- **Workout queue** — scrollable list at the bottom showing all exercises with colour-coded status (current, done, skipped)
- **Skip / Save** — per-exercise skip and favourite actions
- **Quit dialog** — bottom-sheet confirmation before abandoning mid-session
- **Complete Workout** — saves the session (exercise count, names, duration) via `workoutAPI.complete()` and redirects to the dashboard

Mobile swipe left/right navigates between exercises without tapping the arrows.

### Dashboard & Analytics

Located at `/dashboard`. Displays:

- **Welcome banner** — personalised greeting with quick-access buttons to the generator and history
- **Stat cards** — Total Workouts, This Week, and Monthly Hours (with skeleton loaders)
- **Weekly Activity chart** — 7-day bar chart (Recharts `BarChart`) highlighting today's bar in the primary colour; adapts bar fill to dark/light theme
- **Current Streak card** — gradient orange/red card showing the active daily streak and personal best
- **Weekly Goal bar** — progress towards a 4-session/week target with a motivational nudge or a "Goal reached" badge
- **Recent Activity feed** — last 5 sessions with date, time, duration, and exercise names

### Workout History

Located at `/history`. Full paginated log of all completed sessions:

- Sessions grouped by date with a section header showing the date and session count
- Each entry shows exercise count, the first three exercise names, duration, and completion time
- Aggregate stats at the top (total sessions, total training time)
- "Load more" infinite scroll — fetches 20 sessions per page

### Favorite Exercises

Located at `/favorites`. A saved collection of exercises bookmarked during workouts:

- Cards with exercise image (fetched on demand if missing), body-part badge, and save date
- Remove from favourites with the heart button on the card
- "View Details" opens the `ExerciseDetailsModal` with full instructions, tips, and remove option
- Empty state with CTA to the generator

### Profile & Achievements

Located at `/profile`:

- **Display name** and **avatar** — editable; avatar is uploaded directly to Supabase Storage
- **Physical stats** — weight (kg) and height (cm)
- **Fitness goal** — one of five options: Build Muscle, Lose Weight, General Fitness, Increase Strength, Improve Endurance
- **Achievement badges** — 10 milestone badges earned from real stats:

| Badge | Condition |
|-------|-----------|
| First Step | 1 workout completed |
| Getting Started | 5 workouts |
| Committed | 10 workouts |
| Dedicated | 25 workouts |
| Beast Mode | 50 workouts |
| On Fire | 3-day streak |
| Week Warrior | 7-day streak |
| Unstoppable | 30-day streak |
| Hour Grinder | 60+ min trained in a month |
| Regular | 4 sessions in one week |

Locked badges appear greyed out; earned badges display their gradient icon.

### Landing Page

A standalone marketing site in `landing/` (port 3001). Features:

- **LiquidChrome WebGL background** — an OGL-based shader that responds to mouse movement
- Feature cards (Generator, History & Favourites, Progress Dashboard)
- 3-step "How it works" workflow section
- Trust stats row (3 steps to generate, sessions tracked, 100% free)
- Sign In / Get Started CTAs linking to the main app
- Dark/light mode toggle

---

## API Routes

All protected routes call `requireAuth(request)` then `isAuthUser(result)` before any database access.

```typescript
const auth = await requireAuth(request);
if (!isAuthUser(auth)) return auth; // returns 401 response
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/exercises/equipment` | List available equipment |
| GET | `/api/v1/exercises/muscles` | List muscle groups |
| GET | `/api/v1/workouts/exercise/[id]` | Get full exercise details |
| POST | `/api/v1/workouts/generate` | Generate workout from equipment + muscles |
| POST | `/api/v1/workouts/complete` | Save a completed session |
| GET | `/api/v1/workouts/history` | Paginated session history |
| GET | `/api/v1/workouts/favorites` | List saved favourite exercises |
| POST | `/api/v1/workouts/favorites/toggle` | Add / remove a favourite |
| GET | `/api/v1/workouts/search` | Search exercises by name |
| POST | `/api/v1/workouts/replace-exercise` | Swap one exercise for another |
| GET | `/api/v1/workouts/cache-stats` | In-memory exercise cache stats |
| POST | `/api/v1/user/ensure` | Upsert Prisma user row (called on login) |
| GET/PATCH | `/api/v1/user/profile` | Get or update user profile |
| GET | `/api/v1/user/stats` | Get workout statistics |

---

## Database Schema

Managed with Prisma. Key models:

| Model | Description |
|-------|-------------|
| `User` | Supabase Auth UID as PK; stores display name, avatar, physical stats, fitness goal, streak counters |
| `WorkoutSession` | One row per completed session; stores exercise count, exercise names array, duration |
| `SessionExercise` | Per-exercise detail within a session (sets, reps, rest, image) |
| `FavoriteExercise` | Many-to-many link between a user and an ExerciseDB exercise ID |
| `Exercise` | Seeded reference data from ExerciseDB |
| `Equipment` | Seeded equipment reference |
| `Muscle` | Seeded muscle group reference with primary/secondary exercise relations |

**`FitnessGoal` enum:** `LOSE_WEIGHT`, `BUILD_MUSCLE`, `STAY_FIT`, `GET_FIT`, `INCREASE_STRENGTH`, `IMPROVE_ENDURANCE`

---

## Authentication & Route Protection

Supabase Auth handles sign-up and sign-in. The auth flow:

1. User signs in → Supabase issues a JWT
2. `useAuthStore.initialize()` reads the session and calls `userAPI.ensure()` to upsert the Prisma `User` row (keyed by Supabase UID)
3. `src/middleware.ts` protects all `(protected)` routes at the edge — unauthenticated requests are redirected to `/login`
4. Every protected API route calls `requireAuth()` which verifies the JWT using the Supabase admin client (service role key)

The `useAuthStore` (Zustand, non-persisted) exposes `session`, `user`, `signIn`, `signOut`, and an `initialized` flag. `AppShell` waits for `initialized` before rendering any protected content to prevent flash-of-unauthenticated-content.

---

## State Management

Two Zustand stores:

**`useAuthStore`**
- Supabase session and user object
- `initialize()` — called once on app mount; sets up the auth listener
- Module-level guards prevent double-initialization in React StrictMode

**`useWorkoutStore`**
- Wizard state: `currentStep`, `selectedEquipment`, `selectedMuscles`, `generatedExercises`
- Active workout helpers: `replaceExercise`, `removeExercise`, `reset`
- Persisted to `localStorage` under key `workout-wizard-v2` so the in-progress workout survives page refreshes
