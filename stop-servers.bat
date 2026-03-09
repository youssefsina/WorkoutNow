@echo off
title WorkoutNow - Stop All Servers
color 0C

echo ========================================
echo     Stopping All Node Processes...
echo ========================================
echo.

taskkill /F /IM node.exe 2>nul

if %errorlevel% equ 0 (
    echo.
    echo All Node processes stopped successfully!
    echo All ports are now free.
) else (
    echo.
    echo No Node processes were running.
)

echo.
echo Press any key to exit...
pause >nul
