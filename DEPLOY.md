# Deployment Guide

Complete step-by-step deployment instructions for the WhatsApp School Communication System.

## Prerequisites

- Node.js 18+ installed
- Git installed
- WhatsApp Business Account with Meta Developer access
- Render account (or alternative hosting platform)

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd school-comm-system

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Step 2: WhatsApp Business API Setup

### 2.1 Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a developer account if you don't have one
3. Create a new app and select "Business" type

### 2.2 Configure WhatsApp Business API
1. Add WhatsApp product to your app
2. Get your credentials:
   - **Phone Number ID**: Found in WhatsApp > API Setup
   - **Access Token**: Generate a permanent token
   - **Business Account ID**: Found in WhatsApp > API Setup
   - **Verify Token**: Create your own secure string

### 2.3 Update Environment Variables
Edit `.env` file with your credentials:

```env
# Server Configuration
PORT=10000
NODE_ENV=production

# WhatsApp Cloud API Configuration
VERIFY_TOKEN="your_secure_verify_token_here"
WA_ACCESS_TOKEN="your_permanent_access_token_here"
WA_PHONE_NUMBER_ID="your_phone_number_id_here"
WA_BUSINESS_ACCOUNT_ID="your_business_account_id_here"

# Test Configuration
TEST_WHATSAPP_NUMBER="+15551453997"
```

## Step 3: Local Testing

```bash
# Run tests
npm test

# Start development server
npm run dev

# Test endpoints
curl http://localhost:10000/health
curl http://localhost:10000/test
```

## Step 4: Deploy to Render

### 4.1 Create Render Account
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub account

### 4.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure deployment:
   - **Name**: `school-comm-system`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free` (or paid for production)

### 4.3 Set Environment Variables
In Render dashboard, add these environment variables:
- `NODE_ENV`: `production`
- `PORT`: `10000`
- `VERIFY_TOKEN`: Your verify token
- `WA_ACCESS_TOKEN`: Your WhatsApp access token
- `WA_PHONE_NUMBER_ID`: Your phone number ID
- `WA_BUSINESS_ACCOUNT_ID`: Your business account ID
- `TEST_WHATSAPP_NUMBER`: `+15551453997`

### 4.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your app URL (e.g., `https://school-comm-system.onrender.com`)

## Step 5: Configure WhatsApp Webhook

### 5.1 Set Webhook URL
1. In Meta Developer Console, go to WhatsApp > Configuration
2. Set webhook URL: `https://your-app-url.onrender.com/webhook`
3. Set verify token (same as in your .env file)
4. Subscribe to `messages` events

### 5.2 Verify Webhook
1. Click "Verify and Save"
2. Check your Render logs for verification success
3. Test webhook: `GET https://your-app-url.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test123`

## Step 6: Test the System

### 6.1 Access Dashboard
Visit: `https://your-app-url.onrender.com/dashboard`

### 6.2 Test Message Processing
Send WhatsApp messages to your business number from `+1 555 145 3997`:

**Daily Update:**
```
Class: Grade 5A
Subject: Mathematics
Topic: Addition and Subtraction
Homework: Complete exercises 1-10
Understanding: Good
```

**Attendance:**
```
Attendance: P,A,P,P,A
```

**Announcement (Admin):**
```
Announcement: School Holiday
Message: Tomorrow is a public holiday
```

### 6.3 Monitor Logs
- Check Render logs for message processing
- Use `/health` endpoint for system status
- Use `/api/stats` for system statistics

## Step 7: Production Considerations

### 7.1 Database Migration
Replace in-memory database with PostgreSQL:
1. Add PostgreSQL service in Render
2. Update `DATABASE_URL` environment variable
3. Implement Prisma migrations

### 7.2 Security Enhancements
- Use strong verify tokens
- Implement rate limiting
- Add request validation
- Set up monitoring and alerts

### 7.3 Scaling
- Upgrade Render instance type
- Implement message queuing for high volume
- Add Redis for session management
- Set up load balancing

## Step 8: Monitoring and Maintenance

### 8.1 Health Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor `/health` endpoint
- Set up error alerting

### 8.2 Log Management
- Use structured logging
- Set up log aggregation
- Monitor error rates

### 8.3 Backup Strategy
- Regular database backups
- Environment variable backup
- Code repository backup

## Troubleshooting

### Common Issues

**Webhook Verification Failed**
- Check verify token matches exactly
- Ensure webhook URL is accessible
- Check Render logs for errors

**Messages Not Processing**
- Verify WhatsApp credentials
- Check message format
- Monitor webhook payload in logs

**Deployment Fails**
- Check Node.js version compatibility
- Verify all dependencies are listed
- Check build logs in Render

**Performance Issues**
- Monitor memory usage
- Check for memory leaks
- Consider upgrading instance

### Support Commands

```bash
# Check system status
curl https://your-app-url.onrender.com/health

# View recent messages
curl https://your-app-url.onrender.com/api/messages

# Get system statistics
curl https://your-app-url.onrender.com/api/stats

# Test webhook verification
curl "https://your-app-url.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test123"
```

## CI/CD Pipeline

The system includes automated CI/CD with GitHub Actions:

1. **Continuous Integration**: Tests, linting, security checks
2. **Automated Deployment**: Deploys to Render on main branch push
3. **Quality Gates**: Code coverage, security audit, formatting

To enable CI/CD:
1. Push code to GitHub
2. Set up GitHub Secrets for environment variables
3. Pipeline runs automatically on push/PR

## Next Steps

1. **Add Real Database**: Migrate from in-memory to PostgreSQL
2. **Implement Authentication**: Add admin login system
3. **Add More Features**: File uploads, voice messages, groups
4. **Scale Infrastructure**: Load balancing, caching, queuing
5. **Mobile App**: Build companion mobile app for admins

## Support

For issues and questions:
- Check logs in Render dashboard
- Review GitHub Issues
- Contact system administrator

---

**Deployment Checklist:**
- [ ] WhatsApp Business API configured
- [ ] Environment variables set
- [ ] Render service created
- [ ] Webhook configured and verified
- [ ] Test messages working
- [ ] Dashboard accessible
- [ ] Health checks passing
- [ ] CI/CD pipeline active