#!/bin/bash
# This script runs the wrangler development server with proper host binding

# Set error handling
set -e

echo "🚀 Starting VibeSDK Development Server"
echo "======================================"

# Check for wrangler
if ! command -v wrangler &> /dev/null; then
  echo "⚠️  Wrangler not found. Installing globally..."
  npm install -g wrangler@4.38.0
fi

# Ensure the environment is ready
if [ ! -f ".dev.vars" ]; then
  echo "⚠️  Warning: .dev.vars file not found. Development environment may be incomplete."
fi

# Build the frontend
echo "📦 Building frontend assets..."
npm run build

# Start wrangler dev server with proper host binding
echo "🌐 Starting wrangler dev server..."
echo "✨ Access your development server at:"
echo "   - Local:   http://localhost:8787"
echo "   - Network: http://$(hostname -I | awk '{print $1}'):8787"

# Run with host binding to make it accessible outside the container
DEV_MODE=true wrangler dev --host 0.0.0.0 --port 8787