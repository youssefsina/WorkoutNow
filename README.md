# WorkoutNow 💪

A modern fitness workout generator app built with Next.js 14, TypeScript, and ExerciseDB API. Generate personalized workouts with real exercise videos, images, and comprehensive instructions.

![WorkoutNow](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![ExerciseDB](https://img.shields.io/badge/ExerciseDB-API-orange?style=flat-square)

## ✨ Features

### 🎯 Smart Workout Generation
- **Equipment Selection** - Choose your available equipment with modern card UI
- **Muscle Targeting** - Interactive body map to select target muscle groups
- **ExerciseDB Integration** - Real exercises from a database of 1300+ exercises
- **Personalized Workouts** - Get exercises that match your equipment and goals

### 🎬 Rich Exercise Media
- **Exercise Images** - High-quality demonstration images for every exercise
- **Video Tutorials** - MP4 video demonstrations for proper form
- **Detailed Instructions** - Step-by-step instructions for each exercise
- **Exercise Tips** - Pro tips for better performance and safety
- **Muscle Mapping** - See primary and secondary muscles targeted

### ⚡ Exercise Controls
- **Add Exercise** - Add random exercises matching your workout criteria
- **Delete Exercise** - Remove unwanted exercises from your workout
- **Shuffle Exercise** - Replace any exercise with a similar alternative
- **Favorites System** - Save your favorite exercises for quick access

### 📊 Dashboard & Tracking
- **Workout Statistics** - Track total workouts, weekly progress, and monthly duration
- **Workout History** - View all completed workout sessions
- **Recent Activity** - See your recent workouts at a glance
- **Favorites List** - Access your saved exercises anytime
- **Quick Start** - Resume with your last used settings

### 🎨 Modern UI/UX
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Dark/Light Mode** - Comfortable viewing experience anytime
- **Smooth Animations** - Polished transitions and loading states
- **Glassmorphism Effects** - Beautiful modern design aesthetic
- **Loading States** - Clear feedback during API calls

### 💾 Data Persistence
- **localStorage Storage** - No authentication required, data saved locally
- **Workout Sessions** - Automatically save completed workouts
- **Settings Persistence** - Remember your equipment and muscle preferences
- **Favorites Sync** - Your favorites persist across sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- RapidAPI Account (for ExerciseDB API)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/workoutnow.git
cd workoutnow

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env file with:
EXERCISEDB_API_KEY=your_rapidapi_key_here
EXERCISEDB_API_URL=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
EXERCISEDB_API_HOST=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start generating workouts!

### Getting Your ExerciseDB API Key

1. Go to [RapidAPI ExerciseDB](https://rapidapi.com/ascendforger-XQJaLkftNM/api/edb-with-videos-and-images-by-ascendapi)
2. Sign up for a free account
3. Subscribe to the free tier (1000 requests/month)
4. Copy your API key from the dashboard
5. Add it to your `.env` file

##  How to Use

### 1. Generate a Workout
1. Navigate to "Generate Workout" from the dashboard
2. **Select Equipment** - Choose what you have available (dumbbells, barbell, etc.)
3. **Select Muscles** - Pick target muscle groups from the interactive body map
4. Click "Generate Workout" to get your personalized exercise list

### 2. Customize Your Workout
- **Add Exercise** - Click the "+" button to add random exercises
- **Shuffle Exercise** - Click shuffle icon to replace with similar exercise
- **Delete Exercise** - Remove exercises you don't want
- **View Details** - Click "View Details" to see videos, instructions, and tips
- **Save Favorites** - Click the heart icon to save exercises you love

### 3. Start Your Workout
1. Click "Start Workout" when ready
2. Follow along with the WorkoutPlayer
3. Complete exercises with proper form (use videos for reference)
4. Click "Finish Workout" when done

### 4. Track Your Progress
- View completed workouts in Dashboard
- Check your statistics (total workouts, weekly progress, monthly duration)
- Access workout history to see past sessions
- Quick start with your last used settings

## 🎬 Exercise Information

Each exercise includes:
- **Name & Overview** - Clear exercise identification
- **Demonstration Image** - Visual guide for proper form
- **Video Tutorial** - Full movement demonstration (MP4)
- **Step-by-Step Instructions** - Detailed execution guide
- **Pro Tips** - Expert advice for better performance
- **Target Muscles** - Primary muscles worked
- **Secondary Muscles** - Supporting muscle groups
- **Equipment Required** - What you need for the exercise

## 📊 Dashboard Features

### Statistics Cards
- **Total Workouts** - Lifetime workout count
- **This Week** - Current week's progress
- **Monthly Duration** - Time spent working out (last 30 days)

### Quick Actions
- **Generate New Workout** - Start fresh workout generation
- **Quick Start** - Use last session's equipment/muscle settings
- **Recent Activity** - See your last 3 completed workouts

### Favorites
- View all saved favorite exercises
- Quick access to exercise details
- Remove from favorites with one click
- See when each exercise was added

### Workout History
- Complete list of all workout sessions
- Date and duration for each workout
- Exercise count and preview
- Optional workout notes

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **API:** ExerciseDB v2 via RapidAPI (1300+ exercises with images/videos)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** Zustand with persist middleware
- **Storage:** localStorage (client-side, no authentication required)
- **Theme:** next-themes for dark/light mode
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image component

## 📂 Project Structure

```
src/
├── app/
│   ├── workout-generator/      # Workout wizard (equipment, muscles, results)
│   ├── dashboard/              # Stats, favorites, quick start
│   │   └── history/            # Workout history page
│   ├── workout/
│   │   └── active/             # Active workout player
│   ├── actions/
│   │   ├── workout-api.ts      # ExerciseDB API integration
│   │   └── dashboard.ts        # Dashboard server actions
│   └── api/                    # API routes (equipment, muscles, etc.)
├── components/
│   ├── workout-wizard/         # Wizard components
│   │   ├── EquipmentSelector.tsx
│   │   ├── MuscleMap.tsx
│   │   └── WorkoutList.tsx     # Exercise display with controls
│   ├── dashboard/
│   │   ├── DashboardContent.tsx
│   │   └── FavoritesList.tsx
│   ├── workout/
│   │   ├── WorkoutPlayer.tsx   # Active workout interface
│   │   └── MuscleSelector.tsx
│   ├── layout/                 # Navigation components
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── exercisedb.ts           # ExerciseDB API client
│   ├── storage.ts              # localStorage utilities
│   ├── prisma.ts               # Prisma client (optional)
│   └── utils.ts                # Utility functions
├── store/
│   └── useWorkoutStore.ts      # Zustand state management
├── types/
│   └── workout.ts              # TypeScript interfaces
└── prisma/
    └── schema.prisma           # Database schema (optional)
```

## 🔑 Key Files Explained

### API Integration
- **`lib/exercisedb.ts`** - ExerciseDB API client with methods for fetching exercises
- **`app/actions/workout-api.ts`** - Server actions for workout generation

### Storage & State
- **`lib/storage.ts`** - localStorage utilities for workouts, favorites, and settings
- **`store/useWorkoutStore.ts`** - Zustand store for workout wizard state

### Components
- **`WorkoutList.tsx`** - Displays exercises with Add/Delete/Shuffle/Favorite controls
- **`DashboardContent.tsx`** - Shows stats, recent workouts, and favorites
- **`FavoritesList.tsx`** - Favorites display with exercise details
- **`WorkoutPlayer.tsx`** - Interactive workout session interface

### Types
- **`types/workout.ts`** - TypeScript interfaces for exercises, workouts, and sessions

## � Data Storage

### localStorage Schema

All data is stored client-side in browser localStorage - no authentication required!

#### Workout Sessions
```typescript
{
  id: string                    // Unique session ID
  exercises: GeneratedExercise[] // Array of exercises completed
  completedAt: string           // ISO timestamp
  duration?: number             // Duration in minutes
  notes?: string                // Optional workout notes
}
```

#### Favorite Exercises
```typescript
{
  id: string                    // Unique favorite ID
  exercise: GeneratedExercise   // Complete exercise data
  addedAt: string               // ISO timestamp
}
```

#### Last Settings
```typescript
{
  equipment: string[]           // Last selected equipment
  muscles: string[]             // Last selected muscles
  savedAt: string               // ISO timestamp
}
```

### Storage Functions

Available in `src/lib/storage.ts`:

- `saveWorkoutSession()` - Save completed workout
- `getWorkoutSessions()` - Retrieve all sessions
- `getWorkoutStats()` - Calculate statistics
- `toggleFavorite()` - Add/remove favorite
- `getFavorites()` - Get all favorites
- `isFavorite()` - Check if exercise is favorited
- `saveSettings()` - Save equipment/muscle preferences
- `getLastSettings()` - Retrieve last settings
- `clearAllData()` - Reset all stored data

### Data Limits
- **Workout Sessions:** Automatically keeps last 100 sessions
- **Favorites:** No limit
- **Settings:** Most recent only

## 🎨 UI Components

### shadcn/ui Components Used
- **Card** - Exercise cards, stat cards
- **Button** - All interactive buttons
- **Badge** - Muscle tags, difficulty levels
- **Dialog** - Exercise details modal
- **Progress** - Workout wizard progress bar
- **Input** - Search and form inputs

### Custom Components
- **MuscleMap** - Interactive body map for muscle selection
- **EquipmentSelector** - Equipment selection cards
- **WorkoutList** - Exercise list with controls
- **WorkoutPlayer** - Active workout interface
- **ExerciseImage** - Optimized image component with fallbacks

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on localhost:3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# ExerciseDB API Configuration (Required)
EXERCISEDB_API_KEY=your_rapidapi_key_here
EXERCISEDB_API_URL=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
EXERCISEDB_API_HOST=edb-with-videos-and-images-by-ascendapi.p.rapidapi.com
```

### API Rate Limits

**RapidAPI Free Tier:**
- 1000 requests/month
- Rate limited to ensure fair usage

**Optimization:**
- Exercises are fetched only when generating workouts
- Results are cached in Zustand state
- No repeated API calls for same workout

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/workoutnow.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `EXERCISEDB_API_KEY`
     - `EXERCISEDB_API_URL`
     - `EXERCISEDB_API_HOST`
   - Click "Deploy"

3. **Done!** Your app is live at `https://your-app.vercel.app`

### Other Deployment Options

- **Netlify** - Works with same configuration
- **Railway** - Great for full-stack apps
- **Self-hosted** - Use `npm run build` and `npm start`

## 🎯 Development Tips

### Best Practices

- **Type Safety** - Always use TypeScript types, avoid `any`
- **Error Handling** - Use try/catch for API calls
- **Loading States** - Show spinners during async operations
- **Image Optimization** - Use Next.js Image component
- **Responsive Design** - Test on mobile, tablet, and desktop

### Common Tasks

**Add New Exercise Field:**
1. Update `GeneratedExercise` type in `types/workout.ts`
2. Update transform function in `workout-api.ts`
3. Display in `WorkoutList.tsx` component

**Add New Storage Feature:**
1. Add function to `lib/storage.ts`
2. Update component to use new function
3. Test localStorage persistence

**Customize Theme:**
1. Edit `tailwind.config.ts` for colors
2. Update `app/globals.css` for global styles
3. Modify component classes as needed

## 🐛 Troubleshooting

### Common Issues

**API Key Not Working:**
- Verify `.env` file is in project root
- Check API key is correct from RapidAPI dashboard
- Restart dev server after changing `.env`

**Images Not Loading:**
- Check ExerciseDB API is returning `imageUrl`
- Verify Next.js Image component allows external domains
- Check browser console for CORS errors

**localStorage Not Persisting:**
- Check browser allows localStorage
- Verify you're not in incognito/private mode
- Check browser storage limit (usually 5-10MB)

**Build Errors:**
- Run `npm run lint` to check for errors
- Verify all imports are correct
- Check TypeScript types are properly defined

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [ExerciseDB API Docs](https://rapidapi.com/ascendforger-XQJaLkftNM/api/edb-with-videos-and-images-by-ascendapi)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zustand State Management](https://zustand-demo.pmnd.rs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Made with ❤️ using Next.js, TypeScript, and ExerciseDB API**

🏋️ Start your fitness journey today with WorkoutNow!
