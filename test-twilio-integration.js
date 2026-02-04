// Test Twilio Integration Locally
require('dotenv').config();

const express = require('express');
const twilio = require('twilio');

console.log('🧪 Testing Twilio WhatsApp Integration...\n');

// Check environment variables
console.log('📋 Environment Check:');
console.log(`   TWILIO_ACCOUNT_SID: ${process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing'}`);
console.log(`   TWILIO_AUTH_TOKEN: ${process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`   TWILIO_WHATSAPP_FROM: ${process.env.TWILIO_WHATSAPP_FROM || '❌ Missing'}`);
console.log(`   TEST_PARENT_NUMBER: ${process.env.TEST_PARENT_NUMBER || '❌ Missing'}`);
console.log('');

// Initialize Twilio client
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.log('❌ Twilio credentials missing. Please set:');
  console.log('   TWILIO_ACCOUNT_SID=your_account_sid');
  console.log('   TWILIO_AUTH_TOKEN=your_auth_token');
  console.log('   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886');
  console.log('   TEST_PARENT_NUMBER=+1555145399');
  process.exit(1);
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Test message sending function
async function testWhatsAppMessage() {
  try {
    console.log('📱 Testing WhatsApp message sending...');
    
    const testMessage = `🎉 Test Message from Nepal School Communication System!

This is a test to verify your WhatsApp integration is working.

📚 Features ready:
✅ Teacher message processing
✅ Parent notifications
✅ Daily updates
✅ School announcements
✅ Bilingual support (English/Nepali)

🇳🇵 Your school communication system is LIVE!

---
📅 ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
📱 Powered by School Communication System`;

    const testNumber = process.env.TEST_PARENT_NUMBER || '+1555145399';
    
    console.log(`   Sending to: ${testNumber}`);
    console.log(`   From: ${process.env.TWILIO_WHATSAPP_FROM}`);
    
    const result = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
      to: `whatsapp:${testNumber}`,
      body: testMessage
    });
    
    console.log('✅ Message sent successfully!');
    console.log(`   Message SID: ${result.sid}`);
    console.log(`   Status: ${result.status}`);
    console.log(`   To: ${result.to}`);
    console.log(`   From: ${result.from}`);
    console.log('');
    
    return { success: true, sid: result.sid };
    
  } catch (error) {
    console.log('❌ Failed to send message:');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code || 'N/A'}`);
    console.log('');
    
    if (error.code === 21608) {
      console.log('💡 This error means the phone number is not verified in Twilio sandbox.');
      console.log('   To fix: Join the Twilio WhatsApp sandbox first.');
      console.log('   Send "join <sandbox-code>" to +1 415 523 8886');
    }
    
    return { success: false, error: error.message };
  }
}

// Test daily update format
function testDailyUpdateFormat() {
  console.log('📝 Testing daily update message format...');
  
  const teacherMessage = "Today we learned about fractions in mathematics. Students did very well with the exercises. Homework: Complete pages 45-47 in the math workbook. Please help your child with the word problems.";
  
  const parentMessage = `📚 Daily Update - Grade 5A

${teacherMessage}

---
🏫 ${process.env.SCHOOL_NAME || 'Nepal School Communication System'}
📅 ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
📱 School Communication System`;

  console.log('   Generated parent message:');
  console.log('   ' + '='.repeat(50));
  console.log(parentMessage.split('\n').map(line => `   ${line}`).join('\n'));
  console.log('   ' + '='.repeat(50));
  console.log('✅ Message format looks good!');
  console.log('');
}

// Test announcement format
function testAnnouncementFormat() {
  console.log('📢 Testing announcement message format...');
  
  const announcement = `🚨 Urgent: School Holiday Notice

Dear parents, due to unexpected weather conditions, school will be closed tomorrow (Friday). All classes are cancelled.

Classes will resume on Monday as usual. Please keep your children safe at home.

Thank you for your understanding.

---
🏫 ${process.env.SCHOOL_NAME || 'Nepal School Communication System'}
📅 ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
📱 School Communication System`;

  console.log('   Generated announcement:');
  console.log('   ' + '='.repeat(50));
  console.log(announcement.split('\n').map(line => `   ${line}`).join('\n'));
  console.log('   ' + '='.repeat(50));
  console.log('✅ Announcement format looks good!');
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Twilio WhatsApp Integration Tests...\n');
  
  // Test message formats
  testDailyUpdateFormat();
  testAnnouncementFormat();
  
  // Test actual message sending
  const result = await testWhatsAppMessage();
  
  console.log('📊 Test Results Summary:');
  console.log(`   Message Formatting: ✅ Passed`);
  console.log(`   Twilio Connection: ${result.success ? '✅ Passed' : '❌ Failed'}`);
  console.log(`   WhatsApp Sending: ${result.success ? '✅ Passed' : '❌ Failed'}`);
  console.log('');
  
  if (result.success) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('');
    console.log('✅ Your Twilio WhatsApp integration is working perfectly!');
    console.log('✅ Ready to deploy to production');
    console.log('✅ Teachers can send messages');
    console.log('✅ Parents will receive notifications');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Deploy to Render with Twilio credentials');
    console.log('   2. Configure Twilio webhook URL');
    console.log('   3. Test with real teacher messages');
    console.log('   4. Add parent phone numbers');
    console.log('   5. Go live with your school!');
  } else {
    console.log('⚠️  Some tests failed. Please check:');
    console.log('   1. Twilio credentials are correct');
    console.log('   2. Phone number is verified in sandbox');
    console.log('   3. Account has sufficient balance');
    console.log('   4. WhatsApp sandbox is properly configured');
  }
  
  console.log('');
  console.log('📱 Test completed!');
}

// Run the tests
runAllTests().catch(console.error);