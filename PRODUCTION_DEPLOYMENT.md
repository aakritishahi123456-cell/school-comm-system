# Production Deployment Guide

## 🚀 Production-Grade WhatsApp School Communication System

This guide covers the complete deployment of the upgraded production-grade system capable of handling 1,000+ schools.

## 📋 Prerequisites

### System Requirements
- **Server**: 4+ CPU cores, 8GB+ RAM, 100GB+ SSD
- **Operating System**: Ubuntu 20.04+ or CentOS 8+
- **Node.js**: Version 18+ or 20+
- **Database**: PostgreSQL 13+
- **Cache**: Redis 6+
- **Process Manager**: PM2 or Docker
- **Load Balancer**: Nginx (recommended)

### External Services
- **WhatsApp Business API**: Meta Developer Account
- **Domain**: SSL certificate for HTTPS
- **Monitoring**: Optional (DataDog, New Relic, etc.)

## 🔧 Infrastructure Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE school_comm_db;
CREATE USER school_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE school_comm_db TO school_user;
\q

# Configure PostgreSQL for production
sudo nano /etc/postgresql/13/main/postgresql.conf
# Set: max_connections = 100, shared_buffers = 256MB

sudo systemctl restart postgresql
```

### 3. Redis Configuration

```bash
# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: requirepass your_redis_password
# Set: maxmemory 512mb
# Set: maxmemory-policy allkeys-lru

sudo systemctl restart redis
```

## 📦 Application Deployment

### Option A: PM2 Deployment (Recommended)

```bash
# Clone repository
git clone https://github.com/your-username/school-comm-system.git
cd school-comm-system

# Install dependencies
npm ci --production

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run migrate

# Configure environment
cp .env.example .env
nano .env
```

#### Environment Configuration (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://school_user:your_secure_password@localhost:5432/school_comm_db"
DB_MAX_CONNECTIONS=20

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# WhatsApp Cloud API
WA_ACCESS_TOKEN=your_permanent_access_token
WA_PHONE_NUMBER_ID=your_phone_number_id
WA_BUSINESS_ACCOUNT_ID=your_business_account_id
VERIFY_TOKEN=your_secure_verify_token

# Rate Limits
WA_RATE_LIMIT_PER_SECOND=10
WA_RATE_LIMIT_PER_MINUTE=600
WA_RATE_LIMIT_PER_HOUR=10000

# Security
JWT_SECRET=your_super_secure_jwt_secret
BCRYPT_ROUNDS=12

# Workers
MESSAGE_WORKER_CONCURRENCY=5
WHATSAPP_WORKER_CONCURRENCY=3
NOTIFICATION_WORKER_CONCURRENCY=2

# Monitoring
ENABLE_METRICS=true
LOG_LEVEL=info
```

#### Start with PM2
```bash
# Start all processes
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided

# Monitor processes
pm2 monit
```

### Option B: Docker Deployment

