#!/bin/bash

# Get the current directory
CURRENT_DIR=$(pwd)

# Run the Docker container with the current directory mounted
docker run -it --rm \
  -v "${CURRENT_DIR}:/app" \
  -p 8787:8787 \
  -p 8788:8788 \
  --name vibesdk-dev \
  $(docker build -q -f Dockerfile.dev .)

# Note: This script mounts your current directory into the Docker container
# and exposes ports 8787 and 8788 for development and preview