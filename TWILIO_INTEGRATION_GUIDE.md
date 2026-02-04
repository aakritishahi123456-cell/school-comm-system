# 🚀 TWILIO INTEGRATION - MAKE YOUR SYSTEM LIVE!

## 🎯 QUICK START - Get Live in 15 Minutes!

Your WhatsApp School Communication System is ready for Twilio integration. Follow these exact steps to make it live with real WhatsApp messaging.

## ✅ What You Already Have
- ✅ **Working server** deployed at https://school-comm-system.onrender.com
- ✅ **WhatsApp credentials** configured (Access Token, Phone Number ID)
- ✅ **Complete system architecture** with all features
- ✅ **Twilio-ready code** in `twilio-server.js`

## 🚀 Step 1: Create Twilio Account (5 minutes)

## Overview
Let's integrate Twilio's WhatsApp Business API to make your school communication system fully functional with real WhatsApp messaging.

## 🎯 Twilio WhatsApp Business API Benefits

### For Your School System:
- ✅ **Official WhatsApp Business API** - Reliable and compliant
- ✅ **Easy Integration** - Simple REST API
- ✅ **Template Messages** - Pre-approved message formats
- ✅ **Media Support** - Send images, documents, audio
- ✅ **Delivery Status** - Track message delivery and read receipts
- ✅ **Scale Ready** - Handle thousands of messages
- ✅ **Nepal Support** - Works globally including Nepal

## 📋 Setup Steps

### Step 1: Create Twilio Account
1. **Go to**: https://www.twilio.com/try-twilio
2. **Sign up** with your email
3. **Verify** your phone number
4. **Get $15 free credit** for testing

### Step 2: Enable WhatsApp Sandbox (For Testing)
1. **In Twilio Console**, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. **Follow the instructions** to join the sandbox
3. **Send "join [sandbox-code]"** to the Twilio WhatsApp number
4. **Test messaging** works both ways

### Step 3: Get Twilio Credentials
From your Twilio Console Dashboard:
- **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Auth Token**: `your_auth_token_here`
- **WhatsApp From Number**: `whatsapp:+14155238886` (sandbox)

### Step 4: Request WhatsApp Business Profile (Production)
1. **Go to**: Messaging → WhatsApp → Senders
2. **Click "Request to enable your Twilio phone number for WhatsApp"**
3. **Fill out business information**
4. **Wait for approval** (usually 1-3 business days)

## 🔧 Integration Code

### Updated Server with Twilio Integration
```javascript
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 10000;

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WhatsApp message sender
async function sendWhatsAppMessage(to, message, mediaUrl = null) {
  try {
    const messageOptions = {
      from: process.env.TWILIO_WHATSAPP_FROM, // whatsapp:+14155238886
      to: `whatsapp:${to}`,
      body: message
    };

    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    const result = await client.messages.create(messageOptions);
    
    console.log('✅ WhatsApp message sent:', {
      sid: result.sid,
      to: to,
      status: result.status
    });

    return { success: true, sid: result.sid, status: result.status };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', error.message);
    return { success: false, error: error.message };
  }
}

// Send daily update to parents
app.post('/api/send-daily-update', async (req, res) => {
  const { teacherMessage, className, parentNumbers } = req.body;

  try {
    const results = [];
    
    // Process teacher message (your existing logic)
    const processedMessage = `📚 Daily Update - ${className}

${teacherMessage}

---
🏫 ${process.env.SCHOOL_NAME || 'Your School Name'}
📱 Powered by School Communication System`;

    // Send to all parents
    for (const parentNumber of parentNumbers) {
      const result = await sendWhatsAppMessage(parentNumber, processedMessage);
      results.push({
        parentNumber,
        success: result.success,
        sid: result.sid,
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Daily updates sent',
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send announcement to all parents
app.post('/api/send-announcement', async (req, res) => {
  const { title, message, parentNumbers, priority = 'normal' } = req.body;

  try {
    const priorityEmoji = priority === 'urgent' ? '🚨' : '📢';
    
    const announcement = `${priorityEmoji} ${title}

${message}

