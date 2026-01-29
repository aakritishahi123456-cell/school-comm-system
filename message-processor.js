// Message processing for WhatsApp school communication
// Handles teacher updates, admin announcements, and parent notifications

class MessageProcessor {
  constructor(database, whatsappSender) {
    this.db = database;
    this.whatsapp = whatsappSender;
  }

  // Parse incoming message
  parseMessage(messageText) {
    // Teacher daily update format
    const dailyUpdateRegex = /Class:\s*(.+)\nSubject:\s*(.+)\nTopic:\s*(.+)\nHomework:\s*(.+)\nUnderstanding:\s*(Good|Average|Weak)/i;
    const dailyUpdateMatch = messageText.match(dailyUpdateRegex);

    if (dailyUpdateMatch) {
      return {
        type: 'DAILY_UPDATE',
        className: dailyUpdateMatch[1].trim(),
        subject: dailyUpdateMatch[2].trim(),
        topic: dailyUpdateMatch[3].trim(),
        homework: dailyUpdateMatch[4].trim(),
        understanding: dailyUpdateMatch[5].trim()
      };
    }

    // Attendance format
    const attendanceRegex = /Attendance:\s*([P,A,\s]+)/i;
    const attendanceMatch = messageText.match(attendanceRegex);

    if (attendanceMatch) {
      const records = attendanceMatch[1].split(',').map(s => s.trim().toUpperCase());
      if (records.every(r => ['P', 'A'].includes(r))) {
        return {
          type: 'ATTENDANCE',
          records: records
        };
      }
    }

    // Admin announcement format
    const announcementRegex = /Announcement:\s*(.+?)(?:\nMessage:\s*(.+))?$/is;
    const announcementMatch = messageText.match(announcementRegex);

    if (announcementMatch) {
      return {
        type: 'ANNOUNCEMENT',
        title: announcementMatch[1].trim(),
        content: announcementMatch[2] ? announcementMatch[2].trim() : announcementMatch[1].trim()
      };
    }

    return { type: 'UNKNOWN', text: messageText };
  }

