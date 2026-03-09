@echo off
title WorkoutNow - Quick Start
color 0B

echo ========================================
echo     WORKOUTNOW - QUICK START
echo ========================================
echo.
echo Starting Backend Server (Port 4000)...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Port 3001)...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3001
echo.
echo Open your browser to: http://localhost:3001
echo.
echo Press any key to close this window...
pause >nul
