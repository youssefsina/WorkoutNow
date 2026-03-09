# WorkoutNow v2.0 — Architecture Guide

## Overview

WorkoutNow is an **AI-powered workout generator** rebuilt with a separated client-server architecture, Supabase Auth, MUI premium UI, and cloud-synced data.

---

## Project Structure

```
WorkoutNow/
├── package.json              # Monorepo root — concurrently runs both
├── server/                   # Express REST API (port 4000)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma     # User, WorkoutSession, FavoriteExercise, etc.
│   └── src/
│       ├── index.ts           # Express app entry — helmet, cors, rate-limit
│       ├── config/index.ts    # Centralized env config
│       ├── middleware/
│       │   ├── auth.ts        # Supabase JWT verification (requireAuth, optionalAuth)
│       │   ├── rateLimiter.ts # general / auth / workout generation limiters
│       │   └── validate.ts    # Zod body/query validators
│       ├── controllers/
│       │   ├── user.controller.ts      # Profile CRUD, stats, streak
│       │   ├── workout.controller.ts   # Generate, complete, history, favorites
│       │   └── exercise.controller.ts  # Equipment & muscle lists (cached)
│       ├── routes/
│       │   ├── index.ts       # Mounts /user, /workouts, /exercises
│       │   ├── user.routes.ts
│       │   ├── workout.routes.ts
│       │   └── exercise.routes.ts
│       └── services/
│           ├── prisma.ts      # Singleton PrismaClient
│           └── exercisedb.ts  # ExerciseDB API client (RapidAPI)
│
├── client/                    # Next.js 14 App Router (port 3000)
│   ├── package.json
│   ├── next.config.js         # API proxy rewrites to Express, image remotes
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── middleware.ts       # Route protection (redirect unauthed)
│       ├── theme/
│       │   ├── theme.ts        # MUI dark theme — Electric Blue + Neon Purple
│       │   └── ThemeRegistry.tsx
│       ├── lib/
│       │   ├── api.ts          # Axios + JWT interceptor, typed API helpers
│       │   └── supabase/
│       │       ├── client.ts   # Browser Supabase client
│       │       ├── server.ts   # Server Supabase client (cookies)
│       │       └── middleware.ts
│       ├── store/
│       │   ├── useAuthStore.ts   # Auth state, sign in/up/out, Google OAuth
│       │   └── useWorkoutStore.ts # Wizard state, equipment/muscles/exercises
│       ├── app/
│       │   ├── layout.tsx      # Root: ThemeRegistry, fonts, metadata
│       │   ├── page.tsx        # Landing page (hero, stats, CTAs)
│       │   ├── globals.css     # Base styles, scrollbar, selection
│       │   ├── auth/callback/route.ts  # OAuth code exchange
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── signup/page.tsx
│       │   └── (protected)/
│       │       ├── dashboard/
│       │       │   ├── layout.tsx  # AppShell wrapper
│       │       │   └── page.tsx    # Bento grid stats, streak, recent activity
│       │       ├── workout-generator/
│       │       │   ├── layout.tsx
│       │       │   └── page.tsx    # 3-step wizard (equipment → muscles → preview)
│       │       ├── workout/
│       │       │   ├── layout.tsx
│       │       │   └── active/page.tsx  # Exercise player with timer, favorites
│       │       ├── history/
│       │       │   ├── layout.tsx
│       │       │   └── page.tsx    # Paginated workout log, grouped by date
│       │       └── profile/
│       │           ├── layout.tsx
│       │           └── page.tsx    # Settings: name, weight, height, goal
│       └── components/
│           ├── layout/
│           │   ├── AppShell.tsx    # Auth-guarded wrapper (sidebar + header + mobile nav)
│           │   ├── Sidebar.tsx     # Desktop 260px permanent drawer
│           │   ├── Header.tsx      # Mobile-only sticky AppBar
│           │   └── MobileNav.tsx   # Fixed bottom mobile nav
│           ├── dashboard/
│           │   ├── StatCard.tsx    # Gradient stat card with glow
│           │   └── StreakCounter.tsx # Streak display with "On Fire!" badge
│           └── ui/
│               ├── GlassCard.tsx   # Glassmorphism card with hover scale
│               ├── NeonButton.tsx  # Gradient button with neon glow shadow
│               └── AnimatedPage.tsx # Page transition wrapper
```

---

## Tech Stack

| Layer       | Technology                                       |
| ----------- | ------------------------------------------------ |
| Backend     | Express.js, Node.js, TypeScript                  |
| Database    | PostgreSQL (Supabase), Prisma ORM                |
| Auth        | Supabase Auth (email/password + Google OAuth)     |
| Frontend    | Next.js 14 (App Router), React 18                |
| UI          | MUI v5, Emotion, Framer Motion                   |
| State       | Zustand (persist middleware)                      |
| HTTP Client | Axios (JWT interceptor)                           |
| API Source  | ExerciseDB (RapidAPI) — 800+ exercises with GIFs |
| Security    | Helmet, CORS, Rate Limiting, JWT verification     |
| Validation  | Zod schemas                                      |

---

## Security Architecture

1. **Supabase Auth** handles user registration, login, and OAuth flows
2. **JWT tokens** are attached to every API request via Axios interceptor  
3. **Express `requireAuth` middleware** verifies tokens using Supabase JWT secret
4. **Rate limiters** protect against brute-force (auth: 10/15min, workout gen: 20/15min)
5. **Next.js middleware** redirects unauthenticated users away from protected routes
6. **Helmet** sets secure HTTP headers on all Express responses

---

## UI Design System

- **Theme:** Cyber-aesthetic dark mode
- **Primary:** Electric Blue `#00D4FF`
- **Secondary:** Neon Purple `#A855F7`
- **Background:** Deep Black `#050510`
- **Cards:** Glassmorphism — `backdrop-filter: blur(20px)`, translucent borders
- **Buttons:** Gradient fills with neon glow box-shadows
- **Typography:** Inter (body), Outfit (headings)
- **Animations:** Framer Motion — staggered entries, hover scales, page transitions

---

## Running the Project

```bash
# 1. Install all dependencies
npm run install:all

# 2. Copy env files and fill in values
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Push database schema
npm run db:push

# 4. Start both server and client
npm run dev
```

- **Server:** http://localhost:4000 (health check at `/api/v1/health`)
- **Client:** http://localhost:3000

---

## API Endpoints

### User (`/api/v1/user`) — all require auth
| Method | Path       | Description            |
| ------ | ---------- | ---------------------- |
| GET    | `/profile` | Get user profile       |
| PUT    | `/profile` | Update profile         |
| GET    | `/stats`   | Workout stats & streak |
| POST   | `/ensure`  | Ensure user record     |

### Workouts (`/api/v1/workouts`) — all require auth
| Method | Path                | Description           |
| ------ | ------------------- | --------------------- |
| POST   | `/generate`         | Generate workout      |
| POST   | `/replace-exercise` | Swap an exercise      |
| POST   | `/complete`         | Save completed workout|
| GET    | `/history`          | Paginated history     |
| GET    | `/favorites`        | List favorites        |
| POST   | `/favorites/toggle` | Toggle favorite       |
| GET    | `/search`           | Search exercises      |

### Exercises (`/api/v1/exercises`) — public
| Method | Path         | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/equipment` | All equipment     |
| GET    | `/muscles`   | All muscle groups |
