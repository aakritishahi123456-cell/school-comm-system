# Message Frequency Control System

## 🎯 Objective
Prevent message spam and create a calm, predictable communication experience for parents while ensuring important information reaches them effectively.

## 📊 Frequency Rules & Limits

### Daily Limits
| Message Type | Maximum per Day | Time Window | Combining Logic |
|--------------|----------------|-------------|-----------------|
| Daily Updates | 1 per class | 3:00 PM - 6:00 PM | Combine if multiple subjects |
| Announcements | 2 urgent, 1 general | 8:00 AM - 7:00 PM | Combine non-urgent |
| System Messages | 1 per parent | Any time | Never combine |
| Emergency | Unlimited | Any time | Send immediately |

### Weekly Patterns
```
Monday    : Week overview (optional) + Daily update
Tuesday   : Daily update only
Wednesday : Daily update only  
Thursday  : Daily update only
Friday    : Daily update + Week summary (optional)
Saturday  : Announcements only (if urgent)
Sunday    : No routine messages (emergency only)
```

### Monthly Limits
- **Week 1-3**: Regular daily updates
- **Week 4**: Preparation for monthly summary
- **Month End**: Single comprehensive monthly summary
- **Maximum**: 25 messages per parent per month

## 🔄 Message Combining Logic

### Scenario 1: Multiple Daily Updates
**Trigger**: 2+ daily updates from same class within 2 hours

**Before** (Separate Messages):
```
Message 1 (3:15 PM):
📚 Daily Update - Grade 5A
📖 Subject: Mathematics
✏️ Topic: Fractions
📝 Homework: Page 45-46
📊 Understanding: 😊 Good

Message 2 (3:45 PM):
📚 Daily Update - Grade 5A  
📖 Subject: English
✏️ Topic: Grammar Rules
📝 Homework: Exercise 12
📊 Understanding: 👍 Average
```

**After** (Combined Message):
```
📚 Combined Daily Update - Grade 5A

Today's Subjects: Mathematics, English

1️⃣ Mathematics: Fractions
   📝 Homework: Page 45-46
   📊 Understanding: 😊 Good

2️⃣ English: Grammar Rules  
   📝 Homework: Exercise 12
   📊 Understanding: 👍 Average

💭 Overall: Great effort in both subjects! Keep practicing fractions and grammar rules.

👨‍🏫 Class Teachers
📅 March 15, 2024

🏫 Have a wonderful evening!
```

### Scenario 2: Multiple Announcements
**Trigger**: 3+ announcements in same day

**Before** (Separate Messages):
```
Message 1: Library book return reminder
Message 2: Sports day preparation  
Message 3: Parent-teacher meeting schedule
```

**After** (Combined Message):
```
📢 School Updates - March 15, 2024

📚 Library Reminder: Please return borrowed books by March 20th

⚽ Sports Day: Preparation starts next week. Send sports clothes on Monday.

👥 Parent Meetings: Schedule available at school office. Please book your slot.

📞 Questions? Contact: +977-1-234-5678

🏫 Kathmandu Public School
```

## ⏰ Smart Timing System

### Optimal Send Times (Nepal Context)
```
Daily Updates    : 4:00 PM - 5:30 PM (after school, before dinner)
Announcements    : 10:00 AM - 11:00 AM (morning planning time)
Monthly Summary  : 7:00 PM - 8:00 PM (evening reflection time)
Emergency        : Immediate (any time)
```

### Time Zone Considerations
- **Primary**: Asia/Kathmandu (NPT)
- **Respect**: No messages during typical meal times
  - Breakfast: 7:00 AM - 8:30 AM
  - Lunch: 12:00 PM - 1:00 PM  
  - Dinner: 7:30 PM - 8:30 PM
- **Avoid**: Late night (after 9:00 PM) and early morning (before 7:00 AM)

### Festival & Holiday Respect
```javascript
// No routine messages during major festivals
const noMessageDays = [
  'Dashain', 'Tihar', 'Holi', 'Buddha Jayanti',
  'Eid', 'Christmas', 'New Year'
];

// Reduced frequency during exam periods
const examPeriods = {
  frequency: 'reduced',
  types: ['announcements_only', 'urgent_only']
};
```

## 🤖 Implementation Logic

### Message Queue Processing
```javascript
class MessageFrequencyController {
  
  async shouldSendMessage(parentId, messageType, content) {
    // Check daily limits
    const todayCount = await this.getTodayMessageCount(parentId, messageType);
    const dailyLimit = this.getDailyLimit(messageType);
    
    if (todayCount >= dailyLimit) {
      return { send: false, reason: 'daily_limit_exceeded' };
    }
    
    // Check timing appropriateness
    if (!this.isAppropriateTime(messageType)) {
      return { send: false, reason: 'inappropriate_time', suggestedTime: this.getNextAppropriateTime(messageType) };
    }
    
    // Check for combining opportunities
    const combineOpportunity = await this.checkCombineOpportunity(parentId, messageType, content);
    if (combineOpportunity.shouldCombine) {
      return { send: false, reason: 'combine_with_pending', combineWith: combineOpportunity.messages };
    }
    
    return { send: true };
  }
  
  async checkCombineOpportunity(parentId, messageType, content) {
    const recentMessages = await this.getRecentPendingMessages(parentId, messageType, '2 hours');
    
    if (messageType === 'daily_update' && recentMessages.length > 0) {
      return { shouldCombine: true, messages: recentMessages };
    }
    
    if (messageType === 'announcement' && recentMessages.length >= 2) {
      const nonUrgent = recentMessages.filter(msg => msg.priority !== 'urgent');
      if (nonUrgent.length >= 2) {
        return { shouldCombine: true, messages: nonUrgent };
      }
    }
    
    return { shouldCombine: false };
  }
}
```

