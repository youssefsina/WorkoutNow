# WorkoutNow - Quick Design Summary

## 🎯 What is WorkoutNow?
A fitness app that generates personalized workouts using AI and a database of 1300+ exercises with videos and images.

---

## 📱 7 Main Pages

| Page | Purpose | Key Features |
|------|---------|--------------|
| **Login/Signup** | Authentication | Email/password, simple clean form |
| **Dashboard** | Home screen | Stats, streaks, recent workouts, quick actions |
| **Workout Generator** | Create workout | 2-step wizard: pick equipment → pick muscles → get workout |
| **Active Workout** | During exercise | Exercise images/videos, timer, set tracking, reps input |
| **Favorites** | Saved exercises | Grid of favorite exercises with images |
| **History** | Past workouts | Timeline of completed workouts |
| **Profile** | User settings | Profile info, stats, settings, logout |

---

## 🎨 Current Design

**Colors:**
- Primary: Professional Blue (#2563EB)
- Success: Green (#10B981)
- Background: White cards on light gray (#F9FAFB)

**Style:**
- Clean, modern, professional
- White cards with subtle shadows
- Blue accents for interactive elements
- Material-UI components

---

## 🔑 Key Components to Design

### 1. **Dashboard Hero**
```
┌─────────────────────────────────────────┐
│ Welcome back, John                      │
│ Keep your momentum...                   │
│                                         │
│ [Generate Workout] [View History]      │
│                                         │
│ Weekly Progress: 3/4 sessions (75%)    │
└─────────────────────────────────────────┘
```

### 2. **Stats Cards** (3 across)
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│   42     │ │    3     │ │   12h    │
│ Total    │ │This Week │ │ Monthly  │
│Workouts  │ │          │ │  Hours   │
└──────────┘ └──────────┘ └──────────┘
```

### 3. **Exercise Card**
```
┌─────────────────────────────┐
│  [Exercise Image/Video]     │
│                             │
│  Bench Press                │
│  Chest • Dumbbell           │
│                             │
│  [♻ Shuffle] [🗑️ Delete] [❤️] │
└─────────────────────────────┘
```

### 4. **Workout Generator Steps**

**Step 1:**
```
What equipment do you have?

[ Dumbbell ]  [ Barbell ]  [ Body Weight ]
[ Resistance Band ]  [ Kettlebell ]

                          [Next →]
```

**Step 2:**
```
Which muscles do you want to target?

[ Chest ]  [ Back ]  [ Shoulders ]
[ Arms ]   [ Legs ]  [ Core ]

[← Back]           [Generate Workout]
```

### 5. **Active Workout**
```
┌─────────────────────────────────┐
│ Workout 1               ⏱️ 12:45  │
│                                  │
│ 1. Bench Press                   │
│    [Exercise Image]              │
│    Sets: ○○○                     │
│    Reps: [12] [10] [8]          │
│                                  │
│ 2. Dumbbell Rows                 │
│    ...                           │
│                                  │
│ [Complete Workout]               │
└─────────────────────────────────┘
```

### 6. **Navigation** (Desktop Sidebar)
```
┌──────────────┐
│ WorkoutNow   │
│ ⚡           │
├──────────────┤
│ 🏠 Dashboard │
│ ✨ Generator │
│ ❤️  Favorites│
│ 📅 History   │
│ 👤 Profile   │
├──────────────┤
│ 👤 John      │
│ john@email   │
│ Sign Out     │
└──────────────┘
```

---

## 📐 Layout Structure

```
Desktop View:
┌────────┬─────────────────────────────────┐
│        │ Dashboard                       │
│ Side   ├─────────────────────────────────┤
│ bar    │ [Hero Section]                  │
│        │                                 │
│ Nav    │ [Stats Cards x3]                │
│        │                                 │
│ Items  │ [Recent Activity]               │
│        │                                 │
└────────┴─────────────────────────────────┘

Mobile View:
┌─────────────────────┐
│ Dashboard           │
├─────────────────────┤
│ [Hero Section]      │
│                     │
│ [Stats Cards]       │
│ (stacked)           │
│                     │
│ [Recent Activity]   │
│                     │
├─────────────────────┤
│ Bottom Nav          │
│ [Home][Gen][Fav]   │
└─────────────────────┘
```

---

## ✨ What Needs Design?

### Priority 1: Core Screens
- ✅ Dashboard layout (hero + stats + recent)
- ✅ Workout generator 2-step wizard
- ✅ Active workout interface
- ✅ Exercise cards (with image/video)

### Priority 2: Supporting Screens
- ✅ Favorites grid
- ✅ History timeline
- ✅ Profile page
- ✅ Login/signup forms

### Priority 3: Components
- ✅ Navigation (sidebar + mobile)
- ✅ Empty states
- ✅ Loading states
- ✅ Success/error messages

---

## 🎨 Design Style Goals

1. **Professional**: Clean, modern, not gamified
2. **Motivating**: Show progress, streaks, achievements
3. **Easy to Use**: Clear buttons, obvious actions
4. **Mobile-First**: Works great on phone
5. **Visual**: Exercise images/videos prominent

---

## 📊 Current vs Desired

| Aspect | Current | Desired |
|--------|---------|---------|
| **Colors** | Blue + White | Keep clean but add more visual interest |
| **Layout** | Functional | More polished, better spacing |
| **Exercise Cards** | Basic | Make images/videos stand out more |
| **Stats** | Simple numbers | More engaging visualizations |
| **Navigation** | Standard | Smooth, intuitive |
| **Overall Feel** | Minimalist | Professional + engaging |

---

## 🖼️ Visual References/Inspiration

Think:
- Nike Training Club (clean, professional)
- Strava (stats-focused, motivating)
- Notion (organized, scannable)
- Apple Fitness+ (visual, video-centric)
- NOT: Gamified, cartoon-y, too colorful

---

## 📱 Technical Notes

- Built with Next.js 14 + TypeScript
- Material-UI for components
- Responsive: Mobile, Tablet, Desktop
- Animations with Framer Motion
- ExerciseDB API for exercise data

---

## 📝 Format for Deliverables

Please provide:
1. **Figma/Sketch files** (preferred)
2. **Design system** (colors, typography, components)
3. **Desktop + Mobile versions**
4. **Key interactions noted**
5. **Asset exports** (icons, images if custom)

---

**Questions?** Contact: [Your contact info]

---

## 🚀 Quick Stats

- **7 main pages**
- **~15 unique components**
- **3 user flows** (generate → workout → complete)
- **1300+ exercises** with images/videos
- **Mobile + Desktop** responsive design
