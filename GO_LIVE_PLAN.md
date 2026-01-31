# Go-Live Plan: School Communication System

## 🎯 Overview

This document outlines the step-by-step plan for deploying the WhatsApp School Communication System to production. The plan is designed to minimize risk, ensure smooth transition, and provide rollback capabilities.

## 📅 Timeline & Phases

### **Phase 1: Pre-Production Setup** (Week -2 to -1)
- Environment preparation
- Infrastructure provisioning
- Security configuration
- Testing and validation

### **Phase 2: Soft Launch** (Week 0, Days 1-3)
- Limited pilot deployment
- Single school testing
- Monitoring and optimization
- Issue resolution

### **Phase 3: Gradual Rollout** (Week 0, Days 4-7)
- Multi-school deployment
- Feature validation
- Performance monitoring
- User feedback collection

### **Phase 4: Full Production** (Week 1+)
- Complete system activation
- All features enabled
- Full monitoring active
- Ongoing optimization

## 🚀 Detailed Go-Live Steps

### **T-14 Days: Infrastructure Setup**

#### **Hosting Platform Selection**

**Option A: Render (Recommended for Early Stage)**
```bash
# 1. Create Render account and connect GitHub
# 2. Create services:
#    - Web Service (Node.js app)
#    - PostgreSQL database
#    - Redis instance

# 3. Configure environment variables
RENDER_SERVICE_NAME=school-comm-system
RENDER_REGION=oregon
RENDER_PLAN=starter
```

**Option B: Railway (Alternative)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and create project
railway login
railway init school-comm-system

# 3. Add services
railway add postgresql
railway add redis
```

**Option C: VPS Setup (For Later Scale)**
```bash
# 1. Provision VPS (DigitalOcean, Linode, etc.)
# 2. Setup server
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm postgresql redis-server nginx certbot

# 3. Configure PM2
npm install -g pm2
pm2 startup
```

#### **Database Setup**
```bash
# 1. Create production database
createdb school_comm_production

# 2. Configure connection pooling
# Add to DATABASE_URL: ?connection_limit=20&pool_timeout=20

# 3. Setup backup strategy
# Configure automated daily backups
```

#### **Security Configuration**
```bash
# 1. Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Configure SSL certificates
certbot --nginx -d api.schoolcomm.example.com

# 3. Setup firewall rules
ufw allow 22,80,443,3000/tcp
ufw enable
```

### **T-7 Days: Application Deployment**

#### **Environment Configuration**
```bash
# 1. Copy production environment file
cp environments/.env.production .env

# 2. Update environment variables
export NODE_ENV=production
export DATABASE_URL=postgresql://user:pass@host:5432/db
export REDIS_URL=redis://user:pass@host:6379
export WA_ACCESS_TOKEN=your_production_token
export WA_PHONE_NUMBER_ID=your_production_id
export VERIFY_TOKEN=your_secure_verify_token
```

#### **Application Build & Deploy**
```bash
# 1. Build application
npm ci --production
npm run build

# 2. Run database migrations
npm run migrate

# 3. Deploy application
npm run deploy production

# 4. Start services
pm2 start ecosystem.config.js --env production
```

#### **Health Check Verification**
```bash
# 1. Verify application health
curl https://api.schoolcomm.example.com/health

# 2. Test webhook endpoint
curl -X GET "https://api.schoolcomm.example.com/webhook?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test"

# 3. Test admin endpoints
curl https://api.schoolcomm.example.com/admin/health
```

### **T-3 Days: Integration Testing**

#### **WhatsApp API Integration**
```bash
# 1. Configure webhook URL in Meta Developer Console
WEBHOOK_URL=https://api.schoolcomm.example.com/webhook

# 2. Test webhook verification
# 3. Send test message
# 4. Verify message delivery
```

#### **End-to-End Testing**
```bash
# 1. Run integration tests
npm run test:integration

# 2. Test critical user journeys
# 3. Verify admin dashboard functionality
# 4. Test emergency announcement system
```

### **T-1 Day: Final Preparation**

#### **Pre-Launch Checklist**
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificates installed and valid
- [ ] Monitoring and alerting configured
- [ ] Backup systems tested
- [ ] Rollback plan prepared
- [ ] Team briefed and ready
- [ ] Emergency contacts list updated

#### **Monitoring Setup**
```bash
# 1. Configure health check monitoring
npm run monitor:start

# 2. Setup alerting
export ALERT_WEBHOOK_URL=your_slack_webhook
export ALERT_EMAIL=admin@school.com

