// Mock Data Service for Development Mode
// This service provides consistent mock data when the backend is not available

export const mockDataService = {
  // User data
  getMockUser() {
    return {
      _id: 'mock_user_123',
      name: 'Development User',
      email: 'dev@example.com',
      role: 'HR Manager',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      department: 'Human Resources',
      bio: 'Experienced HR professional focused on finding the best talent.',
      avatar: '',
      joinDate: new Date().toISOString(),
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        candidateUpdates: true,
        systemAlerts: false
      }
    };
  },

  // Candidates data
  getMockCandidates() {
    return [
      {
        _id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        position: 'Senior Software Engineer',
        experience: '5 years',
        education: 'BS Computer Science, Stanford University',
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        score: 92,
        status: 'shortlisted',
        appliedDate: '2024-12-20T10:30:00Z',
        resumeUrl: '',
        avatar: '',
        isShortlisted: true,
        linkedinId: 'sarah-johnson-dev',
        chatSessionId: 'session_1_123',
        chatLink: `${window.location.origin}?session=session_1_123&candidate=1&name=Sarah%20Johnson&position=Senior%20Software%20Engineer`,
        hasChatStarted: true,
        notes: [],
        tags: ['frontend', 'senior'],
        source: 'linkedin'
      },
      {
        _id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        location: 'New York, NY',
        position: 'Product Manager',
        experience: '7 years',
        education: 'MBA Harvard Business School, BS Engineering MIT',
        skills: ['Product Strategy', 'Data Analysis', 'Agile', 'Leadership', 'SQL'],
        score: 88,
        status: 'screening',
        appliedDate: '2024-12-19T14:15:00Z',
        resumeUrl: '',
        avatar: '',
        isShortlisted: false,
        linkedinId: 'michael-chen-pm',
        chatSessionId: 'session_2_124',
        chatLink: `${window.location.origin}?session=session_2_124&candidate=2&name=Michael%20Chen&position=Product%20Manager`,
        hasChatStarted: false,
        notes: [],
        tags: ['product', 'management'],
        source: 'website'
      },
      {
        _id: '3',
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@email.com',
        phone: '+1 (555) 345-6789',
        location: 'Austin, TX',
        position: 'UX Designer',
        experience: '4 years',
        education: 'BFA Design, Art Institute of Chicago',
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'HTML/CSS'],
        score: 85,
        status: 'pending',
        appliedDate: '2024-12-18T09:45:00Z',
        resumeUrl: '',
        avatar: '',
        isShortlisted: false,
        linkedinId: 'emma-rodriguez-ux',
        chatSessionId: null,
        chatLink: null,
        hasChatStarted: false,
        notes: [],
        tags: ['design', 'creative'],
        source: 'referral'
      },
      {
        _id: '4',
        name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Seattle, WA',
        position: 'DevOps Engineer',
        experience: '6 years',
        education: 'BS Computer Engineering, Carnegie Mellon',
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
        score: 94,
        status: 'hired',
        appliedDate: '2024-12-15T16:20:00Z',
        resumeUrl: '',
        avatar: '',
        isShortlisted: true,
        linkedinId: 'david-kim-devops',
        chatSessionId: 'session_4_126',
        chatLink: `${window.location.origin}?session=session_4_126&candidate=4&name=David%20Kim&position=DevOps%20Engineer`,
        hasChatStarted: true,
        notes: [],
        tags: ['devops', 'infrastructure'],
        source: 'job_board'
      },
      {
        _id: '5',
        name: 'Lisa Park',
        email: 'lisa.park@email.com',
        phone: '+1 (555) 567-8901',
        location: 'Boston, MA',
        position: 'Data Scientist',
        experience: '3 years',
        education: 'MS Data Science, MIT',
        skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'R'],
        score: 90,
        status: 'pending',
        appliedDate: '2024-12-17T11:30:00Z',
        resumeUrl: '',
        avatar: '',
        isShortlisted: false,
        linkedinId: 'lisa-park-ds',
        chatSessionId: null,
        chatLink: null,
        hasChatStarted: false,
        notes: [],
        tags: ['ai', 'analytics'],
        source: 'website'
      }
    ];
  },

  // Notifications data
  getMockNotifications() {
    return [
      {
        _id: 'notif_1',
        type: 'application',
        title: 'New Application Received',
        message: 'Sarah Johnson applied for Senior Software Engineer position',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        candidateName: 'Sarah Johnson',
        candidateId: '1',
        actionUrl: null,
        priority: 'medium'
      },
      {
        _id: 'notif_2',
        type: 'chat_link',
        title: 'Chat Link Generated',
        message: 'Screening chat link has been created for Michael Chen',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        isRead: false,
        candidateName: 'Michael Chen',
        candidateId: '2',
        actionUrl: `${window.location.origin}?session=session_2_124&candidate=2&name=Michael%20Chen&position=Product%20Manager`,
        priority: 'high'
      },
      {
        _id: 'notif_3',
        type: 'screening',
        title: 'Interview Completed',
        message: 'David Kim has completed the AI screening with a score of 94%',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        candidateName: 'David Kim',
        candidateId: '4',
        actionUrl: null,
        priority: 'high'
      },
      {
        _id: 'notif_4',
        type: 'upload',
        title: 'Resume Uploaded',
        message: 'Lisa Park has uploaded her resume for Data Scientist position',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        candidateName: 'Lisa Park',
        candidateId: '5',
        actionUrl: null,
        priority: 'low'
      }
    ];
  },

  // Metrics data
  getMockMetrics() {
    return {
      totalCandidates: 5,
      screened: 1,
      shortlisted: 2,
      pending: 2,
      rejected: 0,
      hired: 1,
      averageScore: 89.8,
    };
  },

  // Helper method to filter candidates
  filterCandidates(candidates: any[], filters: any = {}) {
    let filtered = [...candidates];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    if (filters.position) {
      filtered = filtered.filter(c => 
        c.position.toLowerCase().includes(filters.position.toLowerCase())
      );
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.position.toLowerCase().includes(search) ||
        c.skills.some((skill: string) => skill.toLowerCase().includes(search))
      );
    }

    return filtered;
  },

  // Generate new candidate from form data
  generateMockCandidate(data: any = {}) {
    return {
      _id: 'mock_candidate_' + Date.now(),
      name: data.name || 'New Candidate',
      email: data.email || 'candidate@email.com',
      phone: data.phone || '+1 (555) 000-0000',
      location: data.location || 'Remote',
      position: data.position || 'Software Engineer',
      experience: data.experience || '3+ years',
      education: data.education || 'Bachelor\'s Degree',
      skills: data.skills || ['JavaScript', 'React', 'Node.js'],
      score: Math.floor(Math.random() * 25) + 75, // 75-100
      status: 'pending',
      appliedDate: new Date().toISOString(),
      isShortlisted: false,
      linkedinId: data.name ? data.name.toLowerCase().replace(' ', '-') : 'candidate',
      chatLink: null,
      hasChatStarted: false,
      notes: [],
      tags: [],
      source: 'website'
    };
  },

  // Simulate network delay
  async simulateDelay(min = 200, max = 800) {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
  },

  // Generate mock chat session
  generateMockChatSession(candidateId: string) {
    return {
      _id: 'mock_session_' + Date.now(),
      sessionId: 'session_' + candidateId + '_' + Date.now(),
      candidateId,
      status: 'active',
      startTime: new Date().toISOString(),
      currentQuestionIndex: 0,
      finalScore: null,
      isComplete: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  },

  // Generate mock notification
  generateMockNotification(type: string, candidateName: string, candidateId: string, actionUrl?: string) {
    const notificationTypes = {
      application: {
        title: 'New Application Received',
        message: `${candidateName} applied for a position`
      },
      chat_link: {
        title: 'Chat Link Generated',
        message: `Screening chat link has been created for ${candidateName}`
      },
      screening: {
        title: 'Interview Completed',
        message: `${candidateName} has completed the AI screening`
      },
      upload: {
        title: 'Resume Uploaded',
        message: `${candidateName} has uploaded their resume`
      }
    };

    const notif = notificationTypes[type as keyof typeof notificationTypes] || notificationTypes.application;

    return {
      _id: 'mock_notif_' + Date.now(),
      type,
      title: notif.title,
      message: notif.message,
      createdAt: new Date().toISOString(),
      isRead: false,
      candidateName,
      candidateId,
      actionUrl,
      priority: type === 'chat_link' ? 'high' : 'medium'
    };
  },

  // Check if we're in development mode
  isDevelopmentMode() {
    return process.env.NODE_ENV === 'development';
  },

  // Get mock database status
  getMockDatabaseStatus() {
    return {
      status: 'mock_mode',
      backend: 'unavailable',
      database: 'mock_data',
      timestamp: new Date().toISOString(),
      message: 'Operating in development mock mode with full functionality'
    };
  }
};

export default mockDataService;