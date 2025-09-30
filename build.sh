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

# Check for Bun
if command -v bun &>/dev/null; then
  echo "✅ Bun is installed"
else
  echo "⚠️ Bun not found, trying to install..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
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
if [ -f "bun.lock" ]; then
  echo "Using Bun to install dependencies..."
  bun install
elif [ -f "package-lock.json" ]; then
  echo "Using NPM to install dependencies..."
  npm ci
else
  echo "Using NPM to install dependencies..."
  npm install
fi

# Build the project
echo "🔨 Building project..."
if [ -f "bun.lock" ]; then
  bun run build
else
  npm run build
fi

echo "✅ Build completed successfully!"
echo "To deploy, run: wrangler deploy"