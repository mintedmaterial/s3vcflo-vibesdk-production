@echo off
REM Build the Docker image
docker build -t vibesdk-dev -f Dockerfile.dev .

REM Run the Docker container with the current directory mounted
docker run -it --rm ^
  -v "%CD%:/app" ^
  -p 8787:8787 ^
  -p 8788:8788 ^
  --name vibesdk-dev ^
  vibesdk-dev

REM Note: This script mounts your current directory into the Docker container
REM and exposes ports 8787 and 8788 for development and preview