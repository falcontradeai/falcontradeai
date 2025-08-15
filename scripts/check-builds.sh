#!/bin/bash
set -e

# Verify backend build and start
pushd backend > /dev/null
npm install
npm start &
BACKEND_PID=$!
# Give the server a moment to start then terminate
sleep 5
kill $BACKEND_PID || true
popd > /dev/null

# Verify frontend build
pushd frontend > /dev/null
npm install
npm run build
popd > /dev/null
