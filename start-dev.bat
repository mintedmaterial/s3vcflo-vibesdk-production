@echo off
REM This script runs the wrangler development server

ECHO 🚀 Starting VibeSDK Development Server
ECHO ======================================

REM Check for wrangler
wrangler -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  ECHO ⚠️ Wrangler not found. Installing globally...
  npm install -g wrangler@4.38.0
)

REM Ensure the environment is ready
IF NOT EXIST .dev.vars (
  ECHO ⚠️ Warning: .dev.vars file not found. Development environment may be incomplete.
)

REM Build the frontend
ECHO 📦 Building frontend assets...
CALL npm run build

REM Start wrangler dev server
ECHO 🌐 Starting wrangler dev server...
ECHO ✨ Access your development server at:
ECHO    - Local: http://localhost:8787

REM Run wrangler dev server
SET DEV_MODE=true
wrangler dev --port 8787

PAUSE