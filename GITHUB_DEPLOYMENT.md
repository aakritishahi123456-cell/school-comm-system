# GitHub Deployment Guide

This guide covers deploying the WhatsApp School Communication System from GitHub to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

**One-Click Deployment:**
1. Click the Railway button above
2. Connect your GitHub account
3. Set environment variables
4. Deploy automatically

**Manual Railway Deployment:**
1. Fork this repository
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repository
5. Add PostgreSQL service
6. Set environment variables (see below)
7. Deploy

### Option 2: Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork this repository
2. Go to [Render](https://render.com)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm start`
6. Add PostgreSQL database
7. Set environment variables

### Option 3: Heroku

1. Fork this repository
2. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Run deployment commands:

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-school-comm-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set VERIFY_TOKEN="your_token"
heroku config:set WA_ACCESS_TOKEN="your_token"
heroku config:set WA_PHONE_NUMBER_ID="your_id"
heroku config:set NODE_ENV=production
heroku config:set TZ=Asia/Kathmandu

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

## 🔧 Environment Variables

Set these in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `VERIFY_TOKEN` | WhatsApp webhook verification token | `your_secure_token_123` |
| `WA_ACCESS_TOKEN` | WhatsApp Cloud API access token | `EAAxxxxx...` |
| `WA_PHONE_NUMBER_ID` | WhatsApp Business phone number ID | `123456789012345` |
| `NODE_ENV` | Environment mode | `production` |
| `TZ` | Timezone for cron jobs | `Asia/Kathmandu` |
| `PORT` | Server port (usually auto-set) | `3000` |

## 📋 Pre-Deployment Checklist

### 1. Fork the Repository
- Go to the [repository](https://github.com/your-username/school-comm-system)
- Click "Fork" to create your own copy
- Clone your fork locally for customization

### 2. Meta WhatsApp Setup
Before deploying, ensure you have:
- [ ] Meta Developer Account
- [ ] WhatsApp Business Account (WABA)
- [ ] Permanent Access Token (not temporary)
- [ ] Phone Number ID
- [ ] Webhook verification token

### 3. Database Setup
- [ ] PostgreSQL database ready
- [ ] Connection string available
- [ ] Database accessible from deployment platform

## 🔄 Continuous Deployment

The repository includes GitHub Actions for automatic deployment:

### Automatic Deployment Triggers
- **Push to `main`**: Deploys to production
- **Push to `develop`**: Runs tests only
- **Pull Requests**: Runs tests and type checking

### Setting Up Auto-Deploy

1. **Add Secrets to GitHub Repository:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:

```
RAILWAY_TOKEN=your_railway_token
RAILWAY_SERVICE=your_service_name
DATABASE_URL=your_database_url
VERIFY_TOKEN=your_verify_token
WA_ACCESS_TOKEN=your_whatsapp_token
WA_PHONE_NUMBER_ID=your_phone_id
```

2. **Enable Actions:**
   - Go to Actions tab in your repository
   - Enable GitHub Actions if not already enabled
   - The workflow will run automatically on pushes

## 🌐 Custom Domain Setup

### Railway
1. Go to your Railway project
2. Click on your service
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

### Render
1. Go to your Render service
2. Click Settings → Custom Domains
3. Add your domain
4. Update DNS records

### Heroku
```bash
heroku domains:add your-domain.com
# Follow DNS configuration instructions
```

## 📱 Post-Deployment Setup

### 1. Configure WhatsApp Webhook
After deployment, update your Meta App:
- **Callback URL**: `https://your-domain.com/webhook`
- **Verify Token**: Your `VERIFY_TOKEN`
- **Subscribe to**: `messages` field

### 2. Test Webhook
```bash
curl -X GET "https://your-domain.com/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test"
```

### 3. Load Pilot Data
```bash
# If you have access to the deployed environment
npm run setup

# Or use the admin API to create data manually
```

### 4. Health Check
```bash
curl https://your-domain.com/health
```

## 🔍 Monitoring & Logs

### Railway
- View logs in Railway dashboard
- Set up log drains for external monitoring

### Render
- View logs in Render dashboard
- Configure log retention settings

### Heroku
```bash
heroku logs --tail
heroku logs --source app
```

## 🚨 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check TypeScript compilation errors

**Database Connection:**
- Verify DATABASE_URL format
- Check database server accessibility
- Ensure migrations are run

**WhatsApp Integration:**
- Verify webhook URL is accessible via HTTPS
- Check VERIFY_TOKEN matches Meta configuration
- Ensure access token is permanent, not temporary

**Environment Variables:**
- Double-check all required variables are set
- Verify no typos in variable names
- Check for trailing spaces or special characters

### Debug Commands

```bash
# Check environment variables
heroku config  # For Heroku
# Or check in platform dashboard

# View recent logs
heroku logs --tail  # For Heroku
# Or view in platform dashboard

# Run database migrations manually
heroku run npx prisma migrate deploy  # For Heroku
# Or use platform console
```

## 🔄 Updates & Maintenance

### Updating the Application
1. Make changes to your forked repository
2. Push to main branch
3. Automatic deployment will trigger (if configured)
4. Monitor deployment logs for issues

### Database Migrations
```bash
# Create new migration locally
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

### Backup Strategy
- Set up automated database backups
- Export environment variables regularly
- Keep deployment configuration documented

## 📊 Scaling Considerations

### Performance Optimization
- Enable database connection pooling
- Implement Redis for caching (optional)
- Use CDN for static assets (if any)

### High Availability
- Use multiple server instances
- Implement health checks
- Set up monitoring and alerting

### Security
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use secrets management for sensitive data
- Enable HTTPS only
- Implement rate limiting

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment platform documentation
3. Check GitHub Issues in the repository
4. Verify WhatsApp API configuration in Meta Developer Console

## 📈 Monitoring Setup

### Basic Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry)
- Monitor database performance

### Advanced Monitoring
- Application Performance Monitoring (APM)
- Log aggregation and analysis
- Custom metrics and dashboards

---

**Ready to deploy? Choose your platform above and follow the guide! 🚀**