// Quick Twilio Setup Script
const fs = require('fs');
const path = require('path');

console.log('🚀 Twilio WhatsApp Setup for School Communication System\n');

console.log('📋 This script will help you set up Twilio WhatsApp integration.\n');

console.log('🎯 What you need from Twilio Console (https://console.twilio.com):');
console.log('   1. Account SID (starts with AC...)');
console.log('   2. Auth Token (your secret token)');
console.log('   3. WhatsApp From Number (whatsapp:+14155238886 for sandbox)');
console.log('');

console.log('📱 Steps to get these:');
console.log('   1. Sign up at https://www.twilio.com/try-twilio');
console.log('   2. Verify your phone number');
console.log('   3. Go to Console Dashboard');
console.log('   4. Copy Account SID and Auth Token');
console.log('   5. Go to Messaging → Try it out → Send a WhatsApp message');
console.log('   6. Follow sandbox setup instructions');
console.log('');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

console.log(`📄 Environment file status: ${envExists ? '✅ Found' : '❌ Not found'}`);

if (envExists) {
  console.log('');
  console.log('📝 Current .env file contents:');
  console.log('   ' + '='.repeat(50));
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        // Hide sensitive values
        const displayValue = key.includes('TOKEN') || key.includes('SECRET') 
          ? '***hidden***' 
          : value;
        console.log(`   ${key}=${displayValue}`);
      }
    }
  });
  
  console.log('   ' + '='.repeat(50));
}

console.log('');
console.log('🔧 To add Twilio credentials, add these lines to your .env file:');
console.log('');
console.log('# Twilio WhatsApp Configuration');
console.log('TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
console.log('TWILIO_AUTH_TOKEN=your_auth_token_here');
console.log('TWILIO_WHATSAPP_FROM=whatsapp:+14155238886');
console.log('');
console.log('# Test Configuration');
console.log('TEST_PARENT_NUMBER=+1555145399');
console.log('SCHOOL_NAME=Your School Name');
console.log('');

console.log('💡 For Render deployment, add these as Environment Variables:');
console.log('   1. Go to Render Dashboard');
console.log('   2. Select your service');
console.log('   3. Go to Environment tab');
console.log('   4. Add each variable');
console.log('   5. Deploy');
console.log('');

console.log('🧪 To test your setup:');
console.log('   npm run test-twilio');
console.log('   or');
console.log('   node test-twilio-integration.js');
console.log('');

console.log('🚀 To deploy with Twilio:');
console.log('   1. Update your GitHub repository');
console.log('   2. Add Twilio credentials to Render');
console.log('   3. Deploy');
console.log('   4. Test with real WhatsApp messages');
console.log('');

console.log('📚 Full guide: Read DEPLOY_WITH_TWILIO.md');
console.log('');

console.log('✅ Setup guide complete! Follow the steps above to get live.');

// Create a sample .env.twilio file
const sampleEnvContent = `# Twilio WhatsApp Configuration for School Communication System
# Copy these to your .env file and fill in your real values

# Existing WhatsApp API (keep these)
WA_ACCESS_TOKEN=EAAL2J1MsZBMoBQkllUzdstZAMkwpPw62NKPf3aoDzryS6xhgXCgH2W1bPQNSq7Xym6zE9GbUcCvCJkIHHuDtiGVhsZC6LRJV51d6V7efsPDSMGw8hmClkLz0KZBg2s3tHEfernJDUZCurOujdhkKZBPgzJtCg7Y8PdSGJGRxpQ9A6rHzEZBMFINWaEFKZC7vDZBwBjtG7piu6XamzXBCtyQmyjmgPzjD35PKbuHaoAWEqZAcTYk6HGHXTF4oG1OozFjceKhwlZBOePfy29fc7h1JuaZCjGcj
WA_PHONE_NUMBER_ID=992612663930736
VERIFY_TOKEN=school_verify_2026_nepal
WA_WEBHOOK_URL=https://school-comm-system.onrender.com/webhook

# Twilio WhatsApp API (add your credentials)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# School Configuration
SCHOOL_NAME=Nepal School Communication System
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,ne
NEPAL_TIMEZONE=Asia/Kathmandu

# Test Configuration
TEST_PARENT_NUMBER=+1555145399
TEST_TEACHER_NUMBER=+977XXXXXXXXX

# Environment
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Security
JWT_SECRET=development_jwt_secret

# Features
ENABLE_RATE_LIMITING=false
ENABLE_COMPRESSION=true
ENABLE_CACHING=false
LOG_LEVEL=debug
`;

fs.writeFileSync(path.join(__dirname, '.env.twilio'), sampleEnvContent);
console.log('📄 Created .env.twilio sample file for reference');
console.log('   Copy values from .env.twilio to your .env file');
console.log('');

console.log('🎉 Ready to integrate Twilio and go live!');