---
🏫 ${process.env.SCHOOL_NAME || 'Your School Name'}
📅 ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}`;

    const results = [];
    
    for (const parentNumber of parentNumbers) {
      const result = await sendWhatsAppMessage(parentNumber, announcement);
      results.push({
        parentNumber,
        success: result.success,
        sid: result.sid
      });
    }

    res.json({
      success: true,
      message: 'Announcement sent',
      results,
      totalSent: results.filter(r => r.success).length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Twilio webhook for incoming messages
app.post('/webhook/twilio', (req, res) => {
  const { From, To, Body, MessageSid, ProfileName } = req.body;
  
  console.log('📨 Incoming WhatsApp message:', {
    from: From,
    to: To,
    body: Body,
    profileName: ProfileName,
    sid: MessageSid
  });

  // Process teacher message
  if (Body && From) {
    processTeacherMessage(From, Body);
  }

  // Respond to Twilio
  res.status(200).send('OK');
});

// Process teacher messages
async function processTeacherMessage(from, message) {
  try {
    console.log('👨‍🏫 Processing teacher message:', { from, message });
    
    // Your existing teacher message parsing logic here
    // For now, just acknowledge receipt
    
    const confirmationMessage = `✅ Message received and will be processed.

Your update: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"

Thank you for keeping parents informed! 🙏`;

    await sendWhatsAppMessage(from.replace('whatsapp:', ''), confirmationMessage);
    
  } catch (error) {
    console.error('❌ Error processing teacher message:', error.message);
  }
}

// Test endpoint
app.post('/api/test-whatsapp', async (req, res) => {
  const { phoneNumber, message } = req.body;
  
  if (!phoneNumber || !message) {
    return res.status(400).json({
      success: false,
      error: 'Phone number and message are required'
    });
  }

  const result = await sendWhatsAppMessage(phoneNumber, message);
  res.json(result);
});

// Your existing routes (health, admin, etc.)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    twilio: {
      configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || 'not configured'
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log('🚀 WhatsApp School Communication System with Twilio!');
  console.log(`📍 Server running on port ${port}`);
  console.log('📱 Twilio WhatsApp integration active');
  console.log(`🔧 Twilio configured: ${!!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)}`);
});
```

## 🔧 Environment Variables for Render

Add these to your Render environment variables:

```bash
# Existing WhatsApp variables
WA_ACCESS_TOKEN=your_existing_token
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=school_verify_2026

# New Twilio variables
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# School info
SCHOOL_NAME=Your School Name
NODE_ENV=production
```

## 📱 Updated package.json

```json
{
  "name": "school-comm-system",
  "version": "3.0.0",
  "description": "WhatsApp School Communication System with Twilio",
  "main": "twilio-server.js",
  "scripts": {
    "start": "node twilio-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^17.2.3",
    "twilio": "^4.19.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🧪 Testing Your Integration

### 1. Test Message Sending
```bash
curl -X POST https://your-app.onrender.com/api/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+977XXXXXXXXX",
    "message": "Hello from your school communication system! 📚"
  }'
```

### 2. Test Daily Update
```bash
curl -X POST https://your-app.onrender.com/api/send-daily-update \
  -H "Content-Type: application/json" \
  -d '{
    "teacherMessage": "Today we learned about fractions. Homework: Math page 45-47.",
    "className": "Grade 5A",
    "parentNumbers": ["+977XXXXXXXXX", "+977YYYYYYYYY"]
  }'
```

## 🎯 Production Deployment Steps

1. **Update GitHub** with Twilio integration code
2. **Add Twilio dependency** to package.json
3. **Set environment variables** in Render
4. **Deploy** and test
5. **Configure Twilio webhook** URL: `https://your-app.onrender.com/webhook/twilio`
6. **Test with real phone numbers**

## 💰 Pricing (Very Affordable)

### Twilio WhatsApp Pricing:
- **Sandbox**: Free for testing
- **Business Messages**: ~$0.005 per message (very cheap!)
- **Template Messages**: ~$0.0025 per message
- **For 1000 messages/month**: ~$5-10 total cost

### Perfect for Schools:
- ✅ **Very affordable** for school budgets
- ✅ **Pay per message** - no monthly fees
- ✅ **Scales with usage** - start small, grow as needed

## 🚀 Go Live Checklist

- [ ] Create Twilio account
- [ ] Test in sandbox
- [ ] Update code with Twilio integration
- [ ] Deploy to Render
- [ ] Set environment variables
- [ ] Test message sending
- [ ] Request WhatsApp Business approval
- [ ] Configure production webhook
- [ ] Train teachers on system
- [ ] Launch with pilot school

**Your WhatsApp School Communication System will be fully live with real messaging!** 🎉