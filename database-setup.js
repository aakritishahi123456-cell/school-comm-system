// Simple database setup for school communication system
// This creates in-memory storage for testing (no PostgreSQL needed initially)

class SimpleDatabase {
  constructor() {
    this.schools = [];
    this.teachers = [];
    this.students = [];
    this.parents = [];
    this.messages = [];
    this.attendance = [];

    // Initialize with sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample school
    const school = {
      id: 'school_1',
      name: 'Kathmandu Public School',
      address: 'Kathmandu, Nepal',
      contactEmail: 'info@kps.edu.np',
      contactPhone: '+9771234567890'
    };
    this.schools.push(school);

    // Sample admin
    const admin = {
      id: 'admin_1',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      whatsappNumber: process.env.TEST_WHATSAPP_NUMBER || '+15551453997',
      schoolId: 'school_1',
      role: 'admin'
    };
    this.teachers.push(admin);

    // Sample teacher
    const teacher = {
      id: 'teacher_1',
      firstName: 'Ram',
      lastName: 'Sharma',
      whatsappNumber: process.env.TEST_WHATSAPP_NUMBER || '+15551453997',
      schoolId: 'school_1',
      role: 'teacher',
      className: 'Grade 5A'
    };
    this.teachers.push(teacher);

    // Sample parent
    const parent = {
      id: 'parent_1',
      firstName: 'John',
      lastName: 'Doe',
      whatsappNumber: process.env.TEST_WHATSAPP_NUMBER || '+15551453997',
      preferredLanguage: 'en',
      schoolId: 'school_1'
    };
    this.parents.push(parent);

    // Sample student
    const student = {
      id: 'student_1',
      firstName: 'Alice',
      lastName: 'Doe',
      rollNumber: '01',
      className: 'Grade 5A',
      parentId: 'parent_1',
      schoolId: 'school_1'
    };
    this.students.push(student);

    console.log('✅ Sample data initialized');
    console.log(`📚 Schools: ${this.schools.length}`);
    console.log(`👨‍🏫 Teachers: ${this.teachers.length}`);
    console.log(`👨‍👩‍👧‍👦 Parents: ${this.parents.length}`);
    console.log(`👦👧 Students: ${this.students.length}`);
  }

  // Find teacher by WhatsApp number
  findTeacherByPhone(phoneNumber) {
    return this.teachers.find(t => t.whatsappNumber === phoneNumber && t.role === 'teacher');
  }

  // Find admin by WhatsApp number
  findAdminByPhone(phoneNumber) {
    return this.teachers.find(t => t.whatsappNumber === phoneNumber && t.role === 'admin');
  }

  // Find parents by class name
  findParentsByClass(className) {
    const studentsInClass = this.students.filter(s => s.className === className);
    const parentIds = studentsInClass.map(s => s.parentId);
    return this.parents.filter(p => parentIds.includes(p.id));
  }

  // Find all parents in school
  findAllParents(schoolId) {
    return this.parents.filter(p => p.schoolId === schoolId);
  }

  // Save message
  saveMessage(messageData) {
    const message = {
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...messageData
    };
    this.messages.push(message);
    return message;
  }

  // Get recent messages
  getRecentMessages(limit = 10) {
    return this.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

module.exports = SimpleDatabase;
