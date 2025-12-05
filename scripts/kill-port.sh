#!/bin/bash
# Script pour tuer les processus utilisant le port 3001

PORT=${1:-3001}

echo "🔍 Checking for processes on port $PORT..."

PIDS=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PIDS" ]; then
  echo "✅ Port $PORT is free"
else
  echo "⚠️  Found processes using port $PORT: $PIDS"
  echo "🛑 Killing processes..."
  kill -9 $PIDS 2>/dev/null
  sleep 1
  echo "✅ Processes killed"
fi

