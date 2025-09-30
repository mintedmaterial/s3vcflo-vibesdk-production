@echo off
REM Docker Helper Script for VibeSDK Development

ECHO ==================================
ECHO Cloudflare VibeSDK Docker Helper
ECHO ==================================
ECHO.

:menu
ECHO Choose an option:
ECHO 1. Build and enter development container
ECHO 2. Build the project
ECHO 3. Deploy to Cloudflare
ECHO 4. Build and deploy in one step
ECHO 5. Exit
ECHO.

SET /P option=Enter option (1-5): 

IF "%option%"=="1" GOTO build_container
IF "%option%"=="2" GOTO build_project
IF "%option%"=="3" GOTO deploy_project
IF "%option%"=="4" GOTO build_and_deploy
IF "%option%"=="5" GOTO end

ECHO Invalid option. Try again.
ECHO.
GOTO menu

:build_container
ECHO.
ECHO Building and entering development container...
ECHO.
docker build -t vibesdk-dev -f Dockerfile.dev .
docker run -it --rm -v "%CD%:/app" -p 8787:8787 -p 8788:8788 --name vibesdk-dev vibesdk-dev
GOTO end

:build_project
ECHO.
ECHO Building the project inside Docker container...
ECHO.
docker build -t vibesdk-dev -f Dockerfile.dev .
docker run --rm -v "%CD%:/app" --name vibesdk-build vibesdk-dev bash -c "cd /app && ./build.sh"
GOTO end

:deploy_project
ECHO.
ECHO Deploying to Cloudflare inside Docker container...
ECHO.
docker build -t vibesdk-dev -f Dockerfile.dev .
docker run --rm -v "%CD%:/app" --name vibesdk-deploy vibesdk-dev bash -c "cd /app && wrangler deploy"
GOTO end

:build_and_deploy
ECHO.
ECHO Building and deploying the project inside Docker container...
ECHO.
docker build -t vibesdk-dev -f Dockerfile.dev .
docker run --rm -v "%CD%:/app" --name vibesdk-build-deploy vibesdk-dev bash -c "cd /app && ./build.sh && wrangler deploy"
GOTO end

:end
ECHO.
ECHO Done!