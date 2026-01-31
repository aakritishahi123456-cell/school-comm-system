// Simple test server to verify deployment fixes
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Test routes
app.get('/', (req, res) => {
  res.json({
    message: 'School Communication System - Deployment Test',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: '3.0.0'
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    
    res.json({
      database: 'connected',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test webhook endpoint
app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ error: 'Invalid verify token' });
  }
});

app.post('/webhook', (req, res) => {
  res.status(200).json({ 
    received: true, 
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${port}`);
  console.log(`📋 Health check: http://localhost:${port}/health`);
  console.log(`🔗 Webhook: http://localhost:${port}/webhook`);
  console.log(`🗄️ Database test: http://localhost:${port}/test-db`);
});

module.exports = app;