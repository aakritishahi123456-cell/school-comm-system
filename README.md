# WhatsApp-First School Communication System for Nepal

This project implements a comprehensive WhatsApp-first communication system designed for schools in Nepal. It facilitates efficient, low-bandwidth communication between school administrators, teachers, parents, and students, leveraging the Meta WhatsApp Cloud API. The system is neutral-branded and supports both English and Nepali languages.

## 🌟 Key Features

### **User & Role Management**
- **School Admin**: Manages teachers, classes, students, and parents; sends school-wide announcements
- **Teacher**: Sends daily class updates, marks attendance, and provides feedback via structured WhatsApp messages
- **Parent**: Receives daily updates, homework, and monthly summaries directly on WhatsApp (no app/login required)
- **Student (Optional)**: Receives the same updates as their parent

### **WhatsApp-First Communication**
- Teachers use simple text message formats for daily updates and attendance
- System automatically parses and validates messages
- Parents receive formatted messages in English + Nepali based on preference
- Automated monthly summaries with attendance and performance data

### **Smart Features**
- **Attendance Tracking**: Teachers mark attendance via WhatsApp, system calculates percentages
- **Monthly Auto-Summaries**: Parents receive comprehensive monthly reports
- **Bilingual Support**: All messages automatically translated to parent's preferred language
- **Error Handling**: Helpful error messages guide users to correct formats

## 🚀 Quick Deploy from GitHub

### One-Click Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/school-comm-system)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/your-username/school-comm-system)

### Manual Deployment

1. **Fork this repository** on GitHub
2. **Choose your platform**:
   - **Railway**: Connect GitHub repo → Add PostgreSQL → Set env vars → Deploy
   - **Render**: New Web Service → Connect repo → Add PostgreSQL → Configure
   - **Heroku**: `heroku create` → `heroku addons:create heroku-postgresql` → Deploy

See [GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md) for detailed instructions.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Meta WhatsApp Cloud API account

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository_url>
   cd school-comm-system
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and WhatsApp API credentials
   ```

3. **Setup Database**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Load Pilot Data**
   ```bash
   npm run setup
   ```

5. **Start Server**
   ```bash
   npm start
   # For development with auto-reload:
   npm run dev
   ```

## 📱 Message Formats

### Teacher Daily Update
```
Class: Grade 5A
Subject: Mathematics
Topic: Addition and Subtraction
Homework: Complete exercises 1-10 on page 25
Understanding: Good
```

### Teacher Attendance
```
Attendance: P,P,A,P,P
```

### Admin Announcement
```
Announcement: School Holiday
Message: Tomorrow is a public holiday. School will be closed.
```

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js, Express.js (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **WhatsApp**: Meta WhatsApp Cloud API
- **Scheduling**: Node-cron for monthly summaries
- **Hosting**: Railway/Render/Heroku ready

### Database Schema
- Schools, Admins, Teachers, Classes, Students, Parents
- Messages, Attendance Records, Announcements
- Full relational integrity with proper constraints

## 🌐 Deployment

### Railway (Recommended)
```bash
npm install -g @railway/cli
railway login
railway init
railway add postgresql
railway up
```

### Environment Variables
```env
DATABASE_URL="postgresql://username:password@host:port/database"
VERIFY_TOKEN="your_webhook_verify_token"
WA_ACCESS_TOKEN="your_permanent_whatsapp_access_token"
WA_PHONE_NUMBER_ID="your_whatsapp_phone_number_id"
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

The system includes comprehensive testing capabilities:

```bash
# Load test data
npm run setup

# Run health check
curl https://your-domain.com/health
```

See [TESTING.md](TESTING.md) for complete testing guide.

## 📚 Documentation

- **[API.md](API.md)**: Complete message formats and API documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Deployment guide for various platforms
- **[TESTING.md](TESTING.md)**: Comprehensive testing procedures

## 🔧 Configuration

### Meta WhatsApp Cloud API Setup

1. **Create Meta Developer Account** at [developers.facebook.com](https://developers.facebook.com)
2. **Create WhatsApp Business App**
3. **Configure Webhook**: Point to `https://your-domain.com/webhook`
4. **Generate Permanent Access Token** for production use

### Webhook Configuration
- **Callback URL**: `https://your-domain.com/webhook`
- **Verify Token**: Set in your `.env` file
- **Subscribe to**: `messages` field

## 📊 Admin API (Optional)

The system includes REST API endpoints for administrative tasks:

```bash
# Get school statistics
GET /api/admin/stats/:schoolId

# Get recent messages
GET /api/admin/messages/:schoolId

# Get attendance summary
GET /api/admin/attendance/:schoolId

# Send announcement via API
POST /api/admin/announcement/:schoolId
```

## 🌍 Localization

### Supported Languages
- **English**: Full support with emojis and friendly formatting
- **Nepali**: Complete translation including error messages
- **Extensible**: Easy to add more languages in `src/utils/translations.ts`

### Sample Messages

**English Daily Update:**
```
📚 Daily Update for Grade 5A

Subject: Mathematics
Topic Covered: Addition and Subtraction
📝 Homework: Complete exercises 1-10 on page 25
Understanding Level: Good

Have a great day! 🌟
```

**Nepali Daily Update:**
```
📚 Grade 5A को लागि दैनिक अपडेट

विषय: Mathematics
पढाइएको विषय: Addition and Subtraction
📝 गृहकार्य: Complete exercises 1-10 on page 25
बुझाइको स्तर: Good

तपाईंको दिन शुभ रहोस्! 🌟
```

## 🔒 Security Features

- **Webhook Verification**: Meta's verification token system
- **User Validation**: Only registered teachers/admins can send messages
- **Input Sanitization**: All messages validated and sanitized
- **Role-Based Access**: Teachers can only update their assigned classes
- **Database Integrity**: Proper foreign key constraints and validation

## 📈 Monitoring & Analytics

### Built-in Monitoring
- Health check endpoint (`/health`)
- Comprehensive logging of all message processing
- Database query monitoring
- WhatsApp API response tracking

### Monthly Summaries
- Automated generation on 1st of each month
- Attendance percentage calculation
- Topics covered compilation
- Teacher performance notes

## 🚀 Future Enhancements (Phase 2+)

### AI Features
- Auto-generate parent summaries from daily updates
- Suggest weak subjects for students based on performance
- Assist teachers in writing feedback
- Intelligent attendance pattern analysis

### Advanced Features
- Two-way parent communication
- Photo/document sharing capabilities
- Multi-school management
- Advanced analytics dashboard
- Mobile app for admins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
1. Check the documentation files in this repository
2. Review the testing guide for troubleshooting
3. Check server logs for error details
4. Verify WhatsApp API configuration in Meta Developer Console

## 🎯 Pilot Program

The system includes a complete pilot setup for **Kathmandu Public School** with:
- 1 School with admin
- 5 Teachers across 5 classes
- 10 Students with 10 parents (mixed English/Nepali preferences)
- Sample message templates and testing scenarios

Run `npm run setup` to initialize the pilot data and start testing immediately.

---

**Built for Nepal schools with ❤️ - Efficient, Low-bandwidth, WhatsApp-first communication**
