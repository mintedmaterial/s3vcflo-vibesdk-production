#!/bin/bash
# This script provides a helpful guide for the user

cat << "EOF"
==================================================
🚀 VIBESDK DEPLOYMENT GUIDE
==================================================

It looks like you have successfully set up your Docker environment!

To build and deploy your project, follow these steps:

1️⃣ RUN THE BUILD FIRST:
   $ ./npm-build.sh

2️⃣ DEPLOY THE PROJECT:
   $ wrangler deploy

🔄 ALTERNATIVELY, RUN THIS ONE-STEP COMMAND:
   $ ./npm-build.sh && wrangler deploy

📝 NOTES:
- Make sure .dev.vars and .prod.vars have your secrets
- The build will create the dist/ directory with your UI files
- wrangler.jsonc is configured with your custom domain
- Your DISPATCH_NAMESPACE is now properly configured

If you have any issues, try:
1. Check that your Cloudflare account and API token are valid
2. Make sure you have sufficient permissions
3. Verify that your database ID matches in wrangler.jsonc

EOF