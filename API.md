# API Documentation

## WhatsApp Message Formats

This document describes the message formats that teachers and admins can send via WhatsApp to interact with the system.

## Teacher Messages

### Daily Class Update

Teachers send structured messages to provide daily updates about their classes.

**Format:**
```
Class: <ClassName>
Subject: <SubjectName>
Topic: <TopicCovered>
Homework: <HomeworkDescription>
Understanding: <Good|Average|Weak>
```

**Example:**
```
Class: Grade 5A
Subject: Mathematics
Topic: Addition and Subtraction of 3-digit numbers
Homework: Complete exercises 1-10 on page 25. Practice multiplication tables 1-5.
Understanding: Good
```

**Response:** Parents in the specified class receive a formatted message in their preferred language.

### Attendance Marking

Teachers can mark attendance for their class by sending a comma-separated list of P (Present) and A (Absent).

**Format:**
```
Attendance: <P|A>,<P|A>,<P|A>,...
```

**Example:**
```
Attendance: P,P,A,P,P
```

**Notes:**
- The order should match the roll number order of students in the class
- Number of entries must match the number of students in the class
- Only one attendance record per day per class is allowed

**Response:** Confirmation message to teacher. Attendance data is stored for monthly summaries.

## Admin Messages

### School Announcements

School administrators can send announcements to all parents in the school.

**Format with Title:**
```
Announcement: <Title>
Message: <Content>
```

**Format without Title:**
```
Announcement: <Content>
```

**Example with Title:**
```
Announcement: School Holiday Notice
Message: Tomorrow is a public holiday due to Dashain festival. School will be closed. Regular classes will resume on Monday. Have a great holiday!
```

**Example without Title:**
```
Announcement: Parent-teacher meeting is scheduled for next Friday at 2 PM. Please confirm your attendance by replying to your class teacher.
```

**Response:** All parents in the school receive the announcement in their preferred language.

## System Responses

### Success Messages

**English:**
- ✅ Daily update for [Class] saved successfully. Messages will be sent to parents shortly.
- ✅ Attendance for [Class] saved successfully.
- ✅ Announcement sent successfully to all parents in the school.

**Nepali:**
- ✅ [Class] को लागि दैनिक अपडेट सफलतापूर्वक सुरक्षित गरियो। सन्देशहरू चाँडै अभिभावकहरूलाई पठाइनेछ।
- ✅ [Class] को उपस्थिति सफलतापूर्वक सुरक्षित गरियो।
- ✅ सूचना सफलतापूर्वक विद्यालयका सबै अभिभावकहरूलाई पठाइयो।

### Error Messages

**Teacher Not Found:**
- ❌ Error: Teacher not registered or WhatsApp number incorrect. Please contact school admin.
- ❌ त्रुटि: शिक्षक दर्ता भएको छैन वा व्हाट्सएप नम्बर गलत छ। कृपया विद्यालय प्रशासनसँग सम्पर्क गर्नुहोस्।

**Class Not Found:**
- ❌ Error: Class '[ClassName]' not found or you are not assigned to it. Please check your input or contact school admin.
- ❌ त्रुटि: कक्षा '[ClassName]' फेला परेन वा तपाईंलाई यो कक्षामा तोकिएको छैन।

**Unknown Message Format:**
- ❌ Error: Unknown message format. Please use the specified formats for daily updates, attendance, or announcements.

**Attendance Mismatch:**
- ❌ Error: Attendance record count does not match student count in class. Please ensure you mark P/A for all students.

## Parent Messages

Parents receive automated messages and do not need to send any structured messages to the system.

### Daily Update (Received by Parents)

**English Format:**
```
📚 Daily Update for [Class Name]

Subject: [Subject Name]
Topic Covered: [Topic]
📝 Homework: [Homework Description]
Understanding Level: [Good/Average/Weak]

Have a great day! 🌟
```

**Nepali Format:**
```
📚 [Class Name] को लागि दैनिक अपडेट

विषय: [Subject Name]
पढाइएको विषय: [Topic]
📝 गृहकार्य: [Homework Description]
बुझाइको स्तर: [Good/Average/Weak]

तपाईंको दिन शुभ रहोस्! 🌟
```

### Monthly Summary (Received by Parents)

**English Format:**
```
📊 Monthly Summary for [Student Name] - [Class Name]

📅 Attendance: [X]%
📖 Topics Covered: [Topic1, Topic2, Topic3...]
👩‍🏫 Teacher's Note: [Teacher's assessment]

Keep up the good work! 🎓

Best regards,
[School Name]
```

**Nepali Format:**
```
📊 [Student Name] - [Class Name] को मासिक सारांश

📅 उपस्थिति: [X]%
📖 पढाइएका विषयहरू: [Topic1, Topic2, Topic3...]
👩‍🏫 शिक्षकको टिप्पणी: [Teacher's assessment]

राम्रो काम जारी राख्नुहोस्! 🎓

शुभकामना सहित,
[School Name]
```

### Announcements (Received by Parents)

**English Format:**
```
📢 Announcement from [School Name]

📌 [Title] (if provided)

[Announcement Content]

For more details, contact the school office. 📞
```

**Nepali Format:**
```
📢 [School Name] बाट सूचना

📌 [Title] (if provided)

[Announcement Content]

थप जानकारीका लागि विद्यालय कार्यालयमा सम्पर्क गर्नुहोस्। 📞
```

## HTTP Endpoints

### Webhook Verification (GET)

**Endpoint:** `GET /webhook`

**Parameters:**
- `hub.mode`: "subscribe"
- `hub.verify_token`: Your verification token
- `hub.challenge`: Challenge string from Meta

**Response:** Returns the challenge string if verification is successful.

### Webhook Message Receiver (POST)

**Endpoint:** `POST /webhook`

**Headers:**
- `Content-Type: application/json`

**Body:** WhatsApp webhook payload from Meta

**Response:** `200 OK` for all valid requests

### Health Check (GET)

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Root Endpoint (GET)

**Endpoint:** `GET /`

**Response:** "School Communication System Backend is running!"

## Message Processing Flow

1. **Incoming Message**: WhatsApp sends message to webhook endpoint
2. **Validation**: System validates sender (teacher/admin) and message format
3. **Processing**: Message is parsed and stored in database
4. **Distribution**: Relevant recipients are identified and messages are sent
5. **Confirmation**: Sender receives confirmation of successful processing

## Rate Limits

- WhatsApp Cloud API has rate limits (typically 1000 messages per day for development)
- System implements basic validation to prevent duplicate attendance records
- Monthly summaries are generated automatically via cron job

## Error Handling

- All errors are logged with timestamps
- Users receive helpful error messages in their language
- System continues processing other messages even if one fails
- Database transactions ensure data consistency

## Security Features

- Webhook verification using Meta's verification token
- Sender validation against registered teachers/admins
- Input sanitization and validation
- Structured message parsing to prevent injection attacks
- Role-based access (teachers can only update their classes)

## Monitoring

- All message processing is logged
- Health check endpoint for uptime monitoring
- Database connection status monitoring
- WhatsApp API response monitoring