```bash
# Clone repository
git clone https://github.com/your-username/school-comm-system.git
cd school-comm-system

# Configure environment
cp .env.example .env
nano .env

# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## 🌐 Nginx Configuration

Create `/etc/nginx/sites-available/school-comm-system`:

```nginx
upstream school_comm_backend {
    server 127.0.0.1:3000;
    # Add more servers for load balancing
    # server 127.0.0.1:3001;
    # server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=webhook:10m rate=100r/s;

    # Webhook endpoint (high rate limit)
    location /webhook {
        limit_req zone=webhook burst=200 nodelay;
        proxy_pass http://school_comm_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }

    # API endpoints (normal rate limit)
    location /api {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://school_comm_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    # Health check (no rate limit)
    location /health {
        proxy_pass http://school_comm_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_read_timeout 10s;
        proxy_connect_timeout 5s;
    }

    # All other requests
    location / {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://school_comm_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (if any)
    location /static {
        alias /var/www/school-comm-system/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/school-comm-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔐 WhatsApp Business API Setup

### 1. Meta Developer Console Configuration

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app → Business type
3. Add WhatsApp product
4. Configure webhook:
   - **URL**: `https://your-domain.com/webhook`
   - **Verify Token**: Your secure verify token from .env
   - **Subscribe to**: `messages`

### 2. Get Permanent Access Token

```bash
# Use Graph API Explorer or curl
curl -X GET "https://graph.facebook.com/v19.0/me?access_token=YOUR_TEMP_TOKEN"

# Exchange for permanent token (follow Meta documentation)
```

### 3. Test Webhook

```bash
# Test webhook verification
curl "https://your-domain.com/webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test123"

# Should return: test123
```

## 📊 Monitoring Setup

### 1. System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Setup log rotation
sudo nano /etc/logrotate.d/school-comm-system
```

Logrotate configuration:
```
/var/www/school-comm-system/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 2. Application Monitoring

```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Setup PM2 web monitoring (optional)
pm2 install pm2-server-monit
```

### 3. Database Monitoring

```bash
# PostgreSQL monitoring queries
sudo -u postgres psql school_comm_db

-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check database size
SELECT pg_size_pretty(pg_database_size('school_comm_db'));

-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

## 🚨 Health Checks & Alerts

### 1. Health Check Script

Create `/opt/health-check.sh`:
```bash
#!/bin/bash

# Check application health
APP_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ $APP_HEALTH -ne 200 ]; then
    echo "Application health check failed: $APP_HEALTH"
    # Send alert (email, Slack, etc.)
fi

# Check database
DB_HEALTH=$(sudo -u postgres psql -d school_comm_db -c "SELECT 1;" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "Database health check failed"
    # Send alert
fi

# Check Redis
REDIS_HEALTH=$(redis-cli -a your_redis_password ping 2>/dev/null)
if [ "$REDIS_HEALTH" != "PONG" ]; then
    echo "Redis health check failed"
    # Send alert
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is high: ${DISK_USAGE}%"
    # Send alert
fi
```

Make executable and add to cron:
```bash
chmod +x /opt/health-check.sh
crontab -e
# Add: */5 * * * * /opt/health-check.sh
```

### 2. PM2 Monitoring

```bash
# Setup PM2 monitoring
pm2 install pm2-auto-pull  # Auto-deploy on git push
pm2 install pm2-slack      # Slack notifications
```

## 🔄 Backup Strategy

### 1. Database Backup

Create `/opt/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/school-comm-system"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
sudo -u postgres pg_dump school_comm_db | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Database backup completed: db_backup_$DATE.sql.gz"
```

### 2. Application Backup

```bash
# Backup application files
tar -czf /var/backups/school-comm-system/app_backup_$(date +%Y%m%d).tar.gz \
    /var/www/school-comm-system \
    --exclude=node_modules \
    --exclude=logs
```

Add to cron:
```bash
# Daily database backup at 2 AM
0 2 * * * /opt/backup-db.sh

# Weekly application backup
0 3 * * 0 /opt/backup-app.sh
```

## 🚀 Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Add multiple app instances behind Nginx
2. **Database**: Read replicas for read-heavy operations
3. **Redis**: Redis Cluster for high availability
4. **Workers**: Scale workers independently based on queue depth

### Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Connection Pooling**: Optimize database connection pools
3. **Caching**: Implement application-level caching
4. **CDN**: Use CDN for static assets

### Monitoring Metrics

- **Response Time**: < 200ms for webhooks, < 2s for API
- **Queue Depth**: Monitor job backlog
- **Error Rate**: < 1% error rate
- **Database Performance**: Query time, connection count
- **Memory Usage**: < 80% of available memory
- **CPU Usage**: < 70% average

## 🎯 Go-Live Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] SSL certificate installed and tested
- [ ] WhatsApp webhook verified
- [ ] Health checks passing
- [ ] Monitoring setup complete
- [ ] Backup strategy implemented
- [ ] Load testing completed

### Launch
- [ ] DNS updated to point to new server
- [ ] WhatsApp webhook URL updated
- [ ] All services started and monitored
- [ ] Test messages sent and received
- [ ] Performance metrics within targets

### Post-Launch
- [ ] Monitor error rates and performance
- [ ] Verify all scheduled tasks running
- [ ] Check backup completion
- [ ] Review logs for any issues
- [ ] Document any configuration changes

## 🆘 Troubleshooting

### Common Issues

1. **High Memory Usage**
   ```bash
   # Check memory usage
   pm2 monit
   # Restart if needed
   pm2 restart all
   ```

2. **Queue Backlog**
   ```bash
   # Check queue status
   curl http://localhost:3000/admin/queues
   # Scale workers if needed
   pm2 scale whatsapp-worker +2
   ```

3. **Database Connection Issues**
   ```bash
   # Check connections
   sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
   # Restart if needed
   sudo systemctl restart postgresql
   ```

4. **WhatsApp API Errors**
   ```bash
   # Check logs
   pm2 logs whatsapp-worker
   # Verify token validity
   curl -H "Authorization: Bearer $WA_ACCESS_TOKEN" \
        "https://graph.facebook.com/v19.0/$WA_PHONE_NUMBER_ID"
   ```

## 📞 Support

For production support:
- Check logs: `pm2 logs`
- Monitor health: `curl http://localhost:3000/health`
- Database status: `sudo systemctl status postgresql`
- Redis status: `sudo systemctl status redis`

This production deployment guide ensures a robust, scalable system capable of handling Nepal's educational communication needs at scale.