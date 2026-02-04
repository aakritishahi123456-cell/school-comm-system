// WhatsApp School Communication System with Twilio Integration
console.log('🚀 Starting Twilio Server - Fix Version 2.0 (Optional Credentials)');
require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 10000;

// Initialize Twilio client only if credentials are provided
const twilioConfigured = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
const client = twilioConfigured
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

if (!twilioConfigured) {
  console.warn('⚠️  Twilio credentials not configured. WhatsApp messaging will be disabled.');
  console.warn('   Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to enable messaging.');
} else {
  console.log('✅ Twilio client initialized successfully');
}

// Middleware
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

// ===== WHATSAPP MESSAGE SENDER =====
async function sendWhatsAppMessage(to, message, mediaUrl = null) {
  try {
    // Check if Twilio is configured
    if (!twilioConfigured || !client) {
      console.warn('⚠️  Cannot send message: Twilio not configured');
      return {
        success: false,
        error: 'Twilio credentials not configured',
        to: to,
        needsConfiguration: true
      };
    }

    // Ensure phone number has country code
    const phoneNumber = to.startsWith('+') ? to : `+977${to}`;

    const messageOptions = {
      from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
      to: `whatsapp:${phoneNumber}`,
      body: message
    };

    if (mediaUrl) {
      messageOptions.mediaUrl = [mediaUrl];
    }

    const result = await client.messages.create(messageOptions);

    console.log('✅ WhatsApp message sent:', {
      sid: result.sid,
      to: phoneNumber,
      status: result.status,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      sid: result.sid,
      status: result.status,
      to: phoneNumber
    };
  } catch (error) {
    console.error('❌ Failed to send WhatsApp message:', {
      error: error.message,
      to: to,
      timestamp: new Date().toISOString()
    });
    return {
      success: false,
      error: error.message,
      to: to
    };
  }
}

// ===== TEACHER MESSAGE PROCESSING =====
function processTeacherMessage(message) {
  // Simple message processing - can be enhanced later
  const processed = {
    originalMessage: message,
    className: 'General',
    subject: 'Daily Update',
    content: message,
    timestamp: new Date().toISOString(),
    teacherFriendly: true
  };

  // Extract class name if mentioned
  const classMatch = message.match(/(?:class|grade)\s*(\w+)/i);
  if (classMatch) {
    processed.className = `Grade ${classMatch[1]}`;
  }

  // Extract subject if mentioned
  const subjectMatch = message.match(/(?:subject|topic):\s*([^.]+)/i);
  if (subjectMatch) {
    processed.subject = subjectMatch[1].trim();
  }

  return processed;
}

// ===== PARENT MESSAGE TEMPLATES =====
function createParentMessage(teacherMessage, className = 'General') {
  const processed = processTeacherMessage(teacherMessage);

  const parentMessage = `📚 Daily Update - ${processed.className}

${processed.content}

---
🏫 ${process.env.SCHOOL_NAME || 'Your School Name'}
📅 ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
📱 School Communication System`;

  return parentMessage;
}

function createAnnouncementMessage(title, content, priority = 'normal') {
  const priorityEmoji = priority === 'urgent' ? '🚨' : '📢';

  return `${priorityEmoji} ${title}

${content}

---
🏫 ${process.env.SCHOOL_NAME || 'Your School Name'}
📅 ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}
📱 School Communication System`;
}

// ===== ROUTES =====

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'WhatsApp School Communication System with Twilio',
    version: '3.1.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    features: {
      whatsappWebhook: true,
      twilioIntegration: true,
      realMessaging: true,
      teacherProcessing: true,
      parentNotifications: true,
      healthCheck: true
    },
    twilio: {
      configured: twilioConfigured,
      whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '3.1.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
      heap: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
    },
    twilio: {
      configured: twilioConfigured,
      ready: twilioConfigured && !!(process.env.TWILIO_WHATSAPP_FROM)
    }
  });
});

// WhatsApp webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification attempt:', {
    mode,
    token: token ? 'present' : 'missing',
    challenge: challenge ? 'present' : 'missing'
  });

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid verify token',
      expected: process.env.VERIFY_TOKEN ? 'Token configured' : 'No token configured'
    });
  }
});

