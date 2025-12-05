#!/bin/bash
echo "🧪 Testing the application..."
echo ""

# Kill any existing processes
echo "1️⃣  Cleaning up ports..."
npm run kill-port > /dev/null 2>&1
sleep 1

# Start server
echo "2️⃣  Starting backend server..."
npm run dev:server > /tmp/server.log 2>&1 &
SERVER_PID=$!
sleep 3

# Test API endpoints
echo "3️⃣  Testing API endpoints..."
echo ""

echo "📋 Testing /api/template:"
TEMPLATE_RESPONSE=$(curl -s http://localhost:3001/api/template)
echo "$TEMPLATE_RESPONSE" | head -3
echo ""

echo "🎨 Testing /api/logo:"
LOGO_RESPONSE=$(curl -s http://localhost:3001/api/logo)
echo "$LOGO_RESPONSE" | head -3
echo ""

# Check if responses are valid
if echo "$TEMPLATE_RESPONSE" | grep -q "template"; then
  echo "✅ Template API: OK"
else
  echo "❌ Template API: FAILED"
fi

if echo "$LOGO_RESPONSE" | grep -q "logo"; then
  echo "✅ Logo API: OK"
else
  echo "❌ Logo API: FAILED"
fi

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
  echo "✅ Server is running (PID: $SERVER_PID)"
else
  echo "❌ Server failed to start"
  echo "Server logs:"
  cat /tmp/server.log
fi

echo ""
echo "4️⃣  To start frontend, run: npm run dev"
echo "5️⃣  To stop server, run: kill $SERVER_PID"


