# Docker Development Environment for Cloudflare VibeSDK

This folder contains Docker configuration files to help you build and deploy your Cloudflare VibeSDK project without having to install Node.js, npm, or bun directly on your system.

## Getting Started

### Prerequisites

- Docker installed on your system
- Cloudflare account with API token

### Using the Development Container

#### On Windows:

1. Open Command Prompt or PowerShell in this directory
2. Run the batch script:
   ```
   dev-container.bat
   ```

#### On Linux/Mac:

1. Open Terminal in this directory
2. Make the script executable:
   ```
   chmod +x dev-container.sh
   ```
3. Run the shell script:
   ```
   ./dev-container.sh
   ```

### Inside the Container

Once inside the container, you can use the following commands:

```bash
# Install dependencies
bun install  # or: npm install

# Build the project
bun run build  # or: npm run build

# Deploy to Cloudflare
wrangler deploy

# Or use the convenience script that does all three:
deploy-app.sh
```

## Environment Variables

Before deploying, make sure you have the necessary environment variables set in your `.dev.vars` file:

```
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
# ... other required variables
```

## Troubleshooting

If you encounter any issues:

1. Make sure your Docker service is running
2. Check that you have the necessary Cloudflare permissions
3. Verify your `.dev.vars` and `.prod.vars` files have the correct values
4. If build fails, try running with Node.js instead of bun:
   ```
   npm install
   npm run build
   ```

## Additional Notes

- The container has both Node.js and bun installed
- Wrangler 4.38.0 is pre-installed (matching the version in your project)
- The container will auto-detect whether to use bun or npm based on the presence of bun.lock file