### Database Schema for Tracking
```sql
-- Message frequency tracking
CREATE TABLE message_frequency_log (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL,
  message_type VARCHAR(50) NOT NULL,
  sent_at TIMESTAMP NOT NULL,
  combined_count INTEGER DEFAULT 1,
  original_messages JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily frequency summary
CREATE TABLE daily_message_summary (
  id UUID PRIMARY KEY,
  parent_id UUID NOT NULL,
  date DATE NOT NULL,
  message_counts JSONB NOT NULL, -- {"daily_update": 1, "announcement": 2}
  total_messages INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(parent_id, date)
);
```

## 📈 Monitoring & Analytics

### Key Metrics to Track
```javascript
const frequencyMetrics = {
  // Parent satisfaction
  messageOverloadComplaints: 0, // Target: <1% of parents
  parentEngagementRate: 95,     // Target: >90%
  messageReadRate: 98,          // Target: >95%
  
  // System efficiency  
  messagesCombined: 150,        // Daily average
  spamPrevention: 45,           // Messages blocked per day
  timingOptimization: 89,       // % sent at optimal times
  
  // Communication effectiveness
  schoolOfficeInquiries: -30,   // % reduction in calls
  parentSatisfactionScore: 4.2, // Out of 5
  teacherEfficiencyGain: 25     // % time saved
};
```

### Alert Thresholds
```javascript
const alerts = {
  // High frequency warnings
  dailyLimitApproached: {
    threshold: '80% of daily limit',
    action: 'notify_admin'
  },
  
  // Parent complaints
  overloadComplaints: {
    threshold: '3 complaints per week',
    action: 'review_frequency_rules'
  },
  
  // System performance
  combiningFailures: {
    threshold: '5% failure rate',
    action: 'technical_review'
  }
};
```

## 🎛️ Admin Controls

### Frequency Management Dashboard
```
📊 Message Frequency Dashboard

Today's Stats:
├── Messages Sent: 1,247
├── Messages Combined: 89 (7.1%)
├── Messages Delayed: 23 (timing)
└── Messages Blocked: 12 (limits)

Parent Feedback:
├── Satisfaction Score: 4.3/5
├── "Too Many" Reports: 2
├── "Too Few" Reports: 0
└── Timing Complaints: 1

Quick Actions:
├── 🔧 Adjust Daily Limits
├── ⏰ Modify Send Times  
├── 🔄 Review Combining Rules
└── 📊 Export Analytics
```

### Emergency Override
```javascript
// Emergency message bypass
const emergencyOverride = {
  triggers: ['natural_disaster', 'school_closure', 'safety_alert'],
  bypasses: ['frequency_limits', 'timing_restrictions', 'combining_rules'],
  approval: 'admin_required',
  logging: 'mandatory'
};
```

## 🧪 A/B Testing Framework

### Test Scenarios
1. **Combining Threshold**: 1 hour vs 2 hours vs 3 hours
2. **Daily Limits**: 1 vs 2 vs 3 daily updates
3. **Send Times**: 4 PM vs 5 PM vs 6 PM
4. **Weekend Messages**: Allowed vs Blocked

### Success Metrics
- Parent satisfaction scores
- Message engagement rates
- School office inquiry volume
- Teacher feedback ratings

## 🔄 Continuous Optimization

### Weekly Review Process
1. **Monday**: Analyze previous week's metrics
2. **Tuesday**: Identify optimization opportunities  
3. **Wednesday**: Implement minor adjustments
4. **Thursday**: Monitor impact of changes
5. **Friday**: Document learnings and plan next week

### Monthly Deep Dive
- Parent satisfaction survey analysis
- Teacher feedback compilation
- System performance review
- Frequency rule optimization
- Cultural calendar updates

### Quarterly Strategy Review
- Overall communication effectiveness
- Technology improvements
- Scaling considerations
- Best practice documentation

## 🎯 Success Indicators

### Parent Experience
- **98%** of parents find message frequency "just right"
- **<2%** report feeling overwhelmed
- **95%** read messages within 2 hours
- **4.5/5** average satisfaction rating

### System Efficiency
- **15%** reduction in total messages through smart combining
- **30%** reduction in school office inquiries
- **25%** improvement in teacher productivity
- **99.9%** system uptime and reliability

### Communication Quality
- **90%** of important information reaches parents
- **<1%** of critical messages missed
- **85%** of parents prefer current frequency over alternatives
- **Zero** complaints about spam or overload

This frequency control system ensures parents receive the right information at the right time without feeling overwhelmed, while maintaining the premium, trustworthy experience that builds strong school-parent partnerships.