# WorkoutNow - Batch File Guide

## Quick Reference

### 📦 Available Batch Files

1. **start.bat** - Full menu with all options
2. **quick-start.bat** - Instantly start both servers
3. **stop-servers.bat** - Stop all running servers

---

## 🚀 Usage

### Option 1: Full Menu (Recommended)
Double-click **`start.bat`** to open the interactive menu:

```
[1] Start Backend Server (Port 4000)
[2] Start Frontend Server (Port 3001)
[3] Start Both Servers
[4] Kill All Node Processes
[5] Install Dependencies (Backend + Frontend)
[6] Install Backend Dependencies Only
[7] Install Frontend Dependencies Only
[8] Generate Prisma Client
[9] Run Database Migrations
[0] Exit
```

### Option 2: Quick Start
Double-click **`quick-start.bat`** to immediately start both servers.
- Backend: http://localhost:4000
- Frontend: http://localhost:3001

### Option 3: Stop Servers
Double-click **`stop-servers.bat`** to kill all Node.js processes and free up ports.

---

## 📋 Menu Options Explained

### [1] Start Backend Server
- Starts Express.js backend on port 4000
- Opens in a new terminal window
- API endpoints available at http://localhost:4000/api/v1/*

### [2] Start Frontend Server
- Starts Next.js frontend on port 3001
- Opens in a new terminal window
- Open browser to http://localhost:3001

### [3] Start Both Servers
- Starts backend first, waits 2 seconds
- Then starts frontend
- Both open in separate terminal windows

### [4] Kill All Node Processes
- Stops all running Node.js processes
- Frees ports 4000 and 3001
- Use this if servers are stuck or you get "port already in use" errors

### [5] Install Dependencies (Both)
- Runs `npm install` in backend folder
- Runs `npm install` in frontend folder
- Use when first setting up the project

### [6] Install Backend Dependencies Only
- Runs `npm install` in backend folder only

### [7] Install Frontend Dependencies Only
- Runs `npm install` in frontend folder only

### [8] Generate Prisma Client
- Runs `npx prisma generate` in backend
- Generates TypeScript types from Prisma schema
- Run this after modifying `backend/prisma/schema.prisma`

### [9] Run Database Migrations
- Runs `npx prisma migrate dev` in backend
- Applies database schema changes
- Requires DATABASE_URL in `backend/.env`

---

## 🔧 First Time Setup

1. Double-click **`start.bat`**
2. Choose option **[5]** to install all dependencies
3. Wait for installation to complete
4. Choose option **[8]** to generate Prisma client
5. Choose option **[3]** to start both servers
6. Open browser to http://localhost:3001

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
3. Open http://localhost:3001

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
