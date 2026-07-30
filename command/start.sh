#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")/.."

echo "Starting FastAPI Backend..."
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Starting React Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "========================================================"
echo " Both servers are running!"
echo " Backend API: http://localhost:8000"
echo " Frontend App: http://localhost:5173 (or 3000/3001)"
echo " Press Ctrl+C to stop both servers."
echo "========================================================"

# Wait for background processes and kill them on exit
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait $BACKEND_PID $FRONTEND_PID
