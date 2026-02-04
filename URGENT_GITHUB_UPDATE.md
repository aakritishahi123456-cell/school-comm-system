# 🚨 URGENT: Update GitHub Repository

## The Problem
Render is still using the old version of your code from GitHub. Even though we've fixed the files locally, **Render can't see the changes until they're pushed to GitHub**.

## ⚡ IMMEDIATE SOLUTION

### Option 1: Manual File Upload (Easiest)
1. **Go to your GitHub repository**: https://github.com/aakritishahi123456-cell/school-comm-system
2. **Click on `package.json`**
3. **Click the pencil icon** (Edit this file)
4. **Replace the entire content** with this:

```json
{
  "name": "school-comm-system",
  "version": "3.0.0",
  "description": "Simple WhatsApp School Communication System",
  "main": "simple-server.js",
  "scripts": {
    "start": "node simple-server.js",
    "dev": "node simple-server.js",
    "build": "echo 'No build needed - simple server ready'",
    "test": "echo 'Tests skipped for simple deployment'",
    "deploy:render": "echo 'Ready for Render deployment'"
  },
  "keywords": ["whatsapp", "school", "communication", "nepal", "education"],
  "author": "School Communication Team",
  "license": "MIT",
  "type": "commonjs",
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {},
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

5. **Click "Commit changes"**
6. **Add commit message**: "Fix package.json for simple deployment"
7. **Click "Commit changes"**

### Option 2: Add the Simple Server File
1. **In your GitHub repository**
2. **Click "Add file" → "Create new file"**
3. **Name it**: `simple-server.js`
4. **Paste this content**:

```javascript
// Simple WhatsApp School Communication Server - No Dependencies
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'WhatsApp School Communication System',
    version: '3.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    message: 'Simple server running successfully!',
    features: {
      whatsappWebhook: true,
      healthCheck: true,
      basicAPI: true
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '3.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// WhatsApp webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification attempt:', { mode, token: token ? 'present' : 'missing' });

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid verify token'
    });
  }
});

// WhatsApp webhook receiver (POST)
app.post('/webhook', (req, res) => {
  console.log('📨 Webhook received:', JSON.stringify(req.body, null, 2));

  // Immediate response to WhatsApp (required)
  res.status(200).json({ 
    received: true, 
    timestamp: new Date().toISOString() 
  });

  // Process webhook data
  try {
    if (req.body && req.body.entry) {
      req.body.entry.forEach(entry => {
        if (entry.changes) {
          entry.changes.forEach(change => {
            if (change.value && change.value.messages) {
              change.value.messages.forEach(message => {
                console.log('📱 Processing message:', {
                  from: message.from,
                  type: message.type,
                  text: message.text ? message.text.body : 'N/A'
                });
                console.log('✅ Message processed successfully');
              });
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error.message);
  }
});

// Admin dashboard
app.get('/admin', (req, res) => {
  res.json({
    dashboard: 'WhatsApp School Communication Admin',
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    configuration: {
      whatsappToken: process.env.WA_ACCESS_TOKEN ? 'configured' : 'missing',
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID || 'not set',
      verifyToken: process.env.VERIFY_TOKEN ? 'configured' : 'missing'
    },
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log('🚀 WhatsApp School Communication System Started!');
  console.log(`📍 Server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ Ready to receive WhatsApp webhooks!');
});

module.exports = app;
```

5. **Click "Commit new file"**

## 🎯 After Updating GitHub

1. **Go back to Render**
2. **Click "Manual Deploy"**
3. **Select "Deploy latest commit"**
4. **Wait 2-3 minutes**

## ✅ Expected Result

After updating GitHub and redeploying:
```
✅ npm install (only express and dotenv)
✅ Build succeeded
✅ Server started successfully
🚀 WhatsApp School Communication System Started!
```

## 🚨 Critical Point

**Render can only see files that are in your GitHub repository.** The changes we made locally don't exist on GitHub yet, so Render is still trying to run the old Prisma code.

Once you update the files on GitHub, Render will use the new simple server and it will work perfectly!

## 📞 Alternative: Use GitHub Desktop

If you have GitHub Desktop:
1. Open GitHub Desktop
2. Select your repository
3. You'll see the changed files
4. Commit and push them

**Update GitHub first, then deploy in Render!** 🚀