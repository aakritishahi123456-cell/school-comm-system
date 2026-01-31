// Production start script
// const path = require('path'); // Not used currently

// Set NODE_ENV if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Start the compiled application
require('./dist/src/index.js');
