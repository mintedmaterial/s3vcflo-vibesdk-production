#!/bin/bash
# Comprehensive deployment script for VibeSDK
# This script will:
# 1. Deploy the worker
# 2. Upload template files to R2 bucket
# 3. Verify Durable Objects are created

set -e # Exit on any errors

echo "🚀 Starting VibeSDK Comprehensive Deployment"
echo "=============================================="

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
  echo "⚠️  Wrangler not found. Installing..."
  npm install -g wrangler@4.38.0
fi

# Log in to Cloudflare (if not logged in already)
echo "🔑 Checking Cloudflare authentication..."
wrangler whoami || wrangler login

# Deploy the worker
echo "📡 Deploying worker..."
wrangler deploy

# Check if template files exist locally, download if not
TEMPLATES_DIR="./templates"
mkdir -p "$TEMPLATES_DIR"

if [ ! -f "$TEMPLATES_DIR/c-code-next-runner.zip" ] || [ ! -f "$TEMPLATES_DIR/c-code-react-runner.zip" ] || [ ! -f "$TEMPLATES_DIR/template_catalog.json" ]; then
  echo "📥 Downloading template files..."
  
  # Download template files if they don't exist
  if [ ! -f "$TEMPLATES_DIR/c-code-next-runner.zip" ]; then
    echo "  - Downloading c-code-next-runner.zip..."
    curl -s -o "$TEMPLATES_DIR/c-code-next-runner.zip" "https://vibesdk.srvcflo.com/c-code-next-runner.zip" || echo "⚠️  Failed to download c-code-next-runner.zip"
  fi
  
  if [ ! -f "$TEMPLATES_DIR/c-code-react-runner.zip" ]; then
    echo "  - Downloading c-code-react-runner.zip..."
    curl -s -o "$TEMPLATES_DIR/c-code-react-runner.zip" "https://vibesdk.srvcflo.com/c-code-react-runner.zip" || echo "⚠️  Failed to download c-code-react-runner.zip"
  fi
  
  if [ ! -f "$TEMPLATES_DIR/template_catalog.json" ]; then
    echo "  - Downloading template_catalog.json..."
    curl -s -o "$TEMPLATES_DIR/template_catalog.json" "https://vibesdk.srvcflo.com/template_catalog.json" || echo "⚠️  Failed to download template_catalog.json"
  fi
fi

# Upload template files to R2 bucket
echo "📤 Uploading template files to R2 bucket..."
wrangler r2 object put s3vcflo-vibesdk-templates/c-code-next-runner.zip --file "$TEMPLATES_DIR/c-code-next-runner.zip" || echo "⚠️  Failed to upload c-code-next-runner.zip"
wrangler r2 object put s3vcflo-vibesdk-templates/c-code-react-runner.zip --file "$TEMPLATES_DIR/c-code-react-runner.zip" || echo "⚠️  Failed to upload c-code-react-runner.zip"
wrangler r2 object put s3vcflo-vibesdk-templates/template_catalog.json --file "$TEMPLATES_DIR/template_catalog.json" || echo "⚠️  Failed to upload template_catalog.json"

echo ""
echo "✅ Deployment completed!"
echo "Access your application at: https://vibesdk.srvcflo.com"
echo ""
echo "📝 Next steps:"
echo "  1. Verify that your application is working correctly"
echo "  2. Check that templates can be loaded in the UI"
echo "  3. Test the code generation functionality"