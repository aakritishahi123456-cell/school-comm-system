// Enhanced WhatsApp School Communication System
// Complete server with message processing, database, and WhatsApp integration

require('dotenv').config();
const express = require('express');
const path = require('path');
const SimpleDatabase = require('./database-setup');
const MessageProcessor = require('./message-processor');
const WhatsAppSender = require('./whatsapp-sender');

const app = express();
const port = process.env.PORT || 10000;

// Initialize components
const database = new SimpleDatabase();
const whatsappSender = new WhatsAppSender();
const messageProcessor = new MessageProcessor(database, whatsappSender);

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files including HTML

// Log startup
console.log('🚀 Starting Enhanced WhatsApp School Communication System...');
console.log('📊 Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- PORT:', process.env.PORT || 'not set (using 10000)');
console.log('- VERIFY_TOKEN:', process.env.VERIFY_TOKEN ? '✅ Set' : '❌ Not set');
console.log('- WA_ACCESS_TOKEN:', process.env.WA_ACCESS_TOKEN ? '✅ Set' : '❌ Not set');
console.log('- WA_PHONE_NUMBER_ID:', process.env.WA_PHONE_NUMBER_ID ? '✅ Set' : '❌ Not set');

// Dashboard route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-dashboard.html'));
});

// Root endpoint - redirect to dashboard
app.get('/', (req, res) => {
  // Check if request accepts HTML (browser) or JSON (API)
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    res.redirect('/dashboard');
  } else {
    res.json({
      message: 'WhatsApp School Communication System for Nepal',
      status: 'running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: '2.0.0',
      features: [
        'WhatsApp Integration ✅',
        'Teacher Daily Updates ✅',
        'Parent Notifications ✅',
        'Admin Announcements ✅',
        'Bilingual Support (English/Nepali) ✅',
        'Message Processing ✅',
        'Database Storage ✅',
        'Test Dashboard ✅'
      ],
      whatsappStatus: whatsappSender.getStatus(),
      sampleData: {
        schools: database.schools.length,
        teachers: database.teachers.length,
        parents: database.parents.length,
        students: database.students.length,
        messages: database.messages.length
      },
      dashboardUrl: `${req.protocol}://${req.get('host')}/dashboard`
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    },
    nodeVersion: process.version,
    components: {
      database: 'ready',
      whatsappSender: whatsappSender.isConfigured() ? 'configured' : 'not configured',
      messageProcessor: 'ready'
    },
    environment: {
      verifyToken: process.env.VERIFY_TOKEN ? 'configured' : 'missing',
      whatsappToken: process.env.WA_ACCESS_TOKEN ? 'configured' : 'missing',
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID ? 'configured' : 'missing'
    }
  });
});

// Webhook verification endpoint (GET)
app.get('/webhook', (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('📞 Webhook verification attempt:', {
    mode: mode || 'missing',
    tokenProvided: token ? 'yes' : 'no',
    challengeProvided: challenge ? 'yes' : 'no'
  });

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ Webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      console.log('❌ Webhook verification failed: token mismatch');
      console.log('Expected:', verifyToken);
      console.log('Received:', token);
      res.sendStatus(403);
    }
  } else {
    console.log('❌ Webhook verification failed: missing parameters');
    res.sendStatus(400);
  }
});

// Enhanced webhook message receiver (POST)
app.post('/webhook', async (req, res) => {
  console.log('📨 Received webhook message:', JSON.stringify(req.body, null, 2));

  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry[0] && body.entry[0].changes && body.entry[0].changes[0]) {
        const change = body.entry[0].changes[0];

        if (change.value && change.value.messages && change.value.messages[0]) {
          const message = change.value.messages[0];
          const senderNumber = message.from;
          const messageText = message.text ? message.text.body : '';

          console.log('📱 Processing WhatsApp message:');
          console.log('- From:', senderNumber);
          console.log('- Text:', messageText);
          console.log('- Type:', message.type);

          // Process the message using our enhanced processor
          if (messageText && message.type === 'text') {
            const result = await messageProcessor.processIncomingMessage(senderNumber, messageText);
            console.log('✅ Message processing result:', result);
          } else {
            console.log('ℹ️ Skipping non-text message');
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
  }

  res.sendStatus(200);
});

// API endpoint to get recent messages
app.get('/api/messages', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const messages = database.getRecentMessages(limit);
  res.json({
    messages: messages,
    total: database.messages.length,
    timestamp: new Date().toISOString()
  });
});

// API endpoint to get system stats
app.get('/api/stats', (req, res) => {
  res.json({
    schools: database.schools.length,
    teachers: database.teachers.filter(t => t.role === 'teacher').length,
    admins: database.teachers.filter(t => t.role === 'admin').length,
    parents: database.parents.length,
    students: database.students.length,
    messages: database.messages.length,
    messagesByType: {
      daily_update: database.messages.filter(m => m.type === 'daily_update').length,
      attendance: database.messages.filter(m => m.type === 'attendance').length,
      announcement: database.messages.filter(m => m.type === 'announcement').length
    },
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for WhatsApp integration
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint for WhatsApp School Communication System',
    webhookUrl: `${req.protocol}://${req.get('host')}/webhook`,
    verifyUrl: `${req.protocol}://${req.get('host')}/webhook?hub.mode=subscribe&hub.verify_token=${process.env.VERIFY_TOKEN}&hub.challenge=test123`,
    healthUrl: `${req.protocol}://${req.get('host')}/health`,
    apiEndpoints: [
      'GET /api/messages - Recent messages',
      'GET /api/stats - System statistics'
    ],
    testInstructions: [
      '1. Configure webhook in Meta Developer Console',
      '2. Send test message from +1 555 145 3997',
      '3. Try these message formats:'
    ],
    messageFormats: {
      teacherUpdate: 'Class: Grade 5A\nSubject: Mathematics\nTopic: Addition\nHomework: Page 25\nUnderstanding: Good',
      attendance: 'Attendance: P,A,P',
      announcement: 'Announcement: Holiday\nMessage: School closed tomorrow'
    }
  });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /webhook',
      'POST /webhook',
      'GET /test',
      'GET /api/messages',
      'GET /api/stats'
    ]
  });
});

// Start server
if (require.main === module) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log('🎉 Enhanced Server started successfully!');
    console.log(`📡 Server running on port ${port}`);
    console.log(`🌐 Access your app at: http://localhost:${port}`);
    console.log('📋 Available endpoints:');
    console.log('  - GET  /        - System info');
    console.log('  - GET  /health  - Health check');
    console.log('  - GET  /webhook - Webhook verification');
    console.log('  - POST /webhook - Receive messages');
    console.log('  - GET  /test    - Test information');
    console.log('  - GET  /api/messages - Recent messages');
    console.log('  - GET  /api/stats - System statistics');
    console.log('');
    console.log('🔗 Ready for WhatsApp integration!');
    console.log(`📱 Test number: ${process.env.TEST_WHATSAPP_NUMBER || '+1 555 145 3997'}`);
    console.log('🎯 Send messages in the specified formats to test');
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    console.log(`\n📴 Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

// Export app for testing
module.exports = app;
