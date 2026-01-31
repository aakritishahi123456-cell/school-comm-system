# ✅ Render Deployment Checklist

## Pre-Deployment Setup

### 1. GitHub Repository
- [ ] Initialize git repository: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit changes: `git commit -m "Initial commit for Render deployment"`
- [ ] Create GitHub repository
- [ ] Push to GitHub: `git remote add origin <your-repo-url> && git push -u origin main`

### 2. WhatsApp API Credentials
- [ ] Get WhatsApp Business API Access Token
- [ ] Note your Phone Number ID: `992612663930736`
- [ ] Create a secure verify token (random string)

## Render Deployment Steps

### 1. Create Database (Optional - Free PostgreSQL)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Settings:
   - Name: `school-comm-db`
   - Database: `school_comm_system`
   - User: `school_comm_user`
   - Plan: Free
4. [ ] Copy the **Internal Database URL**

### 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Select `school-comm-system` repository
4. Configuration:
   - [ ] **Name**: `school-comm-system`
   - [ ] **Environment**: Node
   - [ ] **Build Command**: `npm install && npx prisma generate`
   - [ ] **Start Command**: `npm start`
   - [ ] **Health Check Path**: `/health`
   - [ ] **Plan**: Free (or Starter for production)

### 3. Environment Variables
Add these in Render Dashboard → Environment:

#### Required:
- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `your_postgresql_url_from_step_1`
- [ ] `WA_ACCESS_TOKEN` = `your_whatsapp_access_token`
- [ ] `WA_PHONE_NUMBER_ID` = `992612663930736`
- [ ] `VERIFY_TOKEN` = `your_secure_verify_token`
- [ ] `WA_WEBHOOK_URL` = `https://your-app-name.onrender.com/webhook`

#### Optional:
- [ ] `JWT_SECRET` = `your_secure_jwt_secret`
- [ ] `LOG_LEVEL` = `info`
- [ ] `CORS_ORIGIN` = `*`
- [ ] `ENABLE_RATE_LIMITING` = `true`

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Check logs for any errors

## Post-Deployment Verification

### 1. Health Check
- [ ] Visit: `https://your-app-name.onrender.com/health`
- [ ] Should return: `{"status":"healthy",...}`

### 2. Database Setup
- [ ] Go to Render Shell or use deployment script
- [ ] Run: `npx prisma db push`
- [ ] Verify database tables are created

### 3. WhatsApp Webhook Setup
1. Go to WhatsApp Business API Dashboard
2. [ ] Set Webhook URL: `https://your-app-name.onrender.com/webhook`
3. [ ] Set Verify Token: (same as your `VERIFY_TOKEN` env var)
4. [ ] Test webhook verification

### 4. Test Webhook
- [ ] Test URL: `https://your-app-name.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test123`
- [ ] Should return: `test123`

## Production Readiness

### 1. Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor `/health` endpoint
- [ ] Set up alerts for downtime

### 2. Performance
- [ ] Consider upgrading to Starter plan ($7/month) for:
  - Always-on service (no sleep)
  - Better performance
  - More resources

### 3. Security
- [ ] Use strong JWT secret
- [ ] Enable webhook signature verification
- [ ] Set proper CORS origins
- [ ] Use HTTPS only

### 4. Backup
- [ ] Set up database backups
- [ ] Test restore procedures
- [ ] Document recovery process

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

**Database Connection:**
- Verify DATABASE_URL is correct
- Check PostgreSQL service status
- Ensure Prisma schema matches

**WhatsApp Webhook:**
- Verify VERIFY_TOKEN matches
- Check webhook URL accessibility
- Ensure HTTPS is working

**App Sleeps (Free Plan):**
- Upgrade to Starter plan
- Or use external monitoring to keep alive

## Success Criteria

- [ ] ✅ App deploys without errors
- [ ] ✅ Health endpoint responds
- [ ] ✅ Database connects successfully
- [ ] ✅ WhatsApp webhook verifies
- [ ] ✅ Logs show successful startup
- [ ] ✅ No critical errors in monitoring

## Your Deployment URLs

After deployment, update these:
- **App URL**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/health`
- **Webhook**: `https://your-app-name.onrender.com/webhook`
- **Admin Dashboard**: `https://your-app-name.onrender.com/admin`

🎉 **Your WhatsApp School Communication System is now live on Render!**