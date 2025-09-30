#!/bin/bash
# This script installs dependencies and builds the project

# Set error handling
set -e

# Check if we're in a Docker container
if [ -f "/.dockerenv" ]; then
  echo "Running in Docker container"
else
  echo "Warning: Not running in Docker container. Some commands might not work."
fi

# Check for Node.js
if command -v node &>/dev/null; then
  echo "✅ Node.js is installed: $(node -v)"
else
  echo "❌ Node.js not found. This script requires Node.js."
  exit 1
fi

# Check for npm
if command -v npm &>/dev/null; then
  echo "✅ npm is installed: $(npm -v)"
else
  echo "❌ npm not found. This script requires npm."
  exit 1
fi

# Check for Wrangler
if command -v wrangler &>/dev/null; then
  echo "✅ Wrangler is installed: $(wrangler --version)"
else
  echo "⚠️ Wrangler not found, installing..."
  npm install -g wrangler@4.38.0
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "To deploy, run: wrangler deploy"