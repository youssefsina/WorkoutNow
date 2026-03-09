@echo off
title WorkoutNow - Development Manager
color 0B

:MENU
cls
echo ========================================
echo     WORKOUTNOW - DEVELOPMENT MENU
echo ========================================
echo.
echo [1] Start Backend Server (Port 4000)
echo [2] Start Frontend Server (Port 3001)
echo [3] Start Both Servers
echo [4] Kill All Node Processes
echo [5] Install Dependencies (Backend + Frontend)
echo [6] Install Backend Dependencies Only
echo [7] Install Frontend Dependencies Only
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
echo     Starting Backend Server...
echo ========================================
cd backend
start "Backend Server (Port 4000)" cmd /k "npm run dev"
cd ..
echo.
echo Backend server started on http://localhost:4000
echo.
pause
goto MENU

:FRONTEND
cls
echo ========================================
echo     Starting Frontend Server...
echo ========================================
cd frontend
start "Frontend Server (Port 3001)" cmd /k "npm run dev"
cd ..
echo.
echo Frontend server started on http://localhost:3001
echo Open your browser to http://localhost:3001
echo.
pause
goto MENU

:BOTH
cls
echo ========================================
echo     Starting Both Servers...
echo ========================================
cd backend
start "Backend Server (Port 4000)" cmd /k "npm run dev"
cd ..
timeout /t 2 /nobreak >nul
cd frontend
start "Frontend Server (Port 3001)" cmd /k "npm run dev"
cd ..
echo.
echo ========================================
echo Both servers started!
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3001
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
echo Installing Backend Dependencies...
cd backend
call npm install
cd ..
echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo.
echo ========================================
echo All dependencies installed!
echo ========================================
pause
goto MENU

:INSTALL_BACKEND
cls
echo ========================================
echo     Installing Backend Dependencies...
echo ========================================
cd backend
call npm install
cd ..
echo.
echo Backend dependencies installed!
pause
goto MENU

:INSTALL_FRONTEND
cls
echo ========================================
echo     Installing Frontend Dependencies...
echo ========================================
cd frontend
call npm install
cd ..
echo.
echo Frontend dependencies installed!
pause
goto MENU

:PRISMA
cls
echo ========================================
echo     Generating Prisma Client...
echo ========================================
cd backend
call npx prisma generate
cd ..
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
echo Check your backend/.env file for DATABASE_URL
echo.
pause
cd backend
call npx prisma migrate dev
cd ..
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