// WhatsApp webhook receiver (POST) - Meta/Facebook webhook
app.post('/webhook', (req, res) => {
  console.log('📨 Meta WhatsApp webhook received:', JSON.stringify(req.body, null, 2));

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
                console.log('📱 Processing teacher message:', {
                  from: message.from,
                  type: message.type,
                  text: message.text ? message.text.body : 'N/A'
                });

                // Process teacher message and send to parents
                if (message.text && message.text.body) {
                  processAndForwardMessage(message.from, message.text.body);
                }
              });
            }
          });
        }
      });
    }
  } catch (error) {
    console.error('❌ Error processing Meta webhook:', error.message);
  }
});

// Twilio webhook for incoming messages
app.post('/webhook/twilio', (req, res) => {
  const { From, To, Body, MessageSid, ProfileName } = req.body;

  console.log('📨 Twilio WhatsApp message received:', {
    from: From,
    to: To,
    body: Body,
    profileName: ProfileName,
    sid: MessageSid,
    timestamp: new Date().toISOString()
  });

  // Process teacher message
  if (Body && From) {
    processAndForwardMessage(From.replace('whatsapp:', ''), Body);
  }

  // Respond to Twilio
  res.status(200).send('OK');
});

// ===== MESSAGE PROCESSING =====
async function processAndForwardMessage(teacherPhone, message) {
  try {
    console.log('👨‍🏫 Processing teacher message from:', teacherPhone);

    // Process the message
    const processed = processTeacherMessage(message);
    console.log('📝 Processed message:', processed);

    // Create parent-friendly message
    const parentMessage = createParentMessage(message, processed.className);

    // Send confirmation to teacher
    const confirmationMessage = `✅ Message received and processed!

Your update: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"

Class: ${processed.className}
Status: Ready to send to parents

Thank you for keeping parents informed! 🙏

---
📱 School Communication System`;

    await sendWhatsAppMessage(teacherPhone, confirmationMessage);

    // Here you would normally send to parent numbers
    // For now, we'll just log what would be sent
    console.log('📤 Would send to parents:', parentMessage);

    // Test: Send to a test parent number if configured
    if (process.env.TEST_PARENT_NUMBER) {
      console.log('📱 Sending test message to parent...');
      await sendWhatsAppMessage(process.env.TEST_PARENT_NUMBER, parentMessage);
    }

  } catch (error) {
    console.error('❌ Error processing teacher message:', error.message);
  }
}

// ===== API ENDPOINTS =====

