# SonicGenie VibeSDK Deployment Guide

This guide provides comprehensive instructions for deploying and managing your VibeSDK application on Cloudflare.

## 🚀 Quick Start

### 1. Deploy the Application

Run the deployment script to deploy your worker and upload template files:

```bash
# On Windows
.\deploy-with-templates.bat

# On Linux/Mac
bash ./deploy-with-templates.sh
```

### 2. Check Resource Status

Verify that all Cloudflare resources are properly configured:

```bash
.\check-resources.bat
```

### 3. Start Local Development

Start a local development server:

```bash
.\start-dev-local.bat
```

## 🔧 Understanding the Resources

### Cloudflare Resources

Your VibeSDK deployment uses these Cloudflare resources:

1. **Workers**: The main application code
2. **R2 Buckets**: Stores template files
   - `s3vcflo-vibesdk-templates`: Contains template ZIP files and catalog
3. **KV Namespaces**: Used for configuration and caching
   - `VIBESDK_AGENT_CONFIG`: Agent configuration
   - `VIBESDK_USER_CONFIG`: User configuration
4. **D1 Database**: Stores user data and application state
   - `vibesdk-db`: Main database
5. **Durable Objects**: Maintains stateful connections
   - `DISPATCH_NAMESPACE`: Manages dispatching

### Template Files

The R2 bucket must contain these files:
- `c-code-next-runner.zip`: Next.js template
- `c-code-react-runner.zip`: React template
- `template_catalog.json`: Catalog of available templates

## 🔍 Troubleshooting

### Missing Template Files

If templates aren't appearing in the UI:

1. Run `.\check-resources.bat` to verify if template files exist in R2
2. If missing, run `.\deploy-with-templates.bat` to upload them
3. Verify template_catalog.json has correct template configurations

### Authentication Issues

If you encounter authentication issues:

```bash
# Log in to Cloudflare
wrangler login

# Verify authentication
wrangler whoami
```

### Deployment Errors

For deployment errors:

1. Check your wrangler.jsonc configuration
2. Verify that all required resources exist
3. Check Cloudflare account permissions

## 📝 Customization

### Template Catalog

You can modify the template catalog at:
`./templates/template_catalog.json`

After changes, upload to R2:
```bash
wrangler r2 object put s3vcflo-vibesdk-templates/template_catalog.json --file ./templates/template_catalog.json
```

### Custom Templates

To add new templates:
1. Create a ZIP file with your template
2. Add it to the template catalog JSON
3. Upload to R2:
```bash
wrangler r2 object put s3vcflo-vibesdk-templates/your-template-name.zip --file ./templates/your-template-name.zip
```

## 🛠 Docker Development Environment

For consistent development across platforms, use the Docker environment:

```bash
# Build and start the Docker development container
.\dev-container.bat

# Or on Linux/Mac
bash ./dev-container.sh
```

## 🔄 Reset to Production Template

If you need to reset to the production template:

1. Ensure your credentials and custom domains are properly configured in wrangler.jsonc
2. Run the deployment script to update all resources
3. Verify resources with check-resources.bat