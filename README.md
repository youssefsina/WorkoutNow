# WorkoutNow

*AI-powered workout generator with an interactive body map, exercise library, and progress tracking.*

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

[Live Demo](https://workout-now-rho.vercel.app/) · [Report Bug](https://github.com/youssefsina/WorkoutNow/issues) · [Request Feature](https://github.com/youssefsina/WorkoutNow/issues)

## Features

- 🗺️ **Interactive Body Map**: Click muscles on a front/back SVG body to target them.
- ⚡ **Workout Generator**: 3-step wizard to pick equipment and muscles for a personalized workout.
- 📖 **Exercise Library**: Rich exercise cards with images, sets/reps, instructions, and tips.
- 📊 **Progress Dashboard**: Track streaks, total workouts, and personal records.
- ❤️ **Favorites**: Bookmark exercises for quick access later on.
- 🏆 **Leaderboard**: Compare your workout streaks with the community.
- 🔐 **Secure Auth**: Sign-up and sign-in seamlessly via Supabase Auth.
- 🌗 **Dark Mode**: Full light and dark theme support for your preference.
- 📱 **Mobile Responsive**: Designed mobile-first to work perfectly on any screen size.

## Getting Started

### Prerequisites

You will need the following installed on your machine:
- Node.js (version 18 or higher)
- npm, yarn, or pnpm
- A PostgreSQL database (or a Supabase project)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/youssefsina/WorkoutNow.git
```

2. Navigate into the project directory:
```bash
cd WorkoutNow
```

3. Install the project dependencies:
```bash
npm install
```

4. Configure your environment variables (see next section):
```bash
cp .env.example .env.local
```

5. Set up the Prisma database schema:
```bash
npx prisma generate
npx prisma db push
```

6. Start the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous API key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (for server-side admin actions). |
| `DATABASE_URL` | PostgreSQL connection string (e.g., Supabase db URL). |
| `EXERCISEDB_API_KEY` | API key from RapidAPI for the ExerciseDB service. |
| `EXERCISEDB_API_HOST` | The host URL for ExerciseDB (`exercisedb.p.rapidapi.com`). |

## Features Breakdown

### Interactive Muscle Targeting
- Select specific muscle groups using a detailed SVG-based anatomical body map.
- Muscles light up with corresponding colors when selected.
- Toggle between front and back views to select underlying or hidden muscles.

### Intelligent Workout Generation
- Pick your available equipment (dumbbells, barbells, bodyweight, machines, etc.).
- Combine equipment constraints with targeted muscles to generate a cohesive routine.
- Browse the generated routine in an interactive slider / grid view.

### Social & Competitive Elements
- Build workout streaks by returning to the app consistently.
- Engage with peers through the global leaderboard based on streak lengths.
- Personal profiles display detailed workout history and favored exercises.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend / API**: Next.js API Routes
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Animations / Visuals**: GSAP, Three.js, OGL
- **Data Fetching**: custom fetch with ExerciseDB API

## Contributing

1. Fork the Project
2. Create your Feature Branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your Changes:
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the Branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

## License

Distributed under the [MIT License](LICENSE).
