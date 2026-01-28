# Testing Guide

This guide covers how to test the WhatsApp School Communication System.

## Prerequisites

1. **Deployed Application** with webhook URL
2. **Meta WhatsApp Cloud API** configured
3. **Test WhatsApp Numbers** (can use your own numbers)
4. **Database** with pilot data loaded

## Setup Test Environment

### 1. Load Pilot Data

Run the setup script to create test data:

```bash
npm run setup
```

This creates:
- 1 School (Kathmandu Public School)
- 1 Admin
- 5 Teachers
- 5 Classes
- 10 Parents (5 English, 5 Nepali preference)
- 10 Students

### 2. Configure Test Numbers

The setup script creates test data with placeholder WhatsApp numbers. You'll need to update these with real numbers for testing:

**Option A: Update Database Directly**
```sql
-- Update admin number
UPDATE "SchoolAdmin" SET "whatsappNumber" = '+977XXXXXXXXXX' WHERE "firstName" = 'Rajesh';

-- Update teacher numbers
UPDATE "Teacher" SET "whatsappNumber" = '+977XXXXXXXXXX' WHERE "firstName" = 'Ram';
UPDATE "Teacher" SET "whatsappNumber" = '+977XXXXXXXXXX' WHERE "firstName" = 'Sita';

-- Update parent numbers
UPDATE "Parent" SET "whatsappNumber" = '+977XXXXXXXXXX' WHERE "firstName" = 'John';
UPDATE "Parent" SET "whatsappNumber" = '+977XXXXXXXXXX' WHERE "firstName" = 'रमेश';
```

**Option B: Create New Test Script**
```typescript
// scripts/update-test-numbers.ts
import prisma from '../src/utils/db';

async function updateTestNumbers() {
  // Update with your actual test numbers
  const testNumbers = {
    admin: '+977XXXXXXXXXX',
    teachers: ['+977XXXXXXXXXX', '+977XXXXXXXXXX'],
    parents: ['+977XXXXXXXXXX', '+977XXXXXXXXXX']
  };

  // Update admin
  await prisma.schoolAdmin.updateMany({
    where: { firstName: 'Rajesh' },
    data: { whatsappNumber: testNumbers.admin }
  });

  // Update teachers
  const teachers = await prisma.teacher.findMany({ take: 2 });
  for (let i = 0; i < teachers.length && i < testNumbers.teachers.length; i++) {
    await prisma.teacher.update({
      where: { id: teachers[i].id },
      data: { whatsappNumber: testNumbers.teachers[i] }
    });
  }

  // Update parents
  const parents = await prisma.parent.findMany({ take: 2 });
  for (let i = 0; i < parents.length && i < testNumbers.parents.length; i++) {
    await prisma.parent.update({
      where: { id: parents[i].id },
      data: { whatsappNumber: testNumbers.parents[i] }
    });
  }

  console.log('Test numbers updated successfully!');
}

updateTestNumbers().catch(console.error);
```

## Test Scenarios

### 1. Webhook Verification Test

**Test:** Verify Meta can connect to your webhook

**Steps:**
1. Go to Meta Developer Console
2. Navigate to WhatsApp > Configuration
3. Enter your webhook URL: `https://your-domain.com/webhook`
4. Enter your VERIFY_TOKEN
5. Click "Verify and Save"

**Expected Result:** ✅ Webhook verified successfully

**Troubleshooting:**
- Check VERIFY_TOKEN matches your .env file
- Ensure webhook URL is accessible via HTTPS
- Check server logs for verification attempts

### 2. Health Check Test

**Test:** Verify application is running

