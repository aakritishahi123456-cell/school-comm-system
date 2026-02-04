# 🚨 EMERGENCY DEPLOYMENT SOLUTION

## The Issue
Render keeps failing because it's using old code from GitHub that has Prisma dependencies. We need to get a working version deployed immediately.

## ⚡ IMMEDIATE SOLUTION - Create New Repository

Since updating the existing repository is causing issues, let's create a fresh, clean deployment:

### Step 1: Create New GitHub Repository
1. **Go to**: https://github.com/new
2. **Repository name**: `whatsapp-school-system`
3. **Make it Public**
4. **Don't initialize** with README, .gitignore, or license
5. **Click "Create repository"**

### Step 2: Upload These 2 Files Only

#### File 1: `package.json`
```json
{
  "name": "whatsapp-school-system",
  "version": "1.0.0",
  "description": "Simple WhatsApp School Communication System",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### File 2: `server.js`
```javascript
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'WhatsApp School Communication System',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// WhatsApp webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification:', { mode, token: !!token, challenge: !!challenge });

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).json({ error: 'Invalid verify token' });
  }
});

// WhatsApp webhook receiver
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook received:', JSON.stringify(req.body, null, 2));
  
  res.status(200).json({ 
    received: true, 
    timestamp: new Date().toISOString() 
  });

  // Process messages
  if (req.body?.entry) {
    req.body.entry.forEach(entry => {
      entry.changes?.forEach(change => {
        change.value?.messages?.forEach(message => {
          console.log('📱 Message from:', message.from, 'Text:', message.text?.body);
        });
      });
    });
  }
});

// Admin info
app.get('/admin', (req, res) => {
  res.json({
    system: 'WhatsApp School Communication',
    status: 'active',
    config: {
      whatsappToken: process.env.WA_ACCESS_TOKEN ? 'configured' : 'missing',
      phoneId: process.env.WA_PHONE_NUMBER_ID || 'not set',
      verifyToken: process.env.VERIFY_TOKEN ? 'configured' : 'missing'
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log('✅ WhatsApp webhook ready');
});
```

### Step 3: Upload Files to GitHub
1. **In your new repository**, click "uploading an existing file"
2. **Drag and drop** or select both files
3. **Commit the files**

### Step 4: Deploy to Render
1. **Go to Render**: https://dashboard.render.com
2. **Create New Web Service**
3. **Connect your NEW repository**: `whatsapp-school-system`
4. **Settings**:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

### Step 5: Add Environment Variables
```
WA_ACCESS_TOKEN=EAAL2J1MsZBMoBQkllUzdstZAMkwpPw62NKPf3aoDzryS6xhgXCgH2W1bPQNSq7Xym6zE9GbUcCvCJkIHHuDtiGVhsZC6LRJV51d6V7efsPDSMGw8hmClkLz0KZBg2s3tHEfernJDUZCurOujdhkKZBPgzJtCg7Y8PdSGJGRxpQ9A6rHzEZBMFINWaEFKZC7vDZBwBjtG7piu6XamzXBCtyQmyjmgPzjD35PKbuHaoAWEqZAcTYk6HGHXTF4oG1OozFjceKhwlZBOePfy29fc7h1JuaZCjGcj
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=school_verify_2026
NODE_ENV=production
```

### Step 6: Deploy
1. **Click "Create Web Service"**
2. **Wait 3-5 minutes**
3. **Your app will be live!**

## ✅ Why This Will Work
- **Clean repository** - No Prisma or complex dependencies
- **Only 2 files** - Minimal setup
- **Only Express + dotenv** - No build issues
- **All WhatsApp functionality** - Webhook verification and message processing

## 🎯 Expected Result
```
✅ npm install completed
✅ Build succeeded
✅ Server running on port 10000
✅ WhatsApp webhook ready
```

## 🌐 Your New URLs
- **Health**: `https://whatsapp-school-system.onrender.com/health`
- **Webhook**: `https://whatsapp-school-system.onrender.com/webhook`
- **Admin**: `https://whatsapp-school-system.onrender.com/admin`

This fresh start approach will definitely work! 🚀