# 🔧 Render Environment Variables Fix

## The Current Issue

Your app is deploying successfully, but failing at runtime because the WhatsApp API credentials are not configured properly. The error shows:

```
❌ Failed to send messages: {
  error: {
    message: 'The access token could not be decrypted',
    type: 'OAuthException', 
    code: 190
  }
}
```

## ⚡ IMMEDIATE FIX

### Step 1: Add Required Environment Variables

1. **Go to your Render service**: https://dashboard.render.com
2. **Click on your service**: `school-comm-system`
3. **Click the "Environment" tab**
4. **Add these environment variables**:

#### Required Variables:
```bash
NODE_ENV=production
WA_ACCESS_TOKEN=your_actual_whatsapp_access_token_here
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=your_secure_verify_token_here
WA_WEBHOOK_URL=https://school-comm-system.onrender.com/webhook
```

#### Optional but Recommended:
```bash
JWT_SECRET=your_super_secure_jwt_secret_here
LOG_LEVEL=info
CORS_ORIGIN=*
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
TRUST_PROXY=true
```

### Step 2: Get Your WhatsApp Credentials

If you don't have your WhatsApp credentials:

1. **Go to**: https://developers.facebook.com/apps
2. **Select your WhatsApp Business app**
3. **Go to WhatsApp → API Setup**
4. **Copy**:
   - **Access Token** (temporary or permanent)
   - **Phone Number ID** (should be `992612663930736`)
5. **Create a secure verify token** (any random string like `my_secure_verify_token_123`)

### Step 3: Add Database URL (if using PostgreSQL)

If you created a PostgreSQL database on Render:
```bash
DATABASE_URL=postgresql://your_db_connection_string
```

### Step 4: Save and Redeploy

1. **Click "Save Changes"** after adding all variables
2. **Go to service overview**
3. **Click "Manual Deploy" → "Deploy latest commit"**
4. **Wait for deployment to complete**

## 🎯 Testing Your Deployment

### 1. Health Check
Visit: `https://school-comm-system.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-31T...",
  "uptime": 123,
  "version": "3.0.0"
}
```

### 2. Webhook Verification
Visit: `https://school-comm-system.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test123`

Should return: `test123`

### 3. Check Logs
In Render dashboard → Logs, you should see:
```
✅ Server started successfully
✅ Database connected
✅ WhatsApp webhook ready
```

## 🔧 Environment Variables Template

Copy this template and replace with your actual values:

```bash
# Core Application
NODE_ENV=production
PORT=10000

# WhatsApp API - REPLACE WITH YOUR ACTUAL VALUES
WA_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=my_secure_verify_token_123
WA_WEBHOOK_URL=https://school-comm-system.onrender.com/webhook

# Database (if using Render PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Security
JWT_SECRET=your_super_secure_jwt_secret_here
CORS_ORIGIN=*
TRUST_PROXY=true

# Features
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true
ENABLE_CACHING=false

# Logging
LOG_LEVEL=info

# Nepal Configuration
NEPAL_TIMEZONE=Asia/Kathmandu
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,ne
```

## 🚨 Important Notes

### WhatsApp Access Token:
- **Temporary tokens** expire in 24 hours
- **Permanent tokens** last longer but need proper app review
- **Test with temporary** first, then get permanent for production

### Verify Token:
- Can be any secure random string
- Must match exactly in WhatsApp webhook configuration
- Keep it secret and secure

### Database:
- If not using database features, you can skip DATABASE_URL
- For production, use PostgreSQL (not SQLite)

## 🎉 Success Indicators

After adding environment variables and redeploying:

1. **Logs show**: No more "access token could not be decrypted" errors
2. **Health endpoint**: Returns healthy status
3. **Webhook**: Verifies correctly with your token
4. **WhatsApp**: Can receive webhook calls (test with WhatsApp Business API)

## 📋 Next Steps After Fix

1. ✅ Add all environment variables
2. ✅ Redeploy service
3. ✅ Test health endpoint
4. ✅ Test webhook verification
5. ✅ Configure WhatsApp webhook URL in Facebook Developer Console
6. ✅ Test sending a message from WhatsApp Business API
7. ✅ Monitor logs for successful message processing

Your WhatsApp School Communication System will be fully functional after adding the correct environment variables! 🚀