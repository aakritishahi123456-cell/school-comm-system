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
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
      heap: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'
    }
  });
});

// WhatsApp webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification attempt:', { mode, token: token ? 'present' : 'missing', challenge: challenge ? 'present' : 'missing' });

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
                
                // Here you would process the teacher's message
                // For now, just log it
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

// API endpoints
app.get('/api/stats', (req, res) => {
  res.json({
    system: 'WhatsApp School Communication',
    status: 'operational',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    stats: {
      messagesProcessed: 0,
      webhooksReceived: 0,
      teachersActive: 0,
      parentsReached: 0
    }
  });
});

// Test message endpoint
app.post('/api/test-message', (req, res) => {
  const { phoneNumber, message } = req.body;
  
  console.log('📤 Test message request:', { phoneNumber, message });
  
  // Simulate message sending
  res.json({
    success: true,
    message: 'Test message would be sent',
    to: phoneNumber,
    content: message,
    timestamp: new Date().toISOString()
  });
});

// Admin dashboard (simple)
app.get('/admin', (req, res) => {
  res.json({
    dashboard: 'WhatsApp School Communication Admin',
    status: 'active',
    environment: process.env.NODE_ENV || 'development',
    configuration: {
      whatsappToken: process.env.WA_ACCESS_TOKEN ? 'configured' : 'missing',
      phoneNumberId: process.env.WA_PHONE_NUMBER_ID || 'not set',
      verifyToken: process.env.VERIFY_TOKEN ? 'configured' : 'missing',
      webhookUrl: process.env.WA_WEBHOOK_URL || 'not set'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling
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
      'GET /api/stats',
      'POST /api/test-message',
      'GET /admin'
    ],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log('🚀 WhatsApp School Communication System Started!');
  console.log(`📍 Server running on port ${port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`   Health: http://localhost:${port}/health`);
  console.log(`   Webhook: http://localhost:${port}/webhook`);
  console.log(`   API: http://localhost:${port}/api/stats`);
  console.log(`   Admin: http://localhost:${port}/admin`);
  console.log('');
  console.log('🔧 Configuration:');
  console.log(`   WhatsApp Token: ${process.env.WA_ACCESS_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Phone Number ID: ${process.env.WA_PHONE_NUMBER_ID || '❌ Missing'}`);
  console.log(`   Verify Token: ${process.env.VERIFY_TOKEN ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Webhook URL: ${process.env.WA_WEBHOOK_URL || '❌ Missing'}`);
  console.log('');
  console.log('✅ Ready to receive WhatsApp webhooks!');
});

module.exports = app;
