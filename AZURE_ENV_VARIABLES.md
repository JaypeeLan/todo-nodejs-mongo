# Azure Environment Variables Guide

This document lists all environment variables needed for Azure App Service deployment, with instructions on how to obtain each value.

> **Note:** This project deploys as a **single App Service** where the backend API serves the frontend build. Both run on the same domain (e.g., `gmc-ecommerce-amd6cxbza2dcacdx.canadacentral-01.azurewebsites.net`).

## App Service Environment Variables

Configure these in **Azure Portal → Your App Service → Settings → Configuration → Application settings**

### Database Configuration

#### `MONGODB_URI` or `AZURE_COSMOS_CONNECTION_STRING`
**Required** - MongoDB/Cosmos DB connection string

**How to get:**
1. Go to Azure Portal → Your Cosmos DB account
2. Navigate to **Settings → Connection String**
3. Copy the **PRIMARY CONNECTION STRING**

**Sample value:**
```
mongodb://your-cosmos-account:base64encodedkey==@your-cosmos-account.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@your-cosmos-account@
```

---

#### `AZURE_COSMOS_DATABASE_NAME`
**Required** - Name of your database

**How to get:**
- This is the database name you created in Cosmos DB
- Default in this project: `Todo`

**Sample value:**
```
Todo
```

---

#### `AZURE_COSMOS_ENDPOINT`
**Optional** - Cosmos DB endpoint URL

**How to get:**
1. Go to Azure Portal → Your Cosmos DB account
2. Navigate to **Overview**
3. Copy the **URI** field

**Sample value:**
```
https://your-cosmos-account.documents.azure.com:443/
```

---

### Observability Configuration

#### `APPLICATIONINSIGHTS_CONNECTION_STRING`
**Optional** - Application Insights telemetry connection string

**How to get:**
1. Go to Azure Portal → Your Application Insights resource
2. Navigate to **Overview** or **Configure → Properties**
3. Copy the **Connection String**

**Sample value:**
```
InstrumentationKey=12345678-1234-1234-1234-123456789abc;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/
```

---

#### `APPLICATIONINSIGHTS_ROLE_NAME`
**Optional** - Label for telemetry data

**How to get:**
- This is a custom label you define
- Recommended: `API`

**Sample value:**
```
API
```

---

### CORS Configuration

#### `API_ALLOW_ORIGINS`
**Optional** - Comma-separated list of allowed frontend URLs for CORS

**How to get:**
- Since frontend and backend are on the same domain, this is **optional**
- If you need to allow other domains (e.g., for testing), add them here
- For production with single domain deployment, you can omit this or set it to your Azure domain

**Sample value:**
```
https://gmc-ecommerce-amd6cxbza2dcacdx.canadacentral-01.azurewebsites.net
```

---

### Runtime Configuration

#### `NODE_ENV`
**Required** - Application environment mode

**How to get:**
- Set this manually to `production` for Azure deployments

**Sample value:**
```
production
```

---

#### `SCM_DO_BUILD_DURING_DEPLOYMENT`
**Optional** - Enable build during deployment

**How to get:**
- Set this manually to `true` to run `npm install` and `npm run build` on Azure

**Sample value:**
```
true
```

---

### Key Vault Configuration (Optional)

#### `AZURE_KEY_VAULT_ENDPOINT`
**Optional** - Azure Key Vault URL for secrets management

**How to get:**
1. Go to Azure Portal → Your Key Vault
2. Navigate to **Overview**
3. Copy the **Vault URI**

**Sample value:**
```
https://your-keyvault.vault.azure.net/
```

---

## Frontend Build Configuration

**Note:** The frontend (React/Vite app) is built and served by the backend API as static files. The build happens during deployment.

### Build-time Environment Variables

These are set during the **GitHub Actions workflow** or **Azure DevOps pipeline** (not in Azure App Service settings):

#### `API_BASE_URL`
**Required for build** - Backend API URL (relative path since same domain)

**How to set:**
- In your CI/CD pipeline, set this to an empty string `""` or relative path
- The frontend will use relative URLs (e.g., `/api/products`) since it's on the same domain

**Sample value in CI/CD:**
```
API_BASE_URL=""
```

---

#### `APPLICATIONINSIGHTS_CONNECTION_STRING`
**Optional** - Application Insights connection string for frontend telemetry

**How to get:**
- Same as backend `APPLICATIONINSIGHTS_CONNECTION_STRING` (see above)
- Set this in your CI/CD pipeline as `APPLICATIONINSIGHTS_CONNECTION_STRING`

**Sample value:**
```
InstrumentationKey=12345678-1234-1234-1234-123456789abc;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/
```

> **Important:** Frontend environment variables are embedded during the **build step** in your CI/CD pipeline, not at runtime in Azure App Service.

---

## Quick Reference: Minimum Required Variables

### Azure App Service (Required)
Set these in **Azure Portal → App Service → Configuration → Application settings**:

```
MONGODB_URI=mongodb://your-cosmos-account:key@your-cosmos-account.mongo.cosmos.azure.com:10255/...
AZURE_COSMOS_DATABASE_NAME=Todo
NODE_ENV=production
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### CI/CD Pipeline (Required for Build)
Set these in your **GitHub Actions secrets** or **Azure DevOps pipeline variables**:

```
API_BASE_URL=""
```

**Example Azure domain:** `https://gmc-ecommerce-amd6cxbza2dcacdx.canadacentral-01.azurewebsites.net`

---

## How to Set Environment Variables in Azure Portal

1. Navigate to **Azure Portal** (https://portal.azure.com)
2. Go to **App Services** → Select your app
3. Click **Settings → Configuration**
4. Click **+ New application setting**
5. Enter **Name** and **Value**
6. Click **OK**
7. Click **Save** at the top
8. **Restart** your app service for changes to take effect

---

## Important Notes

- **Secrets Security**: Never commit connection strings or keys to Git. Use Azure Key Vault for production.
- **Frontend Variables**: Must be set during build time, not at runtime.
- **Restart Required**: After changing environment variables, restart your App Service.
- **Case Sensitivity**: Variable names are case-sensitive.
