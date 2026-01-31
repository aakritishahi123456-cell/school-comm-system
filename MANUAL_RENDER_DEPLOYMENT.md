# 🚀 Manual Render Deployment Guide

Since Git is not installed, here's how to deploy manually to Render:

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Install Git (Optional but Recommended)
1. Download Git from: https://git-scm.com/downloads
2. Install and restart your terminal
3. Then use the automated scripts

### Step 2: Upload to GitHub Manually
1. Go to https://github.com/new
2. Create a new repository named `school-comm-system`
3. Don't initialize with README (we have files already)
4. Download GitHub Desktop: https://desktop.github.com/
5. Use GitHub Desktop to upload your `school-comm-system` folder

## Option 2: Direct Render Deployment

### Step 1: Prepare Files
Your project is already prepared with:
- ✅ `render.yaml` - Render configuration
- ✅ `package.json` - Updated with correct scripts
- ✅ `prisma/schema.prisma` - PostgreSQL ready
- ✅ All route files and middleware

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub, Google, or email
3. Verify your email

### Step 3: Deploy via Render Dashboard

#### A. Create PostgreSQL Database (Optional)
1. In Render Dashboard → "New +" → "PostgreSQL"
2. Settings:
   - Name: `school-comm-db`
   - Database: `school_comm_system`
   - User: `school_comm_user`
   - Plan: Free
3. Click "Create Database"
4. **Copy the Internal Database URL** (starts with `postgresql://`)

#### B. Create Web Service
1. Click "New +" → "Web Service"
2. Choose "Deploy an existing image" or "Build and deploy from a Git repository"

**If using Git repository:**
- Connect your GitHub account
- Select your repository
- Branch: `main`

**If uploading manually:**
- You'll need to use GitHub or another Git service

### Step 4: Configure Web Service

#### Basic Settings:
- **Name**: `school-comm-system`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

#### Environment Variables:
Add these in the "Environment" tab:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://your_db_url_from_step_3A
WA_ACCESS_TOKEN=your_whatsapp_access_token
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=your_secure_verify_token
WA_WEBHOOK_URL=https://school-comm-system.onrender.com/webhook
JWT_SECRET=your_super_secure_jwt_secret
LOG_LEVEL=info
CORS_ORIGIN=*
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
TRUST_PROXY=true
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will build and deploy your app
3. Wait 5-10 minutes for deployment
4. Check the logs for any errors

### Step 6: Post-Deployment Setup

#### A. Database Migration
1. Go to your service → "Shell"
2. Run: `npx prisma db push`
3. This creates all database tables

#### B. Test Health Endpoint
Visit: `https://your-app-name.onrender.com/health`
Should return: `{"status":"healthy",...}`

#### C. Configure WhatsApp Webhook
1. Go to WhatsApp Business API Dashboard
2. Set Webhook URL: `https://your-app-name.onrender.com/webhook`
3. Set Verify Token: (same as your `VERIFY_TOKEN` env var)

#### D. Test Webhook
Visit: `https://your-app-name.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test123`
Should return: `test123`

## Alternative: Use Render CLI

### Install Render CLI:
```bash
npm install -g @render/cli
```

### Deploy with CLI:
```bash
render login
render deploy
```

## Troubleshooting

### Build Fails:
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Render dashboard

### Database Issues:
- Verify DATABASE_URL is correct
- Check PostgreSQL service is running
- Ensure Prisma schema is valid

### App Won't Start:
- Check environment variables
- Verify start command: `npm start`
- Check application logs

## Free Tier Limitations

Render Free Tier:
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Slower cold starts
- ✅ Custom domains supported
- ✅ Automatic HTTPS

For production, consider Starter plan ($7/month):
- Always-on service
- Faster performance
- No sleep mode

## Success Checklist

- [ ] ✅ Service deploys without errors
- [ ] ✅ Health endpoint responds: `/health`
- [ ] ✅ Database connects successfully
- [ ] ✅ WhatsApp webhook verifies
- [ ] ✅ Environment variables set correctly
- [ ] ✅ Logs show successful startup

## Your Live URLs

After deployment:
- **Main App**: `https://school-comm-system.onrender.com`
- **Health Check**: `https://school-comm-system.onrender.com/health`
- **Webhook**: `https://school-comm-system.onrender.com/webhook`
- **Admin Dashboard**: `https://school-comm-system.onrender.com/admin`

🎉 **Your WhatsApp School Communication System will be live on Render!**

## Need Help?

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
- Project Issues: Check the deployment logs in Render dashboard