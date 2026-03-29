@echo off
title WorkoutNow - Development Manager
color 0B
setlocal
pushd "%~dp0"

:MENU
cls
echo ========================================
echo     WORKOUTNOW - DEVELOPMENT MENU
echo ========================================
echo.
echo [1] Start Main App (Port 3000)
echo [2] Start Landing Page (Port 3001)
echo [3] Start Both
echo [4] Kill All Node Processes
echo [5] Install Dependencies (Main + Landing)
echo [6] Install Main App Dependencies Only
echo [7] Install Landing Dependencies Only
echo [8] Generate Prisma Client
echo [9] Run Database Migrations
echo [0] Exit
echo.
echo ========================================
set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto BACKEND
if "%choice%"=="2" goto FRONTEND
if "%choice%"=="3" goto BOTH
if "%choice%"=="4" goto KILL
if "%choice%"=="5" goto INSTALL_ALL
if "%choice%"=="6" goto INSTALL_BACKEND
if "%choice%"=="7" goto INSTALL_FRONTEND
if "%choice%"=="8" goto PRISMA
if "%choice%"=="9" goto MIGRATE
if "%choice%"=="0" goto EXIT
goto MENU

:BACKEND
cls
echo ========================================
echo     Starting Main App...
echo ========================================
start "WorkoutNow App (Port 3000)" cmd /k "npm run dev"
echo.
echo Main app started on http://localhost:3000
echo.
pause
goto MENU

:FRONTEND
cls
echo ========================================
echo     Starting Landing Page...
echo ========================================
pushd landing
start "Landing Page (Port 3001)" cmd /k "npm run dev"
popd
echo.
echo Landing page started on http://localhost:3001
echo Open your browser to http://localhost:3001
echo.
pause
goto MENU

:BOTH
cls
echo ========================================
echo     Starting Main App + Landing...
echo ========================================
start "WorkoutNow App (Port 3000)" cmd /k "npm run dev"
timeout /t 2 /nobreak >nul
pushd landing
start "Landing Page (Port 3001)" cmd /k "npm run dev"
popd
echo.
echo ========================================
echo Both started!
echo Main App: http://localhost:3000
echo Landing:  http://localhost:3001
echo ========================================
echo.
pause
goto MENU

:KILL
cls
echo ========================================
echo     Killing All Node Processes...
echo ========================================
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo All Node processes killed successfully!
) else (
    echo No Node processes found.
)
echo.
pause
goto MENU

:INSTALL_ALL
cls
echo ========================================
echo     Installing All Dependencies...
echo ========================================
echo.
echo Installing Main App Dependencies...
call npm install
echo.
echo Installing Landing Dependencies...
pushd landing
call npm install
popd
echo.
echo ========================================
echo All dependencies installed!
echo ========================================
pause
goto MENU

:INSTALL_BACKEND
cls
echo ========================================
echo     Installing Main App Dependencies...
echo ========================================
call npm install
echo.
echo Main app dependencies installed!
pause
goto MENU

:INSTALL_FRONTEND
cls
echo ========================================
echo     Installing Landing Dependencies...
echo ========================================
pushd landing
call npm install
popd
echo.
echo Landing dependencies installed!
pause
goto MENU

:PRISMA
cls
echo ========================================
echo     Generating Prisma Client...
echo ========================================
call npx prisma generate
echo.
echo Prisma client generated!
pause
goto MENU

:MIGRATE
cls
echo ========================================
echo     Running Database Migrations...
echo ========================================
echo.
echo NOTE: This requires a PostgreSQL database connection.
echo Check your .env.local file for DATABASE_URL
echo.
pause
call npx prisma migrate dev
echo.
echo Database migrations completed!
pause
goto MENU

:EXIT
cls
echo ========================================
echo     Exiting...
echo ========================================
echo.
echo Thank you for using WorkoutNow!
echo.
timeout /t 2 /nobreak >nul
exit
