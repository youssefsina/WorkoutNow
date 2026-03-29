# WorkoutNow - Batch File Guide

## Quick Reference

### 📦 Available Batch Files

1. **start.bat** - Full menu with all options
2. **quick-start.bat** - Instantly start main app + landing
3. **run-all.bat** - Installs deps if needed, then starts main app + landing
4. **stop-servers.bat** - Stop all running servers

---

## 🚀 Usage

### Option 1: Full Menu (Recommended)
Double-click **`start.bat`** to open the interactive menu:

```
[1] Start Main App (Port 3000)
[2] Start Landing Page (Port 3001)
[3] Start Both
[4] Kill All Node Processes
[5] Install Dependencies (Main + Landing)
[6] Install Main App Dependencies Only
[7] Install Landing Dependencies Only
[8] Generate Prisma Client
[9] Run Database Migrations
[0] Exit
```

### Option 2: Quick Start
Double-click **`quick-start.bat`** to immediately start main app + landing.
- Main App: http://localhost:3000
- Landing: http://localhost:3001

### Option 3: Run All (Auto Install)
Double-click **`run-all.bat`** to install dependencies if missing, then start main app + landing.

### Option 3: Stop Servers
Double-click **`stop-servers.bat`** to kill all Node.js processes and free up ports.

---

## 📋 Menu Options Explained

### [1] Start Main App
- Starts Next.js app on port 3000 (includes API routes)
- Opens in a new terminal window
- App available at http://localhost:3000

### [2] Start Landing Page
- Starts Next.js landing on port 3001
- Opens in a new terminal window
- Open browser to http://localhost:3001

### [3] Start Both
- Starts main app first, waits 2 seconds
- Then starts landing
- Both open in separate terminal windows

### [4] Kill All Node Processes
- Stops all running Node.js processes
- Frees ports 3000 and 3001
- Use this if servers are stuck or you get "port already in use" errors

### [5] Install Dependencies (Both)
- Runs `npm install` in project root
- Runs `npm install` in landing folder
- Use when first setting up the project

### [6] Install Main App Dependencies Only
- Runs `npm install` in project root only

### [7] Install Landing Dependencies Only
- Runs `npm install` in landing folder only

### [8] Generate Prisma Client
- Runs `npx prisma generate` in project root
- Generates TypeScript types from Prisma schema
- Run this after modifying `prisma/schema.prisma`

### [9] Run Database Migrations
- Runs `npx prisma migrate dev` in project root
- Applies database schema changes
- Requires DATABASE_URL in `.env.local`

---

## 🔧 First Time Setup

1. Double-click **`start.bat`**
2. Choose option **[5]** to install all dependencies
3. Wait for installation to complete
4. Choose option **[8]** to generate Prisma client
5. Choose option **[3]** to start both
6. Open browser to http://localhost:3000

---

## ⚠️ Troubleshooting

### Port Already in Use
- Run **`stop-servers.bat`** to kill all Node processes
- Or choose option **[4]** from the menu

### Cannot Find Module Error
- Choose option **[5]** to reinstall all dependencies

### Prisma Errors
- Choose option **[8]** to regenerate Prisma client
- Check `backend/.env` for correct DATABASE_URL

### Server Won't Start
- Option **[4]** to kill processes
- Close any terminal windows manually
- Check for other applications using ports 4000 or 3001

---

## 💡 Tips

- Keep the terminal windows open to see server logs
- Backend must be running for frontend API calls to work
- Use Ctrl+C in the terminal windows to stop individual servers
- The menu automatically returns after each operation

---

## 🎯 Common Workflows

### Daily Development
1. Double-click **`quick-start.bat`**
2. Wait for servers to start
3. Open http://localhost:3000

### Clean Start
1. Run **`stop-servers.bat`**
2. Run **`quick-start.bat`**

### After Code Changes
- Frontend: Auto-reloads (Hot Module Replacement)
- Backend: Auto-restarts (nodemon/ts-node-dev)

### After Schema Changes
1. Choose option **[8]** - Generate Prisma Client
2. Backend will auto-restart

---

Enjoy developing with WorkoutNow! 🏋️‍♂️
