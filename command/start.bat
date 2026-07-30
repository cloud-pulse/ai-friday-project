@echo off
title PharmaInspect AI Servers

:: Navigate to the project root directory
cd /d "%~dp0.."

echo Starting FastAPI Backend...
start "PharmaInspect Backend" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Starting React Frontend...
start "PharmaInspect Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both servers are starting in separate command windows.
echo Backend API: http://localhost:8000
echo Frontend App: http://localhost:5173 (or 3000/3001)
echo ========================================================
echo.
pause
