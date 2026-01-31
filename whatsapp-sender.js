// WhatsApp message sender using Meta Cloud API

class WhatsAppSender {
  constructor() {
    this.accessToken = process.env.WA_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
    this.apiVersion = 'v19.0';
    this.apiUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  // Send a text message
  async sendMessage(recipientNumber, messageText) {
    if (!this.accessToken || !this.phoneNumberId) {
      console.error('❌ WhatsApp API credentials not configured');
      return false;
    }

    try {
      console.log(`📤 Sending message to ${recipientNumber}: ${messageText.substring(0, 50)}...`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipientNumber,
          type: 'text',
          text: {
            body: messageText
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Message sent successfully:', result.messages?.[0]?.id);
        return true;
      } else {
        console.error('❌ Failed to send message:', result);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp message:', error);
      return false;
    }
  }

  // Send message with retry logic
  async sendMessageWithRetry(recipientNumber, messageText, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const success = await this.sendMessage(recipientNumber, messageText);
      if (success) {
        return true;
      }

      if (attempt < maxRetries) {
        console.log(`🔄 Retry ${attempt}/${maxRetries} for ${recipientNumber}`);
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }

    console.error(`❌ Failed to send message after ${maxRetries} attempts`);
    return false;
  }

  // Utility: delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if credentials are configured
  isConfigured() {
    return !!(this.accessToken && this.phoneNumberId);
  }

  // Get configuration status
  getStatus() {
    return {
      configured: this.isConfigured(),
      accessToken: this.accessToken ? 'Set' : 'Missing',
      phoneNumberId: this.phoneNumberId ? 'Set' : 'Missing',
      apiUrl: this.apiUrl
    };
  }
}

module.exports = WhatsAppSender;
