# Deployment Guide

This guide covers deploying QR Photo Share to cloud platforms (Render and Railway) with step-by-step GitHub integration.

## Table of Contents
1. [Prepare for Deployment](#prepare-for-deployment)
2. [Deploy to Render](#deploy-to-render)
3. [Deploy to Railway](#deploy-to-railway)
4. [Post-Deployment](#post-deployment)

---

## Prepare for Deployment

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Fill in:
   - **Repository name**: `qr-photo-share`
   - **Description**: "Capture photos and share via QR codes"
   - **Public** or **Private**: Choose based on preference
4. Click **Create repository**

### Step 2: Push Your Code to GitHub

If you have Git installed, run these commands in your project folder:

```
bash
# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - QR Photo Share app"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/qr-photo-share.git

# Push to GitHub
git branch -M main
git push -u origin main
```

> **Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Deploy to Render

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Click **Sign Up** → Choose GitHub to sign in
3. Authorize Render to access your GitHub repositories

### Step 2: Deploy the Application

1. In the Render dashboard, click **New** → **Web Service**
2. Search for your repository (`qr-photo-share`) and click **Connect**
3. Configure the deployment:
   
   | Setting | Value |
   |---------|-------|
   | Name | `qr-photo-share` |
   | Region | Choose closest to you |
   | Branch | `main` |
   | Runtime | `Python` |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `python app.py` |

4. Click **Create Web Service**

### Step 3: Wait for Deployment

- Render will automatically install dependencies and deploy
- Check the **Logs** tab for progress
- Once complete, you'll see "Deployed" status

### Step 4: Access Your App

- Click the URL provided (e.g., `https://qr-photo-share.onrender.com`)
- Test the camera capture functionality

> **Important**: On Render, the free tier has some limitations:
> - Service sleeps after 15 minutes of inactivity
> - First wake-up may take a few seconds
> - 750 hours of runtime per month

---

## Deploy to Railway

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Click **Login** → Choose GitHub to sign in
3. Authorize Railway to access your repositories

### Step 2: Deploy from GitHub

1. In Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Search for `qr-photo-share` and select it

### Step 3: Configure Environment

Railway should auto-detect the Python project. If not:
1. Click on the created project
2. Go to **Settings** → **Variables**
3. Add:
   - `PORT`: `5000`
   - `PYTHON_VERSION`: `3.11` (or your preferred version)

### Step 4: Deploy

1. Click **Deploy** 
2. Watch deployment progress in the **Deployments** tab
3. Once complete, click the **Generated Domain** link

### Step 5: Access Your App

- Your app will be available at `https://your-project-name.up.railway.app`
- Test the camera capture functionality

> **Note**: Railway's free tier includes:
> - 500 hours of runtime per month
> - Service sleeps after 5 minutes of inactivity

---

## Post-Deployment

### Camera Access on Mobile

For camera access to work on mobile browsers:
- **Required**: Your site must be served over HTTPS
- Both Render and Railway provide HTTPS automatically
- Some browsers may block camera access on HTTP

### Testing Camera on Deployed Site

1. Visit your deployed URL on a mobile device
2. Grant camera permission when prompted
3. Capture a photo and upload
4. Scan the QR code to test sharing

### Custom Domain (Optional)

**Render**:
1. Go to your web service → **Settings**
2. Scroll to **Custom Domains**
3. Add your domain and follow DNS instructions

**Railway**:
1. Go to project → **Settings**
2. Click **Domains**
3. Add custom domain and configure DNS

---

## Troubleshooting

### Issue: "Camera not working on deployed site"

**Solution**: 
- Ensure HTTPS is enabled (automatic on Render/Railway)
- Check browser permissions on mobile device
- Some iOS Safari versions have camera restrictions

### Issue: "Images not loading"

**Solution**:
- Check that `static/uploads` folder is created
- Verify file permissions on the platform
- Check deployment logs for errors

### Issue: "Service not waking up"

**Solution**:
- Free tier services sleep after inactivity
- This is normal behavior, service will wake on next request
- Consider upgrading to paid tier for always-on service

### Issue: "Build failed"

**Solution**:
- Verify `requirements.txt` has correct format
- Check Python version compatibility
- Review build logs for specific errors

---

## Environment Variables

If needed, you can set these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port for the server | `5000` |
| `FLASK_ENV` | Flask environment | `production` |
| `FLASK_DEBUG` | Debug mode | `0` |

---

## Security Notes

- Images are stored with UUID filenames for privacy
- No authentication required (intentional for easy sharing)
- Consider adding password protection for production use
- Images are stored on ephemeral filesystem (may be cleared)

---

## Summary

| Platform | URL Format | Free Tier | HTTPS |
|----------|------------|-----------|-------|
| Render | `*.onrender.com` | 750 hrs/mo | ✅ Included |
| Railway | `*.up.railway.app` | 500 hrs/mo | ✅ Included |

Both platforms are excellent choices for this application. Render often has simpler setup, while Railway can be faster in some regions.

---

For additional help, check the main [README.md](README.md) or submit an issue on GitHub.
