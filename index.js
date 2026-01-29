// Standalone server for Render deployment
// This file runs directly without compilation

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(express.json());

// Log startup
console.log('🚀 Starting WhatsApp School Communication System...');
console.log('📊 Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- PORT:', process.env.PORT || 'not set (using 10000)');
console.log('- VERIFY_TOKEN:', process.env.VERIFY_TOKEN ? '✅ Set' : '❌ Not set');
console.log('- WA_ACCESS_TOKEN:', process.env.WA_ACCESS_TOKEN ? '✅ Set' : '❌ Not set');
console.log('- WA_PHONE_NUMBER_ID:', process.env.WA_PHONE_NUMBER_ID ? '✅ Set' : '❌ Not set');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp School Communication System for Nepal',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    features: [
      'WhatsApp Integration',
      'Teacher Daily Updates',
      'Parent Notifications',
      'Admin Announcements',
      'Bilingual Support (English/Nepali)'
    ]
  });
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
    environment: {
      verifyToken: process.env.VERIFY_TOKEN ? 'configured' : 'missing',
      whatsappToken: process.env.WA_ACCESS_TOKEN ? 'configured' : 'missing',
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID ? 'configured' : 'missing',
      database: process.env.DATABASE_URL ? 'configured' : 'missing'
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

// Webhook message receiver (POST)
app.post('/webhook', (req, res) => {
  console.log('📨 Received webhook message:', JSON.stringify(req.body, null, 2));
  
  // Basic message processing (placeholder)
  try {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry[0] && body.entry[0].changes && body.entry[0].changes[0]) {
        const change = body.entry[0].changes[0];
        
        if (change.value && change.value.messages && change.value.messages[0]) {
          const message = change.value.messages[0];
          const senderNumber = message.from;
          const messageText = message.text ? message.text.body : '';
          
          console.log('📱 Message details:');
          console.log('- From:', senderNumber);
          console.log('- Text:', messageText);
          console.log('- Type:', message.type);
          
          // TODO: Add message parsing and response logic here
          console.log('✅ Message processed successfully');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
  }
  
  res.sendStatus(200);
});

// Test endpoint for WhatsApp integration
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint for WhatsApp School Communication System',
    webhookUrl: `${req.protocol}://${req.get('host')}/webhook`,
    verifyUrl: `${req.protocol}://${req.get('host')}/webhook?hub.mode=subscribe&hub.verify_token=${process.env.VERIFY_TOKEN}&hub.challenge=test123`,
    healthUrl: `${req.protocol}://${req.get('host')}/health`,
    instructions: [
      '1. Use the webhookUrl in your Meta Developer Console',
      '2. Use your VERIFY_TOKEN for webhook verification',
      '3. Test webhook verification with the verifyUrl',
      '4. Monitor health with the healthUrl'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
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
      'GET /test'
    ]
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log('🎉 Server started successfully!');
  console.log(`📡 Server running on port ${port}`);
  console.log(`🌐 Access your app at: http://localhost:${port}`);
  console.log('📋 Available endpoints:');
  console.log('  - GET  /        - Main info');
  console.log('  - GET  /health  - Health check');
  console.log('  - GET  /webhook - Webhook verification');
  console.log('  - POST /webhook - Receive messages');
  console.log('  - GET  /test    - Test information');
  console.log('');
  console.log('🔗 Next steps:');
  console.log('1. Configure webhook in Meta Developer Console');
  console.log('2. Test webhook verification');
  console.log('3. Send test WhatsApp messages');
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