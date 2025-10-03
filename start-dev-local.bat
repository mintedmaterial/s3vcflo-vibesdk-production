@echo off
REM Start the VibeSDK dev server and open the application

echo 🚀 Starting VibeSDK Development Environment
echo ==========================================

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
  echo ⚠️  Wrangler not found. Installing...
  npm install -g wrangler@4.38.0
)

REM Ask if user wants to open the production app
echo Would you like to open the production app in your browser? (Y/N)
set /p open_prod=

if /i "%open_prod%"=="Y" (
  echo Opening https://vibesdk.srvcflo.com in your default browser...
  start https://vibesdk.srvcflo.com
)

REM Start the dev server
echo 🔧 Starting local development server...
echo.
echo NOTE: This will run both the frontend (vite) and backend (wrangler) servers
echo Press Ctrl+C twice to stop the servers
echo.
echo Starting in 3 seconds...
timeout /t 3 >nul

REM Run npm dev in a separate window
start cmd /k "echo 📱 Starting Frontend (Vite) Server... && npm run dev"

REM Run wrangler dev in this window
echo 💻 Starting Backend (Wrangler) Server...
wrangler dev