# 3. Test alert system
npm run monitor:check
```

### **T-0: Go-Live Day**

#### **Morning (9:00 AM NPT)**

**Step 1: Final System Check** (15 minutes)
```bash
# Verify all systems are ready
npm run deploy:check production
npm run monitor:check
```

**Step 2: Pilot School Setup** (30 minutes)
```bash
# 1. Create first school in database
# 2. Add teachers and parents
# 3. Configure school branding
# 4. Test message flow
```

**Step 3: Go-Live Announcement** (15 minutes)
```bash
# 1. Update DNS records (if needed)
# 2. Enable production features
# 3. Send go-live notification to team
```

#### **Afternoon (2:00 PM NPT)**

**Step 4: Pilot Testing** (2 hours)
- [ ] Teacher sends first daily update
- [ ] Verify parent receives message
- [ ] Test admin dashboard functionality
- [ ] Monitor system performance
- [ ] Collect initial feedback

**Step 5: Issue Resolution** (1 hour)
- [ ] Address any immediate issues
- [ ] Optimize performance if needed
- [ ] Update documentation

#### **Evening (6:00 PM NPT)**

**Step 6: Gradual Expansion** (Ongoing)
- [ ] Add second pilot school
- [ ] Monitor system load
- [ ] Verify scalability
- [ ] Plan next day rollout

### **T+1 to T+7: Gradual Rollout**

#### **Daily Expansion Plan**
```
Day 1: 1 school (50 users)
Day 2: 3 schools (150 users)
Day 3: 5 schools (250 users)
Day 4: 10 schools (500 users)
Day 5: 20 schools (1,000 users)
Day 6: 35 schools (1,750 users)
Day 7: 50 schools (2,500 users)
```

#### **Daily Monitoring Tasks**
- [ ] Review system performance metrics
- [ ] Check error rates and logs
- [ ] Monitor WhatsApp API usage
- [ ] Collect user feedback
- [ ] Address support tickets
- [ ] Update capacity planning

## 🔧 Hosting Recommendations

### **Early Stage: Render/Railway**

**Render Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: school-comm-api
    env: node
    plan: starter
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: school-comm-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          type: redis
          name: school-comm-redis
          property: connectionString

databases:
  - name: school-comm-db
    databaseName: school_comm_production
    user: school_comm_user
    plan: starter

services:
  - type: redis
    name: school-comm-redis
    plan: starter
```

**Railway Configuration:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Growth Stage: VPS with PM2**

**PM2 Ecosystem Configuration:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'school-comm-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
```

**Nginx Configuration:**
```nginx
# /etc/nginx/sites-available/school-comm
server {
    listen 80;
    server_name api.schoolcomm.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.schoolcomm.example.com;

    ssl_certificate /etc/letsencrypt/live/api.schoolcomm.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.schoolcomm.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

## 📊 Post-Deployment Monitoring

### **Key Metrics to Monitor**

#### **Application Metrics**
- Response time (target: <200ms)
- Error rate (target: <1%)
- Throughput (messages/minute)
- Uptime (target: >99.5%)

#### **Business Metrics**
- Teacher adoption rate
- Parent engagement rate
- Message delivery success rate
- User satisfaction scores

#### **System Metrics**
- CPU usage (alert: >80%)
- Memory usage (alert: >85%)
- Disk usage (alert: >90%)
- Database connections (alert: >80% of pool)

### **Monitoring Dashboard**

```javascript
// monitoring-dashboard.js
const monitoringConfig = {
  healthChecks: {
    interval: 60000, // 1 minute
    endpoints: [
      '/health',
      '/admin/health',
      '/webhook'
    ]
  },
  alerts: {
    responseTime: 5000, // 5 seconds
    errorRate: 0.05, // 5%
    webhooks: [
      process.env.SLACK_WEBHOOK_URL,
      process.env.TEAMS_WEBHOOK_URL
    ]
  },
  metrics: {
    retention: '30d',
    aggregation: '1m'
  }
};
```

### **Alert Configuration**

```bash
# Slack webhook for alerts
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Email alerts
export ALERT_EMAIL="admin@school.com"

# SMS alerts (critical only)
export ALERT_SMS="+977-98XXXXXXXX"
```

## 🔄 Rollback Plan

### **Rollback Triggers**
- Error rate > 5%
- Response time > 5 seconds
- Critical functionality broken
- Security breach detected
- Database corruption

### **Rollback Procedure**

#### **Immediate Rollback (< 5 minutes)**
```bash
# 1. Stop current deployment
pm2 stop school-comm-api

# 2. Restore previous version
pm2 start ecosystem.config.js --env production

# 3. Verify rollback
curl https://api.schoolcomm.example.com/health
```

#### **Database Rollback (if needed)**
```bash
# 1. Stop application
pm2 stop school-comm-api

# 2. Restore database backup
npm run backup:restore backups/backup-production-TIMESTAMP.sql

# 3. Restart application
pm2 start ecosystem.config.js --env production
```

#### **DNS Rollback (if needed)**
```bash
# 1. Update DNS records to point to previous version
# 2. Wait for DNS propagation (5-15 minutes)
# 3. Verify traffic routing
```

## 📞 Emergency Contacts

### **Technical Team**
- **Technical Lead**: [Name] - [Phone] - [Email]
- **DevOps Engineer**: [Name] - [Phone] - [Email]
- **Database Admin**: [Name] - [Phone] - [Email]

### **Business Team**
- **Product Owner**: [Name] - [Phone] - [Email]
- **Customer Success**: [Name] - [Phone] - [Email]
- **School Liaison**: [Name] - [Phone] - [Email]

### **External Support**
- **Hosting Provider**: [Support Channel]
- **WhatsApp API Support**: [Support Channel]
- **Database Support**: [Support Channel]

## ✅ Success Criteria

### **Technical Success**
- [ ] System uptime > 99.5%
- [ ] Response time < 200ms (95th percentile)
- [ ] Error rate < 1%
- [ ] Zero data loss
- [ ] All monitoring systems operational

### **Business Success**
- [ ] Teacher adoption > 90%
- [ ] Parent engagement > 95%
- [ ] Message delivery success > 99%
- [ ] User satisfaction > 4.5/5
- [ ] Support tickets < 5 per day

### **Operational Success**
- [ ] Monitoring and alerting functional
- [ ] Backup and recovery tested
- [ ] Documentation complete and accurate
- [ ] Team trained and confident
- [ ] Rollback plan validated

This go-live plan ensures a smooth, controlled deployment with minimal risk and maximum chance of success.