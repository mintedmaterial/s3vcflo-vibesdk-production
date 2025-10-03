@echo off
REM Check status of all Cloudflare resources for VibeSDK

echo 🔍 Checking VibeSDK Cloudflare Resources
echo =======================================

echo 🔑 Verifying Cloudflare authentication...
wrangler whoami || (
  echo Please log in to Cloudflare
  wrangler login
)

echo.
echo 📡 Worker Status:
wrangler deploy --dry-run

echo.
echo 💾 R2 Bucket Status:
echo - Listing R2 buckets:
wrangler r2 bucket list
echo.

echo - Checking template files in s3vcflo-vibesdk-templates bucket:
echo   1. c-code-next-runner.zip
wrangler r2 object get s3vcflo-vibesdk-templates/c-code-next-runner.zip --no-tail 2>nul && echo     ✅ File exists || echo     ❌ File missing
echo   2. c-code-react-runner.zip
wrangler r2 object get s3vcflo-vibesdk-templates/c-code-react-runner.zip --no-tail 2>nul && echo     ✅ File exists || echo     ❌ File missing
echo   3. template_catalog.json
wrangler r2 object get s3vcflo-vibesdk-templates/template_catalog.json --no-tail 2>nul && echo     ✅ File exists || echo     ❌ File missing

echo.
echo 🗄️ KV Namespace Status:
wrangler kv:namespace list

echo.
echo 📊 D1 Database Status:
wrangler d1 list

echo.
echo 📚 Durable Objects Status:
wrangler deploy --dry-run | findstr /C:"durable_objects"

echo.
echo ✅ Status check complete!
echo If any resources are missing, run deploy-with-templates.bat to create them.

pause