// Send daily update to parents
app.post('/api/send-daily-update', async (req, res) => {
  const { teacherMessage, className, parentNumbers } = req.body;

  if (!teacherMessage || !parentNumbers || !Array.isArray(parentNumbers)) {
    return res.status(400).json({
      success: false,
      error: 'teacherMessage and parentNumbers array are required'
    });
  }

  try {
    const results = [];
    const parentMessage = createParentMessage(teacherMessage, className);

    console.log(`📤 Sending daily update to ${parentNumbers.length} parents`);

    // Send to all parents
    for (const parentNumber of parentNumbers) {
      const result = await sendWhatsAppMessage(parentNumber, parentMessage);
      results.push({
        parentNumber,
        success: result.success,
        sid: result.sid,
        error: result.error
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: 'Daily updates sent',
      results,
      summary: {
        totalSent: successCount,
        totalFailed: failCount,
        totalParents: parentNumbers.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending daily update:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Send announcement to all parents
app.post('/api/send-announcement', async (req, res) => {
  const { title, message, parentNumbers, priority = 'normal' } = req.body;

  if (!title || !message || !parentNumbers || !Array.isArray(parentNumbers)) {
    return res.status(400).json({
      success: false,
      error: 'title, message, and parentNumbers array are required'
    });
  }

  try {
    const announcement = createAnnouncementMessage(title, message, priority);
    const results = [];

    console.log(`📢 Sending ${priority} announcement to ${parentNumbers.length} parents`);

    for (const parentNumber of parentNumbers) {
      const result = await sendWhatsAppMessage(parentNumber, announcement);
      results.push({
        parentNumber,
        success: result.success,
        sid: result.sid
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      message: 'Announcement sent',
      results,
      summary: {
        totalSent: successCount,
        totalParents: parentNumbers.length,
        priority
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending announcement:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test WhatsApp message
app.post('/api/test-whatsapp', async (req, res) => {
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({
      success: false,
      error: 'phoneNumber and message are required'
    });
  }

  console.log('🧪 Testing WhatsApp message:', { phoneNumber, message });

  const result = await sendWhatsAppMessage(phoneNumber, message);

  res.json({
    ...result,
    timestamp: new Date().toISOString(),
    testMode: true
  });
});

// API stats
app.get('/api/stats', (req, res) => {
  res.json({
    system: 'WhatsApp School Communication with Twilio',
    status: 'operational',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '3.1.0',
    features: {
      twilioIntegration: twilioConfigured,
      whatsappMessaging: true,
      teacherProcessing: true,
      parentNotifications: true
    },
    stats: {
      messagesProcessed: 0,
      webhooksReceived: 0,
      teachersActive: 0,
      parentsReached: 0,
      uptime: Math.floor(process.uptime())
    }
  });
});

// Admin dashboard
app.get('/admin', (req, res) => {
  res.json({
    dashboard: 'WhatsApp School Communication Admin',
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    version: '3.1.0',
    configuration: {
      // Meta WhatsApp API
      metaWhatsappToken: process.env.WA_ACCESS_TOKEN ? 'configured' : 'missing',
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID || 'not set',
      verifyToken: process.env.VERIFY_TOKEN ? 'configured' : 'missing',
      webhookUrl: process.env.WA_WEBHOOK_URL || 'not set',

      // Twilio WhatsApp API
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ? 'configured' : 'missing',
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ? 'configured' : 'missing',
      twilioWhatsappFrom: process.env.TWILIO_WHATSAPP_FROM || 'not set',
      twilioStatus: twilioConfigured ? 'ready' : 'not configured',

      // School settings
      schoolName: process.env.SCHOOL_NAME || 'not set',
      testParentNumber: process.env.TEST_PARENT_NUMBER || 'not set'
    },
    timestamp: new Date().toISOString()
  });
});

// ===== ERROR HANDLING =====

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /webhook',
      'POST /webhook',
      'POST /webhook/twilio',
      'GET /api/stats',
      'POST /api/test-whatsapp',
      'POST /api/send-daily-update',
      'POST /api/send-announcement',
      'GET /admin'
    ],
    timestamp: new Date().toISOString()
  });
});

// ===== START SERVER =====
app.listen(port, '0.0.0.0', () => {
  console.log('🚀 WhatsApp School Communication System with Twilio Started!');
  console.log(`📍 Server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`   Main: http://localhost:${port}/`);
  console.log(`   Health: http://localhost:${port}/health`);
  console.log(`   Webhook (Meta): http://localhost:${port}/webhook`);
  console.log(`   Webhook (Twilio): http://localhost:${port}/webhook/twilio`);
  console.log(`   Test Message: POST http://localhost:${port}/api/test-whatsapp`);
  console.log(`   Daily Update: POST http://localhost:${port}/api/send-daily-update`);
  console.log(`   Announcement: POST http://localhost:${port}/api/send-announcement`);
  console.log(`   Admin: http://localhost:${port}/admin`);
  console.log('');
  console.log('🔧 Configuration Status:');
  console.log(`   Meta WhatsApp Token: ${process.env.WA_ACCESS_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Phone Number ID: ${process.env.WA_PHONE_NUMBER_ID || '❌ Missing'}`);
  console.log(`   Verify Token: ${process.env.VERIFY_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Twilio Account SID: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Twilio Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Twilio WhatsApp From: ${process.env.TWILIO_WHATSAPP_FROM || '❌ Missing'}`);
  console.log(`   School Name: ${process.env.SCHOOL_NAME || '❌ Missing'}`);
  console.log('');

  if (twilioConfigured) {
    console.log('✅ Twilio WhatsApp integration READY!');
    console.log('📱 System can send real WhatsApp messages');
  } else {
    console.log('⚠️  Twilio not configured - add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
    console.log('📱 System will work for webhooks but cannot send messages');
  }

  console.log('');
  console.log('🎯 Ready for:');
  console.log('   📨 Receiving teacher messages via WhatsApp webhook');
  console.log('   📤 Sending messages to parents via Twilio');
  console.log('   🔄 Processing and forwarding daily updates');
  console.log('   📢 Broadcasting announcements');
  console.log('   🏥 Health monitoring and admin dashboard');
  console.log('');
  console.log('🚀 Your WhatsApp School Communication System is LIVE!');
});

module.exports = app;