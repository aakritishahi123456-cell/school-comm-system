// Simple test server to verify Render deployment works
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'WhatsApp School Communication System is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log('Environment variables check:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- PORT:', process.env.PORT);
  console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('- VERIFY_TOKEN:', process.env.VERIFY_TOKEN ? 'Set' : 'Not set');
});