**Command:**
```bash
curl https://your-domain.com/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Teacher Daily Update Test

**Test:** Teacher sends daily class update

**Steps:**
1. From a registered teacher's WhatsApp, send:
```
Class: Grade 5A
Subject: Mathematics
Topic: Addition and Subtraction of 3-digit numbers
Homework: Complete exercises 1-10 on page 25
Understanding: Good
```

**Expected Results:**
1. Teacher receives confirmation: "✅ Daily update for Grade 5A saved successfully..."
2. Parents of students in Grade 5A receive formatted messages in their preferred language
3. Database stores the message in the `Message` table

**Verification:**
```sql
SELECT * FROM "Message" WHERE type = 'daily_update' ORDER BY "createdAt" DESC LIMIT 1;
```

### 4. Teacher Attendance Test

**Test:** Teacher marks attendance

**Prerequisites:** Ensure Grade 5A has exactly 2 students for this test

**Steps:**
1. From the same teacher's WhatsApp, send:
```
Attendance: P,A
```

**Expected Results:**
1. Teacher receives confirmation: "✅ Attendance for Grade 5A saved successfully."
2. Attendance records are created in database

**Verification:**
```sql
SELECT a.*, ar.status, s."firstName", s."lastName" 
FROM "Attendance" a
JOIN "AttendanceRecord" ar ON a.id = ar."attendanceId"
JOIN "Student" s ON ar."studentId" = s.id
WHERE a.date >= CURRENT_DATE
ORDER BY a."createdAt" DESC;
```

### 5. Admin Announcement Test

**Test:** Admin sends school-wide announcement

**Steps:**
1. From the registered admin's WhatsApp, send:
```
Announcement: School Holiday Notice
Message: Tomorrow is a public holiday. School will be closed. Regular classes will resume on Monday.
```

**Expected Results:**
1. Admin receives confirmation: "✅ Announcement sent successfully..."
2. All parents in the school receive the announcement in their preferred language
3. Announcement is stored in database

**Verification:**
```sql
SELECT * FROM "Announcement" ORDER BY "createdAt" DESC LIMIT 1;
```

### 6. Error Handling Tests

#### 6.1 Unregistered Teacher Test

**Test:** Message from unregistered number

**Steps:**
1. From an unregistered WhatsApp number, send any message

**Expected Result:**
- Sender receives error message: "❌ Error: Teacher not registered..."

#### 6.2 Invalid Message Format Test

**Test:** Teacher sends incorrectly formatted message

**Steps:**
1. From registered teacher's WhatsApp, send:
```
This is not a valid format
```

**Expected Result:**
- Teacher receives error with format instructions

#### 6.3 Wrong Class Name Test

**Test:** Teacher references non-existent class

**Steps:**
1. From registered teacher's WhatsApp, send:
```
Class: Grade 10X
Subject: Mathematics
Topic: Test
Homework: Test
Understanding: Good
```

**Expected Result:**
- Teacher receives error: "❌ Error: Class 'Grade 10X' not found..."

#### 6.4 Attendance Mismatch Test

**Test:** Teacher sends wrong number of attendance records

**Steps:**
1. From registered teacher's WhatsApp (Grade 5A has 2 students), send:
```
Attendance: P,A,P
```

**Expected Result:**
- Teacher receives error about attendance count mismatch

### 7. Language Preference Test

**Test:** Verify messages are sent in correct language

**Steps:**
1. Ensure you have parents with both 'en' and 'ne' language preferences
2. Send a daily update from teacher
3. Check that English-preference parents receive English messages
4. Check that Nepali-preference parents receive Nepali messages

**Verification:**
- Manually check received WhatsApp messages
- Compare message content with translations in `src/utils/translations.ts`

### 8. Monthly Summary Test

**Test:** Verify monthly summary generation

**Note:** This normally runs automatically on the 1st of each month. For testing, you can trigger it manually.

**Steps:**
1. Create a test script to trigger monthly summary:
```typescript
// scripts/test-monthly-summary.ts
import { generateAndSendMonthlySummaries } from '../src/services/whatsappService';

generateAndSendMonthlySummaries()
  .then(() => console.log('Monthly summaries sent'))
  .catch(console.error);
```

2. Run the script:
```bash
npx ts-node scripts/test-monthly-summary.ts
```

**Expected Results:**
- Parents receive monthly summary messages
- Messages include attendance percentage, topics covered, and teacher notes

### 9. Database Integrity Test

**Test:** Verify data relationships and constraints

**Queries:**
```sql
-- Check all students have valid class and parent references
SELECT s.*, c.name as class_name, p."firstName" as parent_name
FROM "Student" s
LEFT JOIN "Class" c ON s."classId" = c.id
LEFT JOIN "Parent" p ON s."parentId" = p.id
WHERE c.id IS NULL OR p.id IS NULL;

