// Safe environment variable access for browser environments
const getEnvVar = (name: string, fallback: string) => {
  try {
    // Try to access environment variables safely
    if (typeof process !== 'undefined' && process.env) {
      return process.env[name] || fallback;
    }
    // Fallback for environments where process is not available
    return fallback;
  } catch {
    return fallback;
  }
};

const API_BASE_URL = getEnvVar('REACT_APP_API_URL', 'http://localhost:5000/api');
const IS_DEVELOPMENT = getEnvVar('NODE_ENV', 'development') === 'development';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiService {
  private token: string | null = null;
  private baseUrl: string = API_BASE_URL;
  private mockMode: boolean = false;

  constructor() {
    // Bind all methods to ensure proper 'this' context
    this.request = this.request.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.getCandidates = this.getCandidates.bind(this);
    this.getCandidate = this.getCandidate.bind(this);
    this.createCandidate = this.createCandidate.bind(this);
    this.updateCandidate = this.updateCandidate.bind(this);
    this.deleteCandidate = this.deleteCandidate.bind(this);
    this.uploadResume = this.uploadResume.bind(this);
    this.createChatSession = this.createChatSession.bind(this);
    this.getChatSession = this.getChatSession.bind(this);
    this.getChatMessages = this.getChatMessages.bind(this);
    this.sendChatMessage = this.sendChatMessage.bind(this);
    this.getNotifications = this.getNotifications.bind(this);
    this.markNotificationRead = this.markNotificationRead.bind(this);
    this.markAllNotificationsRead = this.markAllNotificationsRead.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);
    this.getDashboardMetrics = this.getDashboardMetrics.bind(this);
    this.getCandidateStats = this.getCandidateStats.bind(this);
    this.healthCheck = this.healthCheck.bind(this);
    this.validateToken = this.validateToken.bind(this);
    
    // Initialize token
    try {
      this.token = localStorage.getItem('hr_token');
    } catch (error) {
      console.warn('localStorage not available, running without stored token');
      this.token = null;
    }
    
    // Check if we should start in mock mode
    if (IS_DEVELOPMENT) {
      // Use setTimeout to avoid blocking constructor
      setTimeout(() => this.checkBackendAvailability(), 100);
    }
  }

  private async checkBackendAvailability() {
    try {
      // Create a timeout controller for better browser compatibility
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.status}`);
      }
      
      this.mockMode = false;
      console.log('✅ PostgreSQL backend is available and connected');
    } catch (error) {
      this.mockMode = true;
      // Only log in development mode to reduce console noise
      if (IS_DEVELOPMENT) {
        console.info('🎯 Demo Mode: Using sample data (backend not available)');
      }
    }
  }

  setAuthToken(token: string | null) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem('hr_token', token);
      } else {
        localStorage.removeItem('hr_token');
        localStorage.removeItem('hr_session');
      }
    } catch (error) {
      console.warn('localStorage not available for token storage');
    }
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // If in mock mode and development, return mock data immediately
    if (this.mockMode && IS_DEVELOPMENT) {
      return this.handleMockRequest<T>(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    // Create timeout controller for all requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const config: RequestInit = {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    // Don't set Content-Type for FormData
    if (options.body instanceof FormData) {
      delete (config.headers as any)['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setAuthToken(null);
          throw new Error('Authentication failed - please login again');
        } else if (response.status === 503) {
          // Service unavailable - likely PostgreSQL connection issue
          throw new Error('Database service temporarily unavailable');
        } else if (response.status >= 500) {
          // Server error - likely PostgreSQL related
          throw new Error('PostgreSQL database error - please try again');
        }
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Mark backend as available on successful request
      if (this.mockMode) {
        this.mockMode = false;
        console.log('✅ Backend connection restored');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Enhanced error handling for different scenarios
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request timeout
          if (IS_DEVELOPMENT) {
            if (!this.mockMode) {
              console.info('🎯 Switching to demo mode - request timeout');
            }
            this.mockMode = true;
            return this.handleMockRequest<T>(endpoint, options);
          }
          throw new Error('Request timeout - please check your connection');
        } else if (error.message === 'Failed to fetch') {
          // Network error (CORS, no connection, etc.)
          if (IS_DEVELOPMENT) {
            if (!this.mockMode) {
              console.info('🎯 Demo mode active - backend not available');
            }
            this.mockMode = true;
            return this.handleMockRequest<T>(endpoint, options);
          }
          throw new Error('Cannot connect to server - please check your internet connection');
        } else if (error.message.includes('database') || error.message.includes('PostgreSQL')) {
          // Database-specific errors
          if (IS_DEVELOPMENT) {
            if (!this.mockMode) {
              console.info('🎯 Demo mode active - database not available');
            }
            this.mockMode = true;
            return this.handleMockRequest<T>(endpoint, options);
          }
          throw new Error('Database connection error - please try again later');
        }
      }
      
      throw error;
    }
  }

  private async handleMockRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300));

    const method = options.method || 'GET';
    
    // Route to appropriate mock handler
    if (endpoint === '/auth/login' && method === 'POST') {
      return this.mockLogin(options.body) as T;
    }
    
    if (endpoint === '/auth/profile' && method === 'GET') {
      return this.mockGetProfile() as T;
    }
    
    if (endpoint === '/auth/profile' && method === 'PUT') {
      return this.mockUpdateProfile(options.body) as T;
    }
    
    if (endpoint.startsWith('/candidates') && method === 'GET') {
      return this.getMockCandidates() as T;
    }
    
    if (endpoint === '/candidates' && method === 'POST') {
      return this.mockCreateCandidate(options.body) as T;
    }
    
    if (endpoint.startsWith('/candidates/') && method === 'PUT') {
      return this.mockUpdateCandidate(endpoint, options.body) as T;
    }
    
    if (endpoint === '/notifications' && method === 'GET') {
      return this.getMockNotifications() as T;
    }
    
    if (endpoint === '/analytics/metrics' && method === 'GET') {
      return this.getMockMetrics() as T;
    }
    
    if (endpoint === '/chat/sessions' && method === 'POST') {
      return this.mockCreateChatSession(options.body) as T;
    }
    
    if (endpoint.startsWith('/notifications/') && endpoint.endsWith('/read') && method === 'PUT') {
      return { success: true, message: 'Notification marked as read' } as T;
    }
    
    if (endpoint === '/notifications/read-all' && method === 'PUT') {
      return { success: true, message: 'All notifications marked as read' } as T;
    }
    
    if (endpoint.startsWith('/notifications/') && method === 'DELETE') {
      return { success: true, message: 'Notification deleted' } as T;
    }
    
    if (endpoint === '/health' && method === 'GET') {
      return { 
        status: 'mock_mode', 
        backend: 'unavailable',
        database: 'mock_data',
        timestamp: new Date().toISOString(),
        message: 'Operating in development mock mode'
      } as T;
    }
    
    // Default mock response
    return { message: 'Mock response', data: null } as T;
  }

  private mockLogin(body: any): any {
    let credentials;
    try {
      credentials = JSON.parse(body as string);
    } catch {
      credentials = { email: 'demo@company.com', password: 'demo123' };
    }

    const mockUser = {
      _id: 'mock_user_123',
      name: 'Development User',
      email: credentials.email,
      role: 'HR Manager',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      department: 'Human Resources',
      bio: 'Experienced HR professional focused on finding the best talent.',
      avatar: '',
      joinDate: new Date().toISOString(),
      token: 'mock_token_123'
    };
    
    this.setAuthToken(mockUser.token);
    return mockUser;
  }

  private mockGetProfile(): any {
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
  }

  private mockUpdateProfile(body: any): any {
    let updates;
    try {
      updates = JSON.parse(body as string);
    } catch {
      updates = {};
    }
    
    const currentProfile = this.mockGetProfile();
    return { ...currentProfile, ...updates };
  }

  private mockCreateCandidate(body: any): any {
    let candidateData;
    try {
      candidateData = JSON.parse(body as string);
    } catch {
      candidateData = {};
    }

    return {
      _id: 'mock_candidate_' + Date.now(),
      ...candidateData,
      appliedDate: new Date().toISOString(),
      score: Math.floor(Math.random() * 100),
      status: 'pending',
      isShortlisted: false
    };
  }

  private mockUpdateCandidate(endpoint: string, body: any): any {
    const candidateId = endpoint.split('/')[2];
    let updates;
    try {
      updates = JSON.parse(body as string);
    } catch {
      updates = {};
    }

    const mockCandidates = this.getMockCandidates();
    const candidate = mockCandidates.find((c: any) => c._id === candidateId);
    return candidate ? { ...candidate, ...updates } : null;
  }

  private mockCreateChatSession(body: any): any {
    let data;
    try {
      data = JSON.parse(body as string);
    } catch {
      data = { candidateId: 'unknown' };
    }

    return {
      _id: 'mock_session_' + Date.now(),
      sessionId: 'session_' + data.candidateId + '_' + Date.now(),
      candidateId: data.candidateId,
      status: 'active',
      startTime: new Date().toISOString(),
      currentQuestionIndex: 0,
      finalScore: null,
      isComplete: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }) {
    return await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    phone?: string;
    location?: string;
    department?: string;
  }) {
    return await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return await this.request('/auth/profile');
  }

  async updateProfile(updates: any) {
    return await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Candidates methods with development fallbacks
  async getCandidates(filters: {
    status?: string;
    position?: string;
    search?: string;
    limit?: number;
    page?: number;
  } = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });
    
    const query = params.toString();
    return await this.request(`/candidates${query ? `?${query}` : ''}`);
  }

  async getCandidate(id: string) {
    return await this.request(`/candidates/${id}`);
  }

  async createCandidate(candidateData: any) {
    return await this.request('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  }

  async updateCandidate(id: string, updates: any) {
    return await this.request(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCandidate(id: string) {
    return await this.request(`/candidates/${id}`, {
      method: 'DELETE',
    });
  }

  // File Upload
  async uploadResume(file: File, candidateData: any) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('candidateData', JSON.stringify(candidateData));

    return await this.request('/upload/resume', {
      method: 'POST',
      body: formData,
    });
  }

  // Chat Sessions
  async createChatSession(candidateId: string) {
    return await this.request('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ candidateId }),
    });
  }

  async getChatSession(sessionId: string) {
    return await this.request(`/chat/sessions/${sessionId}`);
  }

  async getChatMessages(sessionId: string) {
    return await this.request(`/chat/sessions/${sessionId}/messages`);
  }

  async sendChatMessage(sessionId: string, message: {
    type: 'candidate' | 'ai' | 'system';
    content: string;
    metadata?: any;
  }) {
    return await this.request(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Notifications
  async getNotifications() {
    return await this.request('/notifications');
  }

  async markNotificationRead(id: string) {
    return await this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return await this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return await this.request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getDashboardMetrics() {
    return await this.request('/analytics/metrics');
  }

  async getCandidateStats() {
    return await this.request('/analytics/candidates');
  }

  // Health Check with detailed status
  async healthCheck() {
    try {
      const result = await this.request('/health');
      return {
        status: 'connected',
        backend: 'available',
        database: 'postgresql',
        timestamp: new Date().toISOString(),
        ...result
      };
    } catch (error) {
      if (this.mockMode) {
        return {
          status: 'mock_mode',
          backend: 'unavailable',
          database: 'mock_data',
          timestamp: new Date().toISOString(),
          message: 'Operating in development mock mode'
        };
      }
      throw error;
    }
  }

  // Utility method to check if token is valid
  async validateToken(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch {
      return false;
    }
  }

  // Public method to check if in mock mode
  isMockMode(): boolean {
    return this.mockMode;
  }

  // Method to manually switch to mock mode
  enableMockMode() {
    this.mockMode = true;
    console.warn('Manual mock mode enabled');
  }

  // Method to retry backend connection
  async retryConnection() {
    console.log('🔄 Attempting to reconnect to backend...');
    await this.checkBackendAvailability();
    return !this.mockMode;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      mockMode: this.mockMode,
      baseUrl: this.baseUrl,
      hasToken: !!this.token,
      isDevelopment: IS_DEVELOPMENT
    };
  }

  // Mock data methods for development
  private getMockCandidates(filters: any = {}) {
    const candidates = [
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

    // Apply filters if provided
    let filtered = candidates;
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.position) {
      filtered = filtered.filter(c => c.position.toLowerCase().includes(filters.position.toLowerCase()));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.position.toLowerCase().includes(search) ||
        c.skills.some(skill => skill.toLowerCase().includes(search))
      );
    }

    return filtered;
  }

  private getMockNotifications() {
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
  }

  private getMockMetrics() {
    return {
      totalCandidates: 5,
      screened: 1,
      shortlisted: 2,
      pending: 2,
      rejected: 0,
      hired: 1,
      averageScore: 89.8,
    };
  }
}

export default new ApiService();