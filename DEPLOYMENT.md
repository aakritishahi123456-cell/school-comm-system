# Deployment Guide

This guide covers deploying the WhatsApp School Communication System to various platforms.

## Prerequisites

1. **Meta WhatsApp Cloud API Setup** (see main README.md)
2. **PostgreSQL Database** (local or cloud)
3. **Node.js 18+** installed

## Environment Variables

Ensure these are set in your deployment environment:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://username:password@host:port/database"
VERIFY_TOKEN="your_webhook_verify_token"
WA_ACCESS_TOKEN="your_permanent_whatsapp_access_token"
WA_PHONE_NUMBER_ID="your_whatsapp_phone_number_id"
TZ=Asia/Kathmandu
```

## Deployment Options

### 1. Railway (Recommended)

Railway provides easy deployment with PostgreSQL addon:

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize:**
   ```bash
   railway login
   railway init
   ```

3. **Add PostgreSQL:**
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables:**
   ```bash
   railway variables set VERIFY_TOKEN="your_token"
   railway variables set WA_ACCESS_TOKEN="your_token"
   railway variables set WA_PHONE_NUMBER_ID="your_id"
   railway variables set NODE_ENV=production
   railway variables set TZ=Asia/Kathmandu
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Run Database Migration:**
   ```bash
   railway run npx prisma migrate deploy
   ```

### 2. Render

1. **Create New Web Service** on Render dashboard
2. **Connect GitHub Repository**
3. **Configure Build & Start Commands:**
   - Build Command: `npm install && npm run build && npx prisma migrate deploy`
   - Start Command: `npm start`
4. **Add Environment Variables** in Render dashboard
5. **Add PostgreSQL Database** from Render dashboard

### 3. Heroku

1. **Install Heroku CLI**
2. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set VERIFY_TOKEN="your_token"
   heroku config:set WA_ACCESS_TOKEN="your_token"
   heroku config:set WA_PHONE_NUMBER_ID="your_id"
   heroku config:set NODE_ENV=production
   heroku config:set TZ=Asia/Kathmandu
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Run Migration:**
   ```bash
   heroku run npx prisma migrate deploy
   ```

### 4. VPS (Ubuntu/CentOS)

1. **Install Node.js and PostgreSQL:**
   ```bash
   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql postgresql-contrib

   # CentOS
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs postgresql postgresql-server
   ```

2. **Setup PostgreSQL:**
   ```bash
   sudo -u postgres createuser --interactive
   sudo -u postgres createdb school_comm_db
   ```

3. **Clone and Setup Application:**
   ```bash
   git clone <your-repo>
   cd school-comm-system
   npm install
   ```

4. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

5. **Run Database Migration:**
   ```bash
   npx prisma migrate deploy
   ```

6. **Setup PM2 for Process Management:**
   ```bash
   npm install -g pm2
   pm2 start src/index.ts --name school-comm --interpreter ts-node
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx (Optional):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment Steps

### 1. Verify Webhook

Test your webhook endpoint:
```bash
curl -X GET "https://your-domain.com/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test"
```

### 2. Setup Pilot Data

Run the setup script to create sample data:
```bash
npm run setup
```

### 3. Test WhatsApp Integration

1. Send a test message from a registered teacher's WhatsApp
2. Check server logs for message processing
3. Verify parents receive formatted messages

### 4. Configure Meta Webhook

In your Meta App dashboard:
- Set Callback URL to: `https://your-domain.com/webhook`
- Set Verify Token to your `VERIFY_TOKEN`
- Subscribe to `messages` field

## Monitoring and Maintenance

### Health Check

The application provides a health check endpoint:
```
GET /health
```

### Logs

Monitor application logs:
```bash
# Railway
railway logs

# Heroku
heroku logs --tail

# PM2 (VPS)
pm2 logs school-comm
```

### Database Backup

Regular database backups are recommended:
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Monthly Summary Cron

The application automatically runs monthly summaries on the 1st of each month at 9 AM Nepal time. Ensure your server timezone is set correctly.

## Troubleshooting

### Common Issues

1. **Webhook Verification Failed**
   - Check VERIFY_TOKEN matches Meta configuration
   - Ensure HTTPS is enabled

2. **Database Connection Error**
   - Verify DATABASE_URL format
   - Check database server accessibility

3. **WhatsApp Messages Not Sending**
   - Verify WA_ACCESS_TOKEN is permanent token
   - Check WA_PHONE_NUMBER_ID is correct
   - Ensure phone number is verified in Meta

4. **Messages Not Parsing**
   - Check message format matches expected patterns
   - Verify teacher/admin WhatsApp numbers are registered

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive tokens to version control
2. **HTTPS**: Always use HTTPS in production for webhook security
3. **Database**: Use strong passwords and restrict database access
4. **Rate Limiting**: Consider implementing rate limiting for webhook endpoints
5. **Input Validation**: The system validates all incoming messages and user data

## Scaling Considerations

For larger deployments:

1. **Database Optimization**: Add indexes for frequently queried fields
2. **Message Queue**: Implement Redis/Bull for message processing
3. **Load Balancing**: Use multiple server instances behind a load balancer
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Monitoring**: Use APM tools like New Relic or DataDog