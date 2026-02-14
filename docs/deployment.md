# Deployment Guide: Gaze IPD Scanner

This document outlines the professional deployment strategy for the Gaze IPD Scanner application, ensuring high availability, security for your Gemini API keys, and seamless CI/CD.

## Architecture Overview
The application is a modern ES6+ React application that leverages browser-native ESM (via `importmaps`). It interacts directly with the Google Gemini API.

---

## 1. Deploying to Google Cloud Run

Cloud Run is ideal for this application as it provides a managed, autoscaling environment. Since the app is static-first, we use Nginx to serve the files.

### Prerequisites
*   [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and initialized.
*   A Google Cloud Project with billing enabled.

### Step 1: Create a Dockerfile
Create a `Dockerfile` in your project root:

```dockerfile
# Use Nginx to serve static content
FROM nginx:alpine

# Copy project files to Nginx web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Build and Push to Artifact Registry
```bash
# Set your Project ID
PROJECT_ID=$(gcloud config get-value project)

# Build the image
gcloud builds submit --tag gcr.io/$PROJECT_ID/gaze-ipd-scanner
```

### Step 3: Deploy to Cloud Run
```bash
gcloud run deploy gaze-ipd-scanner \
  --image gcr.io/$PROJECT_ID/gaze-ipd-scanner \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars API_KEY=your_gemini_api_key_here
```

---

## 2. Deploying via GitHub (Vercel / Netlify / "Verbal")

If using a platform that integrates with GitHub (like Vercel or similar "Verbal" automation tools), the process is even simpler.

### Step 1: Push to GitHub
Ensure your code is in a GitHub repository.
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/gaze-ipd.git
git push -u origin main
```

### Step 2: Connect to your Hosting Provider
1.  Log in to your hosting provider (e.g., Vercel).
2.  Select **"Import Project"** and choose your GitHub repository.
3.  **Build Settings:**
    *   **Framework Preset:** Other / Plain HTML (since we use native ESM).
    *   **Build Command:** `ls` (no build step required for this ESM architecture).
    *   **Output Directory:** `.` (root).
4.  **Environment Variables:**
    *   Add `API_KEY`: `[Your Gemini API Key]`

### Step 3: Automatic Deployments
Every time you push to the `main` branch on GitHub, the platform will automatically trigger a new deployment and update your live URL.

---

## Security Best Practices

### API Key Protection
*   **Production:** Never hardcode your API key in the source files. 
*   **Restricted Keys:** In the [Google AI Studio](https://aistudio.google.com/app/apikey), ensure your API key is restricted to specific HTTP referrers (your production domain) to prevent unauthorized usage.
*   **Server-Side Proxy (Optional):** For maximum security, you can create a simple Cloud Function or Node.js backend to wrap the Gemini API calls, keeping the API key entirely hidden from the client-side network tab.

## Local Development
To run this locally for testing before deployment:
```bash
# Using a simple python server
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000`. Ensure your local environment has the `API_KEY` available if your local server logic handles injection.