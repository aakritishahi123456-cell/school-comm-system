// Main entry point for Render deployment
// This file is expected by Render's auto-detection

const path = require('path');
const fs = require('fs');

// Check if compiled version exists
const compiledPath = path.join(__dirname, 'dist', 'src', 'index.js');
const startPath = path.join(__dirname, 'start.js');

if (fs.existsSync(compiledPath)) {
  console.log('Starting compiled application...');
  require(compiledPath);
} else if (fs.existsSync(startPath)) {
  console.log('Starting via start.js...');
  require(startPath);
} else {
  console.error('No compiled application found. Make sure to run "npm run build" first.');
  process.exit(1);
}