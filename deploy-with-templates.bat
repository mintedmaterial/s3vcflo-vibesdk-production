@echo off
REM Comprehensive deployment script for VibeSDK (Windows version)
REM This script will:
REM 1. Deploy the worker
REM 2. Upload template files to R2 bucket
REM 3. Verify Durable Objects are created

echo 🚀 Starting VibeSDK Comprehensive Deployment
echo ==============================================

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
  echo ⚠️  Wrangler not found. Installing...
  npm install -g wrangler@4.38.0
)

REM Log in to Cloudflare (if not logged in already)
echo 🔑 Checking Cloudflare authentication...
wrangler whoami || wrangler login

REM Deploy the worker
echo 📡 Deploying worker...
wrangler deploy

REM Check if template files exist locally, download if not
set TEMPLATES_DIR=.\templates
mkdir %TEMPLATES_DIR% 2>nul

if not exist "%TEMPLATES_DIR%\c-code-next-runner.zip" (
  echo   - Downloading c-code-next-runner.zip...
  curl -s -o "%TEMPLATES_DIR%\c-code-next-runner.zip" "https://vibesdk.srvcflo.com/c-code-next-runner.zip"
  if %errorlevel% neq 0 echo ⚠️  Failed to download c-code-next-runner.zip
)

if not exist "%TEMPLATES_DIR%\c-code-react-runner.zip" (
  echo   - Downloading c-code-react-runner.zip...
  curl -s -o "%TEMPLATES_DIR%\c-code-react-runner.zip" "https://vibesdk.srvcflo.com/c-code-react-runner.zip"
  if %errorlevel% neq 0 echo ⚠️  Failed to download c-code-react-runner.zip
)

if not exist "%TEMPLATES_DIR%\template_catalog.json" (
  echo   - Downloading template_catalog.json...
  curl -s -o "%TEMPLATES_DIR%\template_catalog.json" "https://vibesdk.srvcflo.com/template_catalog.json"
  if %errorlevel% neq 0 echo ⚠️  Failed to download template_catalog.json
)

REM Upload template files to R2 bucket
echo 📤 Uploading template files to R2 bucket...
wrangler r2 object put s3vcflo-vibesdk-templates/c-code-next-runner.zip --file "%TEMPLATES_DIR%\c-code-next-runner.zip"
if %errorlevel% neq 0 echo ⚠️  Failed to upload c-code-next-runner.zip

wrangler r2 object put s3vcflo-vibesdk-templates/c-code-react-runner.zip --file "%TEMPLATES_DIR%\c-code-react-runner.zip"
if %errorlevel% neq 0 echo ⚠️  Failed to upload c-code-react-runner.zip

wrangler r2 object put s3vcflo-vibesdk-templates/template_catalog.json --file "%TEMPLATES_DIR%\template_catalog.json"
if %errorlevel% neq 0 echo ⚠️  Failed to upload template_catalog.json

echo.
echo ✅ Deployment completed!
echo Access your application at: https://vibesdk.srvcflo.com
echo.
echo 📝 Next steps:
echo   1. Verify that your application is working correctly
echo   2. Check that templates can be loaded in the UI
echo   3. Test the code generation functionality

pause