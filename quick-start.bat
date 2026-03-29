@echo off
title WorkoutNow - Quick Start
color 0B
setlocal
pushd "%~dp0"

echo ========================================
echo     WORKOUTNOW - QUICK START
echo ========================================
echo.
echo Starting Main App (Port 3000)...
start "WorkoutNow App" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Landing Page (Port 3001)...
pushd landing
start "Landing Page" cmd /k "npm run dev"
popd

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Main App: http://localhost:3000
echo Landing:  http://localhost:3001
echo.
echo Open your browser to: http://localhost:3001
echo.
echo Press any key to close this window...
pause >nul
