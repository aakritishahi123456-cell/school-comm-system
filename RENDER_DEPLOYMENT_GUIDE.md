# 🚀 Render Deployment Guide

## Step-by-Step Render Deployment

### 1. Prepare for Render Deployment

First, let's create the necessary Render configuration files:

#### A. Create render.yaml (Infrastructure as Code)
```yaml
services:
  - type: web
    name: school-comm-system
    env: node
    plan: starter
    buildCommand: npm install && npx prisma generate
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        fromService:
          type: web
          name: school-comm-system
          property: port
    autoDeploy: true
```

#### B. Update package.json for Render
```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "npx prisma generate",
    "postinstall": "npx prisma generate"
  }
}
```

### 2. Database Setup on Render

#### Option A: PostgreSQL (Recommended for Production)
1. Go to Render Dashboard → New → PostgreSQL
2. Name: `school-comm-system-db`
3. Plan: Free (for testing) or Starter ($7/month)
4. Copy the **Internal Database URL** (starts with `postgresql://`)

#### Option B: SQLite (Development Only)
- Keep current SQLite setup for testing
- **Note**: SQLite files are ephemeral on Render (reset on each deploy)

### 3. Environment Variables Setup

In your Render Web Service, add these environment variables:

#### Required Variables:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://your_db_url_from_render
WA_ACCESS_TOKEN=your_whatsapp_access_token
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=your_verify_token_here
WA_WEBHOOK_URL=https://your-app-name.onrender.com/webhook
```

#### Optional Variables:
```bash
REDIS_HOST=your_redis_host (if using Redis)
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
LOG_LEVEL=info
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
CORS_ORIGIN=https://your-admin-domain.com
```

### 4. Deployment Steps

#### Step 1: Push to GitHub
```bash
cd school-comm-system
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### Step 2: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `school-comm-system` repository
5. Configure:
   - **Name**: `school-comm-system`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: Free (for testing) or Starter ($7/month)

#### Step 3: Add Environment Variables
In the Render dashboard, go to Environment tab and add all the variables listed above.

#### Step 4: Deploy
Click "Create Web Service" - Render will automatically deploy your app.

### 5. Post-Deployment Setup

#### A. Database Migration
Once deployed, run database migrations:
```bash
# In Render Shell (or via deploy script)
npx prisma db push
```

#### B. WhatsApp Webhook Configuration
1. Get your Render URL: `https://your-app-name.onrender.com`
2. In WhatsApp Business API settings, set webhook URL to:
   ```
   https://your-app-name.onrender.com/webhook
   ```
3. Set verify token to match your `VERIFY_TOKEN` environment variable

#### C. Test Deployment
```bash
# Health check
curl https://your-app-name.onrender.com/health

# Webhook verification
curl "https://your-app-name.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test123"
```

### 6. Monitoring and Logs

#### View Logs:
- Go to Render Dashboard → Your Service → Logs
- Monitor for startup errors or runtime issues

#### Health Monitoring:
- Use the built-in health endpoint: `/health`
- Set up uptime monitoring with services like UptimeRobot

### 7. Custom Domain (Optional)

1. In Render Dashboard → Settings → Custom Domains
2. Add your domain (e.g., `api.yourschool.com`)
3. Update DNS records as instructed
4. Update `WA_WEBHOOK_URL` environment variable

### 8. Scaling and Performance

#### Free Tier Limitations:
- Sleeps after 15 minutes of inactivity
- 750 hours/month limit
- Shared resources

#### Upgrade to Starter ($7/month):
- Always-on service
- Faster builds and deployments
- More resources

### 9. Troubleshooting

#### Common Issues:

**Build Fails:**
```bash
# Check package.json scripts
# Ensure all dependencies are in package.json
# Check Node.js version compatibility
```

**Database Connection Errors:**
```bash
# Verify DATABASE_URL is correct
# Check if PostgreSQL service is running
# Ensure Prisma schema matches database
```

**WhatsApp Webhook Issues:**
```bash
# Verify VERIFY_TOKEN matches WhatsApp settings
# Check webhook URL is accessible
# Ensure HTTPS is working
```

### 10. Production Checklist

- [ ] PostgreSQL database created and connected
- [ ] All environment variables set
- [ ] WhatsApp webhook configured
- [ ] Health endpoint responding
- [ ] Logs showing successful startup
- [ ] Database migrations applied
- [ ] Custom domain configured (if needed)
- [ ] Monitoring set up

## Next Steps After Deployment

1. **Test WhatsApp Integration**: Send test messages
2. **Monitor Performance**: Check response times and error rates
3. **Set Up Alerts**: Configure monitoring for downtime
4. **Backup Strategy**: Set up database backups
5. **Documentation**: Update team with new URLs and access

Your WhatsApp School Communication System will be live and ready to handle messages from teachers and send updates to parents!