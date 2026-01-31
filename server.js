// Simple server.js for Render auto-detection
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp School Communication System',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification attempt:', { mode, token: token ? 'provided' : 'missing' });

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully!');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed: token mismatch');
      res.sendStatus(403);
    }
  } else {
    console.log('Webhook verification failed: missing parameters');
    res.sendStatus(400);
  }
});

// Basic webhook receiver (for testing)
app.post('/webhook', (req, res) => {
  console.log('Received webhook:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Error handling
app.use((err, req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 Health check: http://localhost:${port}/health`);
  console.log(`🔗 Webhook: http://localhost:${port}/webhook`);
  console.log('Environment variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', process.env.PORT);
  console.log('- VERIFY_TOKEN:', process.env.VERIFY_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('- WA_ACCESS_TOKEN:', process.env.WA_ACCESS_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('- WA_PHONE_NUMBER_ID:', process.env.WA_PHONE_NUMBER_ID ? '✅ Set' : '❌ Not set');
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
