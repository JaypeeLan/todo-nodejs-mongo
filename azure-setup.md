# Azure Deployment Setup Guide

This guide describes how to deploy the ecommerce application to Azure using the Azure Portal (without using the Azure Developer CLI).

## Prerequisites

1.  An **Azure Account** (Free or Paid).
2.  A **GitHub Repository** with the application code.

## Step 1: Create Azure Resources

### 1. Cosmos DB (MongoDB API)
1.  Go to the [Azure Portal](https://portal.azure.com).
2.  Search for **Azure Cosmos DB** and click **Create**.
3.  Choose **Azure Cosmos DB for MongoDB**.
4.  Configure the resource group, account name, and location.
5.  Once created, go to **Settings > Connection String** and copy the **PRIMARY CONNECTION STRING**.

### 2. App Service (Web App)
1.  Search for **App Services** and click **Create**.
2.  Select **Web App**.
3.  Choose **Node 20 LTS** as the runtime stack and **Linux** as the OS.
4.  Configure the name (e.g., `gmc-app`) and resource group.
5.  Click **Create**.

## Step 2: Configure Environment Variables

1.  In your App Service, go to **Settings > Configuration**.
2.  Add the following **Application settings**:
    - `COSMOS_CONNECTION_STRING`: The connection string copied from Cosmos DB.
    - `COSMOS_DATABASE_NAME`: `ecommerce` (or your preferred name).
    - `COSMOS_CONTAINER_NAME`: `products`.
    - `NODE_ENV`: `production`.

## Step 3: Set up GitHub Actions

1.  In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2.  Add a new repository secret:
    - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
    - **Value**: The publish profile for your Web App. 
      - (In Azure Portal, go to your Web App's **Overview** page and click **Get publish profile**).

## Step 4: Verify Deployment

1.  The GitHub Action defined in `.github/workflows/azure-dev.yml` will automatically trigger on push to `main`.
2.  It will build both the React frontend and the Node.js API.
3.  The frontend build (`src/web/dist`) will be moved to the API's `public` folder and deployed together.
4.  Access your app at `https://<your-app-name>.azurewebsites.net`.
