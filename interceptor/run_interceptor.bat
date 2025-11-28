@echo off
title AC Nickname Interceptor
echo Starting AC Nickname Interceptor...
echo.
python "%~dp0main.py"

if %errorlevel% neq 0 (
    echo.
    echo An error occurred!
    pause
)