-- Check all classes have valid teacher and school references
SELECT c.*, t."firstName" as teacher_name, sc.name as school_name
FROM "Class" c
LEFT JOIN "Teacher" t ON c."teacherId" = t.id
LEFT JOIN "School" sc ON c."schoolId" = sc.id
WHERE t.id IS NULL OR sc.id IS NULL;

-- Check attendance records integrity
SELECT ar.*, a.date, s."firstName", s."lastName"
FROM "AttendanceRecord" ar
JOIN "Attendance" a ON ar."attendanceId" = a.id
JOIN "Student" s ON ar."studentId" = s.id
WHERE ar.status NOT IN ('P', 'A');
```

## Load Testing

### 1. Message Volume Test

**Test:** Send multiple messages simultaneously

**Script:**
```bash
# Send 10 daily updates with 1-second intervals
for i in {1..10}; do
  # Send message via WhatsApp API or simulate webhook calls
  sleep 1
done
```

### 2. Parent Notification Load Test

**Test:** Verify system handles multiple parent notifications

**Steps:**
1. Create a class with many students (20+)
2. Send daily update
3. Monitor system performance and message delivery

## Monitoring During Tests

### 1. Server Logs

Monitor application logs in real-time:

```bash
# Railway
railway logs --tail

# Heroku
heroku logs --tail

# Local/VPS
tail -f logs/app.log
```

### 2. Database Monitoring

Monitor database queries and performance:

```sql
-- Check recent messages
SELECT type, "createdAt", status FROM "Message" ORDER BY "createdAt" DESC LIMIT 10;

-- Check attendance records
SELECT COUNT(*) as total_attendance_today FROM "Attendance" WHERE date >= CURRENT_DATE;

-- Check system health
SELECT 
  (SELECT COUNT(*) FROM "School") as schools,
  (SELECT COUNT(*) FROM "Teacher") as teachers,
  (SELECT COUNT(*) FROM "Student") as students,
  (SELECT COUNT(*) FROM "Parent") as parents;
```

### 3. WhatsApp API Monitoring

Monitor WhatsApp API responses and rate limits:

- Check Meta Developer Console for API usage
- Monitor webhook delivery status
- Track message delivery rates

## Test Checklist

- [ ] Webhook verification works
- [ ] Health check endpoint responds
- [ ] Teacher daily update flow works
- [ ] Teacher attendance marking works
- [ ] Admin announcements work
- [ ] Parents receive messages in correct language
- [ ] Error messages are sent for invalid inputs
- [ ] Database stores all data correctly
- [ ] Monthly summaries generate correctly
- [ ] System handles multiple concurrent messages
- [ ] All WhatsApp numbers are properly formatted
- [ ] Cron job for monthly summaries is configured

## Common Issues and Solutions

### Issue: Messages not being received

**Possible Causes:**
- WhatsApp numbers not in international format
- WhatsApp Cloud API rate limits exceeded
- Invalid access token

**Solutions:**
- Ensure all numbers start with country code (+977 for Nepal)
- Check Meta Developer Console for API usage
- Regenerate access token if expired

### Issue: Webhook not receiving messages

**Possible Causes:**
- Webhook URL not accessible
- VERIFY_TOKEN mismatch
- HTTPS certificate issues

**Solutions:**
- Test webhook URL directly in browser
- Verify VERIFY_TOKEN in Meta console matches .env
- Ensure SSL certificate is valid

### Issue: Database connection errors

**Possible Causes:**
- Incorrect DATABASE_URL
- Database server down
- Connection pool exhausted

**Solutions:**
- Verify DATABASE_URL format and credentials
- Check database server status
- Restart application to reset connection pool

### Issue: Messages in wrong language

**Possible Causes:**
- Parent language preference not set correctly
- Translation key missing

**Solutions:**
- Check parent `prefferedLanguage` field in database
- Verify translation exists in `translations.ts`
- Default to English if translation missing