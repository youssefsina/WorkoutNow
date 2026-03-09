# WorkoutNow - Design Brief

## 📱 Application Overview
**WorkoutNow** is a modern fitness workout generator app that helps users create personalized workout routines. The app uses the ExerciseDB API to provide 1300+ exercises with images and videos.

---

## 🎨 Current Design System

### Color Palette
- **Primary Blue**: #2563EB (Professional blue for main actions)
- **Success Green**: #10B981 (Progress, success states)
- **Warning Orange**: #F59E0B (Alerts, warnings)
- **Error Red**: #EF4444 (Errors, deletions)
- **White**: #FFFFFF (Card backgrounds)
- **Light Gray**: #F9FAFB (Page backgrounds)
- **Border Light**: #E5E7EB (Borders, dividers)
- **Text Primary**: #111827 (Main text)
- **Text Secondary**: #6B7280 (Supporting text)

### Typography
- **Font Family**: 'Inter', 'Outfit', sans-serif
- **Weights**: 500 (regular), 600 (medium), 700 (bold), 800-900 (extra bold for headings)

### Design Style
- Clean, modern, professional aesthetic
- White cards with subtle shadows
- Smooth animations and transitions
- Responsive design (mobile, tablet, desktop)
- Material-UI components with custom styling

---

## 📄 Pages & Features

### 1. **Authentication Pages**

#### Login Page (`/login`)
- Title: "Welcome Back"
- Email input field
- Password input field (with show/hide toggle)
- "Sign In" button (primary blue)
- Link to signup page
- Clean, centered card layout

#### Signup Page (`/signup`)
- Title: "Create Account"
- Display name input field
- Email input field
- Password input field (with show/hide toggle)
- "Create Account" button (primary blue)
- Link to login page

---

### 2. **Dashboard Page** (`/dashboard`)

#### Hero Section
- **Personalized greeting**: "Welcome back, [Name]"
- **Date chip**: Shows current date
- **Weekly progress chip**: "X/4 weekly sessions"
- **Motivational text**: Short encouraging message
- **Primary CTA**: "Generate Workout" button (with AutoAwesome icon)
- **Secondary CTA**: "View History" button

#### Weekly Consistency Card
- Circular progress indicator showing weekly goal completion
- Percentage display
- Progress bar
- Stats breakdown:
  - Monthly hours
  - Current streak (days)

#### Stats Cards (3 cards in a row)
1. **Total Workouts**
   - Number display
   - "All time completed" subtitle
   - Fitness icon
   - Blue accent color

2. **This Week**
   - Number display
   - Dynamic subtitle based on progress
   - Trending up icon
   - Green accent color

3. **Monthly Hours**
   - Hours display (e.g., "12h")
   - "Last 30 days" subtitle
   - Clock icon
   - Green accent color

#### Streak Counter Card
- **Current Streak** display (large number + "days")
- Fire icon (orange when streak ≥3 days)
- Status chip: "On Fire" or "Build Momentum"
- **Best Streak** badge (trophy icon)

#### Recent Activity Section
- Title: "Recent Activity"
- "View All" link
- List of recent workouts showing:
  - Exercise count
  - Duration
  - Date/time
  - Exercise names (first few)
- Empty state: Shows when no workouts exist

---

### 3. **Workout Generator Page** (`/workout-generator`)

#### Multi-Step Form

**Step 1: Choose Equipment**
- Title: "What equipment do you have?"
- Grid of equipment cards (selectable):
  - Dumbbells
  - Barbell
  - Body Weight
  - Resistance Bands
  - Kettlebell
  - Cable Machine
  - Exercise Ball
  - etc.
- Each card shows icon + name
- "Next" button

**Step 2: Target Muscles**
- Title: "Which muscles do you want to target?"
- Grid of muscle group cards (selectable):
  - Chest
  - Back
  - Shoulders
  - Arms (Biceps/Triceps)
  - Legs (Quads/Hamstrings)
  - Core
  - Glutes
  - Cardio
  - etc.
- Each card shows icon + name
- "Back" and "Generate Workout" buttons

#### Generated Workout Display
- Success message with green checkmark icon
- Number of exercises generated
- "Start Workout" primary button
- "Regenerate" secondary button
- Grid of exercise cards showing:
  - Exercise image
  - Exercise name
  - Target muscle (chip)
  - Equipment needed (chip)
  - "Shuffle" button (refresh icon)
  - "Delete" button (trash icon)

---

### 4. **Active Workout Page** (`/workout/active`)

#### Workout Header
- Workout title
- Timer display (showing elapsed time)
- Timer icon

#### Exercise List
- Sequential list of exercises (numbered)
- Each exercise card shows:
  - Exercise image/video
  - Exercise name
  - Target muscle + Equipment chips
  - Sets/Reps input section:
    - Set number counter
    - Reps input field
    - Add set button
    - Complete set checkmark
  - Instructions section (expandable)
  - Heart icon to favorite

#### Action Buttons
- "Add Random Exercise" (primary)
- "Complete Workout" (success green)
- "Cancel Workout" (secondary)

---

### 5. **Favorites Page** (`/favorites`)

#### Page Header
- Title: "Favorite Exercises"
- Count: "X saved exercises"

#### Favorites Grid
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Each favorite card shows:
  - Exercise image
  - Exercise name
  - Body part chip (with muscle group)
  - Heart icon (filled, clickable to remove)
- Hover effects: Card lifts slightly

#### Empty State
- Large fitness icon
- "No favorites yet" heading
- "Tap the heart icon during a workout to save exercises here" text

---

### 6. **History Page** (`/history`)