  // Process incoming WhatsApp message
  async processIncomingMessage(senderNumber, messageText) {
    console.log(`📨 Processing message from ${senderNumber}: ${messageText}`);

    const parsedMessage = this.parseMessage(messageText);
    console.log('📋 Parsed message:', parsedMessage);

    try {
      switch (parsedMessage.type) {
        case 'DAILY_UPDATE':
          return await this.handleDailyUpdate(senderNumber, parsedMessage);
        
        case 'ATTENDANCE':
          return await this.handleAttendance(senderNumber, parsedMessage);
        
        case 'ANNOUNCEMENT':
          return await this.handleAnnouncement(senderNumber, parsedMessage);
        
        default:
          return await this.handleUnknownMessage(senderNumber, messageText);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      await this.whatsapp.sendMessage(senderNumber, 
        '❌ Sorry, there was an error processing your message. Please try again or contact support.');
      return { success: false, error: error.message };
    }
  }

  // Handle teacher daily update
  async handleDailyUpdate(senderNumber, parsedMessage) {
    // Validate teacher
    const teacher = this.db.findTeacherByPhone(senderNumber);
    if (!teacher) {
      await this.whatsapp.sendMessage(senderNumber, 
        '❌ Error: Teacher not registered. Please contact school admin.');
      return { success: false, error: 'Teacher not found' };
    }

    // Validate class
    if (teacher.className !== parsedMessage.className) {
      await this.whatsapp.sendMessage(senderNumber, 
        `❌ Error: You are not assigned to class "${parsedMessage.className}". Your class is "${teacher.className}".`);
      return { success: false, error: 'Class mismatch' };
    }

    // Save message
    const savedMessage = this.db.saveMessage({
      type: 'daily_update',
      senderId: teacher.id,
      senderType: 'teacher',
      className: parsedMessage.className,
      content: parsedMessage,
      originalText: `Class: ${parsedMessage.className}\nSubject: ${parsedMessage.subject}\nTopic: ${parsedMessage.topic}\nHomework: ${parsedMessage.homework}\nUnderstanding: ${parsedMessage.understanding}`
    });

    // Send confirmation to teacher
    await this.whatsapp.sendMessage(senderNumber, 
      `✅ Daily update for ${parsedMessage.className} saved successfully. Messages will be sent to parents shortly.`);

    // Send to parents
    const parents = this.db.findParentsByClass(parsedMessage.className);
    console.log(`📤 Sending to ${parents.length} parents`);

    for (const parent of parents) {
      const parentMessage = this.formatDailyUpdateForParent(parsedMessage, parent.preferredLanguage);
      await this.whatsapp.sendMessage(parent.whatsappNumber, parentMessage);
    }

    return { success: true, messageId: savedMessage.id, parentsSent: parents.length };
  }

  // Handle attendance
  async handleAttendance(senderNumber, parsedMessage) {
    const teacher = this.db.findTeacherByPhone(senderNumber);
    if (!teacher) {
      await this.whatsapp.sendMessage(senderNumber, 
        '❌ Error: Teacher not registered. Please contact school admin.');
      return { success: false, error: 'Teacher not found' };
    }

    // Save attendance
    const savedMessage = this.db.saveMessage({
      type: 'attendance',
      senderId: teacher.id,
      senderType: 'teacher',
      className: teacher.className,
      content: parsedMessage,
      originalText: `Attendance: ${parsedMessage.records.join(',')}`
    });

    await this.whatsapp.sendMessage(senderNumber, 
      `✅ Attendance for ${teacher.className} saved successfully.`);

    return { success: true, messageId: savedMessage.id };
  }

  // Handle admin announcement
  async handleAnnouncement(senderNumber, parsedMessage) {
    const admin = this.db.findAdminByPhone(senderNumber);
    if (!admin) {
      await this.whatsapp.sendMessage(senderNumber, 
        '❌ Error: Admin not registered. Please contact system administrator.');
      return { success: false, error: 'Admin not found' };
    }

    // Save announcement
    const savedMessage = this.db.saveMessage({
      type: 'announcement',
      senderId: admin.id,
      senderType: 'admin',
      schoolId: admin.schoolId,
      content: parsedMessage,
      originalText: `Announcement: ${parsedMessage.title}\nMessage: ${parsedMessage.content}`
    });

    // Send confirmation to admin
    await this.whatsapp.sendMessage(senderNumber, 
      '✅ Announcement sent successfully to all parents in the school.');

    // Send to all parents
    const parents = this.db.findAllParents(admin.schoolId);
    console.log(`📤 Sending announcement to ${parents.length} parents`);

    for (const parent of parents) {
      const parentMessage = this.formatAnnouncementForParent(parsedMessage, parent.preferredLanguage);
      await this.whatsapp.sendMessage(parent.whatsappNumber, parentMessage);
    }

    return { success: true, messageId: savedMessage.id, parentsSent: parents.length };
  }

  // Handle unknown message
  async handleUnknownMessage(senderNumber, messageText) {
    const helpMessage = `❌ Unknown message format. Please use one of these formats:

📚 Daily Update:
Class: Grade 5A
Subject: Mathematics
Topic: Addition and Subtraction
Homework: Complete exercises 1-10
Understanding: Good

📅 Attendance:
Attendance: P,P,A,P,P

📢 Announcement (Admin only):
Announcement: School Holiday
Message: Tomorrow is a public holiday.`;

    await this.whatsapp.sendMessage(senderNumber, helpMessage);
    return { success: false, error: 'Unknown message format' };
  }

  // Format daily update for parent
  formatDailyUpdateForParent(update, language = 'en') {
    if (language === 'ne') {
      return `📚 ${update.className} को लागि दैनिक अपडेट

विषय: ${update.subject}
पढाइएको विषय: ${update.topic}
📝 गृहकार्य: ${update.homework}
बुझाइको स्तर: ${update.understanding}

तपाईंको दिन शुभ रहोस्! 🌟`;
    } else {
      return `📚 Daily Update for ${update.className}

Subject: ${update.subject}
Topic Covered: ${update.topic}
📝 Homework: ${update.homework}
Understanding Level: ${update.understanding}

Have a great day! 🌟`;
    }
  }

  // Format announcement for parent
  formatAnnouncementForParent(announcement, language = 'en') {
    if (language === 'ne') {
      return `📢 विद्यालयबाट सूचना

📌 ${announcement.title}

${announcement.content}

थप जानकारीका लागि विद्यालय कार्यालयमा सम्पर्क गर्नुहोस्। 📞`;
    } else {
      return `📢 School Announcement

📌 ${announcement.title}

${announcement.content}

For more details, contact the school office. 📞`;
    }
  }
}

module.exports = MessageProcessor;