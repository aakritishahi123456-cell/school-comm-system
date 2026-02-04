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