#### Page Header
- Title: "Workout History"
- Subtitle showing total workouts

#### History List
- Timeline/list of completed workouts
- Each workout card shows:
  - Date (formatted: "Jan 15, 2026")
  - Time (e.g., "2:30 PM")
  - Duration (e.g., "45 minutes")
  - Exercise count (e.g., "8 exercises")
  - Exercise names list
  - Calendar icon

#### Empty State
- "No workouts yet" message
- Call to action to generate first workout

---

### 7. **Profile Page** (`/profile`)

#### Profile Header
- Large avatar (with user initial)
- User's name
- Email address
- "Edit Profile" button

#### Profile Stats
- Total workouts
- Total duration (hours)
- Current streak
- Longest streak
- Join date

#### Settings Section
- **Display Name** field (editable)
- **Email** (read-only)
- **Notifications** toggles:
  - Workout reminders
  - Weekly goals
  - Achievement badges

#### Account Actions
- "Change Password" button
- "Sign Out" button (red)
- "Delete Account" button (danger zone)

---

## 🧩 Shared Components

### Layout Components

#### Sidebar (Desktop)
- WorkoutNow logo (blue lightning bolt icon + text)
- Navigation menu items:
  - Dashboard (home icon)
  - Generator (sparkle icon)
  - Favorites (heart icon)
  - History (calendar icon)
  - Profile (person icon)
- Active state: Blue background, bold text, indicator dot
- User section at bottom:
  - User avatar
  - Name + email
  - Sign out button

#### Mobile Navigation (Bottom Bar)
- Fixed bottom navigation (shows on mobile)
- Same menu items as sidebar
- Active state: Blue icons
- Indicator dot on active item

#### Header (Mobile)
- WorkoutNow logo
- Menu toggle button (mobile only)

---

### UI Components

#### Button Variants
- **Primary**: Blue background, white text
- **Secondary**: White background, blue text, blue border
- **Outlined**: Transparent, blue border and text
- **Text**: No background, blue text
- **Success**: Green background (for completing actions)
- **Error**: Red background (for destructive actions)

#### Cards
- White background
- Light gray border
- Subtle shadow (increases on hover)
- Rounded corners (16px)
- Padding: 20-24px

#### Chips/Tags
- Small rounded pills
- Light colored backgrounds (color at 8% opacity)
- Colored text matching the background
- Used for: muscle groups, equipment, status badges

#### Progress Indicators
- Linear progress bars (blue)
- Circular progress (for weekly goals)
- Loading spinners (blue)

#### Input Fields
- Light gray border
- Rounded corners (12px)
- Blue focus state
- Label above input
- Error states (red border + error text)

---

## 🎭 Interactions & Animations

### Page Transitions
- Fade up animation on page load
- Stagger effect for grid items
- Duration: 0.3-0.5s

### Hover States
- Cards: Lift slightly (translateY -2px)
- Buttons: Darken background
- Links: Underline or color change

### Loading States
- Skeleton screens for data loading
- Spinner for actions in progress
- Disabled state for buttons during loading

### Success/Error Feedback
- Toast notifications (top-right corner)
- Success: Green with checkmark
- Error: Red with X icon
- 3-5 second auto-dismiss

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column layouts)
- **Tablet**: 768px - 1024px (2 column grids)
- **Desktop**: > 1024px (3 column grids, sidebar visible)

---

## ✨ Design Goals

1. **Clean & Professional**: Modern aesthetic, not gamified or overly colorful
2. **Scannable**: Clear hierarchy, easy to find information
3. **Motivating**: Progress indicators, streaks, achievements
4. **Efficient**: Quick access to key actions (generate, start workout)
5. **Educational**: Clear instructions, proper exercise form via videos
6. **Accessible**: Good contrast ratios, readable text sizes, keyboard navigation

---

## 🎯 Design Priorities

### High Priority
1. Dashboard hero section (main entry point)
2. Workout generator flow (core functionality)
3. Active workout interface (during exercise)
4. Exercise cards (displaying exercise info clearly)

### Medium Priority
5. Navigation (sidebar/mobile nav)
6. Stats cards and visualizations
7. History timeline
8. Favorites grid

### Lower Priority
9. Profile page
10. Settings
11. Empty states
12. Error states

---

## 📸 Visual References

### Current State
- Light theme with white backgrounds
- Professional blue (#2563EB) as primary color
- Material-UI components
- Clean, minimal design
- Good whitespace and breathing room

### Inspiration Keywords
- Modern fitness apps
- Clean dashboards
- Card-based layouts
- Exercise form demos
- Progress tracking

---

## 🔄 Design Deliverables Needed

1. **Updated Dashboard Layout** - Hero section, stats cards, recent activity
2. **Workout Generator Flow** - Step 1 & 2 screens, generated workout display
3. **Exercise Card Design** - Image, info, actions (shuffle, delete, favorite)
4. **Active Workout Interface** - Exercise details, timer, set tracking
5. **Navigation** - Sidebar and mobile bottom nav refinements
6. **Empty States** - For favorites, history, workouts
7. **Loading States** - Skeletons and spinners
8. **Mobile Responsive Views** - All key pages optimized for mobile

---

## 💡 Additional Notes

- Current design is functional but could be more visually engaging
- Consider adding more visual interest while maintaining professionalism
- Exercise cards could use better image/video presentation
- Progress indicators could be more prominent
- Consider micro-interactions for delight (e.g., animated checkmarks)
- Icon set should be consistent throughout

---

**Last Updated**: February 26, 2026
**App Version**: 1.0
**Tech Stack**: Next.js 14, TypeScript, Material-UI, Tailwind CSS
