import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { CandidateDashboard } from './components/CandidateDashboard';
import { ResumeViewer } from './components/ResumeViewer';
import { SettingsPanel } from './components/SettingsPanel';
import { DashboardOverview } from './components/DashboardOverview';
import { ProfileSettings } from './components/ProfileSettings';
import { CandidateChat } from './components/CandidateChat';
import { ChatLinkManager } from './components/ChatLinkManager';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import { Alert, AlertDescription } from './components/ui/alert';
import { 
  LayoutDashboard, 
  Upload, 
  MessageCircle, 
  Users, 
  FileText, 
  Settings,
  Bell,
  Search,
  ChevronDown,
  User,
  UserPlus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit3,
  Link,
  Copy,
  ExternalLink,
  Zap,
  Play,
  WifiOff,
  RefreshCw,
  Database,
  Activity
} from 'lucide-react';
import { Input } from './components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import thunderLogo from 'figma:asset/94d07408ca5ca37c8e380c9ef62b9d0c31ab7c89.png';

// Services optimized for PostgreSQL
import apiService from './services/apiService';
import socketService from './services/socketService';
import { useApi } from './hooks/useApi';

// PostgreSQL-compatible interfaces (using _id for frontend compatibility)
interface Notification {
  _id: string; // PostgreSQL UUID converted to _id for compatibility
  type: 'application' | 'screening' | 'interview' | 'upload' | 'analysis' | 'chat_link';
  title: string;
  message: string;
  createdAt: string; // PostgreSQL timestamp
  updatedAt?: string; // PostgreSQL timestamp
  isRead: boolean;
  candidateName?: string;
  candidateId?: string;
  userId?: string;
  actionUrl?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface Candidate {
  _id: string; // PostgreSQL UUID converted to _id for compatibility
  name: string;
  email: string;
  phone?: string;
  location?: string;
  position: string;
  experience?: string;
  education?: string;
  skills: string[]; // PostgreSQL JSONB array
  score: number;
  status: 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired';
  appliedDate: string; // PostgreSQL timestamp
  createdAt?: string; // PostgreSQL timestamp
  updatedAt?: string; // PostgreSQL timestamp
  resumeUrl?: string;
  resumeFileName?: string;
  avatar?: string;
  isShortlisted: boolean;
  linkedinId?: string;
  chatSessionId?: string;
  chatLink?: string;
  hasChatStarted?: boolean;
  notes?: any[]; // PostgreSQL JSONB array
  tags?: string[]; // PostgreSQL JSONB array
  source?: 'website' | 'linkedin' | 'referral' | 'job_board';
  addedBy?: string; // Foreign key to User
  addedByUser?: { // Populated from PostgreSQL join
    _id: string;
    name: string;
    email: string;
  };
}

interface User {
  _id: string; // PostgreSQL UUID converted to _id for compatibility
  email: string;
  name: string;
  role: 'HR Manager' | 'HR Director' | 'Senior Recruiter' | 'Recruiter';
  avatar?: string;
  phone?: string;
  location?: string;
  department?: string;
  bio?: string;
  isActive?: boolean;
  lastLogin?: string; // PostgreSQL timestamp
  joinDate?: string; // createdAt from PostgreSQL
  createdAt?: string; // PostgreSQL timestamp  
  updatedAt?: string; // PostgreSQL timestamp
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    candidateUpdates: boolean;
    systemAlerts: boolean;
  };
}

interface DashboardMetrics {
  totalCandidates: number;
  screened: number;
  shortlisted: number;
  pending: number;
  rejected: number;
  hired: number;
  averageScore: number | string; // PostgreSQL may return string from AVG function
}

interface ChatSession {
  _id: string;
  sessionId: string;
  candidateId: string;
  candidateName?: string;
  position?: string;
  status: 'active' | 'completed' | 'expired' | 'abandoned';
  startTime: string;
  endTime?: string;
  currentQuestionIndex: number;
  finalScore?: number;
  isComplete: boolean;
  summary?: string;
  expiresAt: string;
}

export default function App() {
  // Page navigation state
  const [showLandingPage, setShowLandingPage] = useState(false);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>({
    _id: 'user123',
    email: 'sarah.johnson@techcorp.com',
    name: 'Sarah Johnson',
    role: 'HR Manager',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    department: 'Human Resources',
    bio: 'Experienced HR Manager specializing in talent acquisition and employee development.',
    isActive: true,
    lastLogin: new Date().toISOString(),
    joinDate: '2023-01-15T00:00:00Z',
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      candidateUpdates: true,
      systemAlerts: true
    }
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbStatus, setDbStatus] = useState<'connected' | 'disconnected' | 'unknown'>('disconnected');

  // Application state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired'>('all');
  
  // Data state with PostgreSQL optimization
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      _id: 'cand1',
      name: 'Alex Chen',
      email: 'alex.chen@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      position: 'Senior Frontend Developer',
      experience: '5+ years',
      education: 'BS Computer Science - University of Washington',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
      score: 8.5,
      status: 'shortlisted',
      appliedDate: '2024-01-15T10:30:00Z',
      isShortlisted: true,
      linkedinId: 'alexchen-dev',
      source: 'linkedin',
      hasChatStarted: true,
      chatLink: 'https://app.example.com/chat?session=sess123&candidate=cand1'
    },
    {
      _id: 'cand2',
      name: 'Maria Rodriguez',
      email: 'maria.r@email.com',
      position: 'UX Designer',
      experience: '3+ years',
      skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
      score: 7.8,
      status: 'screening',
      appliedDate: '2024-01-14T14:22:00Z',
      isShortlisted: false,
      source: 'website',
      hasChatStarted: false
    },
    {
      _id: 'cand3',
      name: 'David Park',
      email: 'david.park@email.com',
      position: 'Backend Engineer',
      experience: '4+ years',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
      score: 9.1,
      status: 'pending',
      appliedDate: '2024-01-13T09:15:00Z',
      isShortlisted: false,
      source: 'referral'
    },
    {
      _id: 'cand4',
      name: 'Sarah Kim',
      email: 'sarah.kim@email.com',
      position: 'Product Manager',
      experience: '6+ years',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
      score: 8.9,
      status: 'hired',
      appliedDate: '2024-01-10T11:45:00Z',
      isShortlisted: true,
      source: 'job_board'
    },
    {
      _id: 'cand5',
      name: 'James Wilson',
      email: 'james.w@email.com',
      position: 'DevOps Engineer',
      experience: '5+ years',
      skills: ['AWS', 'Terraform', 'Jenkins', 'Monitoring', 'Security'],
      score: 6.2,
      status: 'rejected',
      appliedDate: '2024-01-12T16:30:00Z',
      isShortlisted: false,
      source: 'website'
    }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: 'notif1',
      type: 'chat_link',
      title: 'Chat Link Generated',
      message: 'Screening link created for Alex Chen - Senior Frontend Developer',
      createdAt: '2024-01-15T10:30:00Z',
      isRead: false,
      candidateName: 'Alex Chen',
      candidateId: 'cand1',
      actionUrl: 'https://app.example.com/chat?session=sess123&candidate=cand1',
      priority: 'high'
    },
    {
      _id: 'notif2',
      type: 'application',
      title: 'New Application',
      message: 'Maria Rodriguez applied for UX Designer position',
      createdAt: '2024-01-14T14:22:00Z',
      isRead: false,
      candidateName: 'Maria Rodriguez',
      priority: 'medium'
    },
    {
      _id: 'notif3',
      type: 'screening',
      title: 'Screening Completed',
      message: 'Sarah Kim completed pre-screening with score 8.9/10',
      createdAt: '2024-01-13T09:15:00Z',
      isRead: true,
      candidateName: 'Sarah Kim',
      priority: 'high'
    }
  ]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCandidates: 5,
    screened: 3,
    shortlisted: 2,
    pending: 1,
    rejected: 1,
    hired: 1,
    averageScore: 8.1
  });

  // Search and pagination state for PostgreSQL
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCandidateCurrentPage] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [candidatesPerPage] = useState(20); // PostgreSQL pagination

  // Candidate chat state
  const [candidateChatMode, setCandidateChatMode] = useState<{
    sessionId: string;
    candidateId: string;
    candidateName: string;
    position: string;
  } | null>(null);

  // Demo mode state
  const [showDemoChat, setShowDemoChat] = useState(false);

  // API hooks optimized for PostgreSQL with error handling
  const [candidatesState, fetchCandidates] = useApi(
    (...args: any[]) => {
      if (!apiService || typeof apiService.getCandidates !== 'function') {
        console.error('ApiService not properly initialized');
        return Promise.reject(new Error('API service not available'));
      }
      return apiService.getCandidates(...args);
    }, 
    {
      onSuccess: (data) => {
        // Handle PostgreSQL paginated response
        if (data && typeof data === 'object') {
          if (data.data && Array.isArray(data.data)) {
            setCandidates(data.data);
            setTotalCandidates(data.total || data.data.length);
          } else if (Array.isArray(data)) {
            setCandidates(data);
            setTotalCandidates(data.length);
          }
        }
      },
      onError: (error) => {
        // Only log in production or non-mock mode
        if (!apiService.isMockMode()) {
          console.error('Failed to fetch candidates:', error);
        }
        // Handle connection errors
        if (error.includes('connection') || error.includes('database')) {
          setDbStatus('disconnected');
        }
      }
    }
  );

  const [notificationsState, fetchNotifications] = useApi(
    (...args: any[]) => {
      if (!apiService || typeof apiService.getNotifications !== 'function') {
        console.error('ApiService not properly initialized');
        return Promise.reject(new Error('API service not available'));
      }
      return apiService.getNotifications(...args);
    }, 
    {
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      },
      onError: (error) => {
        // Only log in production or non-mock mode
        if (!apiService.isMockMode()) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    }
  );

  const [metricsState, fetchMetrics] = useApi(
    (...args: any[]) => {
      if (!apiService || typeof apiService.getDashboardMetrics !== 'function') {
        console.error('ApiService not properly initialized');
        return Promise.reject(new Error('API service not available'));
      }
      return apiService.getDashboardMetrics(...args);
    }, 
    {
      onSuccess: (data) => {
        if (data && typeof data === 'object') {
          // Convert PostgreSQL string averages to numbers
          const processedMetrics = {
            ...data,
            averageScore: typeof data.averageScore === 'string' 
              ? parseFloat(data.averageScore) 
              : data.averageScore
          };
          setMetrics(processedMetrics);
        }
      },
      onError: (error) => {
        // Only log in production or non-mock mode
        if (!apiService.isMockMode()) {
          console.error('Failed to fetch metrics:', error);
        }
      }
    }
  );

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Reconnect to database when coming back online
      if (isAuthenticated) {
        checkDatabaseStatus();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated]);

  // Enhanced PostgreSQL database status check
  const checkDatabaseStatus = async () => {
    try {
      if (!apiService || typeof apiService.healthCheck !== 'function') {
        console.error('API service not properly initialized');
        setDbStatus('disconnected');
        return;
      }
      
      const response = await apiService.healthCheck();
      if (response.status === 'connected') {
        setDbStatus('connected');
        console.log('✅ Database connected successfully');
      } else if (response.status === 'mock_mode') {
        setDbStatus('disconnected');
        // Only log once in demo mode to reduce noise
        if (!apiService.isMockMode()) {
          console.info('🎯 Demo mode: All features available with sample data');
        }
      } else {
        setDbStatus('disconnected');
      }
    } catch (error) {
      setDbStatus('disconnected');
      
      // Silently try to retry connection in demo mode
      if (apiService && typeof apiService.isMockMode === 'function' && apiService.isMockMode()) {
        try {
          const reconnected = await apiService.retryConnection();
          if (reconnected) {
            setDbStatus('connected');
            console.log('✅ Backend connection restored');
          }
        } catch (retryError) {
          // Silently handle retry failures in demo mode
        }
      }
    }
  };

  // Initialize app and check authentication
  useEffect(() => {
    const initializeApp = async () => {
      // Check for demo mode or candidate chat mode first
      const urlParams = new URLSearchParams(window.location.search);
      const isDemo = urlParams.get('demo') === 'chat';
      
      if (isDemo) {
        setShowDemoChat(true);
        return;
      }

      // Check for candidate chat parameters (PostgreSQL UUID support)
      const sessionId = urlParams.get('session');
      const candidateId = urlParams.get('candidate');
      const candidateName = urlParams.get('name');
      const position = urlParams.get('position');

      if (sessionId && candidateId && candidateName && position) {
        setCandidateChatMode({
          sessionId: decodeURIComponent(sessionId),
          candidateId: decodeURIComponent(candidateId),
          candidateName: decodeURIComponent(candidateName),
          position: decodeURIComponent(position)
        });
        return;
      }

      // Check for existing authentication
      const token = localStorage.getItem('hr_token');
      if (token) {
        try {
          setIsLoading(true);
          
          // Validate API service initialization
          if (!apiService || typeof apiService.validateToken !== 'function') {
            if (!apiService || !apiService.isMockMode()) {
              console.error('API service not properly initialized');
            }
            apiService?.setAuthToken(null);
            setDbStatus('disconnected');
            return;
          }
          
          // Try to validate token
          const isValid = await apiService.validateToken();
          
          if (isValid) {
            const user = await apiService.getProfile();
            setCurrentUser(user);
            setIsAuthenticated(true);
            setShowLandingPage(false);
            
            // Check database status (will work in both real and mock mode)
            await checkDatabaseStatus();
            
            // Initialize Socket.IO connection (will fall back to mock mode automatically)
            await socketService.connect(token);
            
            // Load initial data
            await loadDashboardData();
            
            // Set database status based on API service mode
            if (apiService.isMockMode()) {
              setDbStatus('disconnected');
              // Single informative log for demo mode (only once)
              if (!localStorage.getItem('demo_mode_logged')) {
                console.info('🚀 HR Dashboard Demo: Full functionality with sample data - Start your backend server to connect to real database');
                localStorage.setItem('demo_mode_logged', 'true');
              }
            } else {
              setDbStatus('connected');
              console.log('✅ Connected to backend database');
              localStorage.removeItem('demo_mode_logged');
            }
          } else {
            // Token is invalid
            apiService.setAuthToken(null);
            setDbStatus('disconnected');
          }
        } catch (error) {
          // Only log auth errors in production or non-mock mode
          if (!apiService.isMockMode()) {
            console.error('Authentication check failed:', error);
          }
          apiService.setAuthToken(null);
          setDbStatus('disconnected');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Load dashboard data with PostgreSQL optimization
  const loadDashboardData = async () => {
    try {
      // Optimized PostgreSQL queries with proper pagination and filtering
      const candidateParams = {
        limit: candidatesPerPage,
        page: currentPage,
        status: candidateFilter !== 'all' ? candidateFilter : undefined,
        search: searchQuery || undefined
      };

      await Promise.all([
        fetchCandidates(candidateParams),
        fetchNotifications(),
        fetchMetrics()
      ]);

      // Update database status on successful load
      setDbStatus('connected');
    } catch (error) {
      // Only log in production or non-mock mode
      if (!apiService.isMockMode()) {
        console.error('Failed to load dashboard data:', error);
      }
      setDbStatus('disconnected');
    }
  };

  // Socket event listeners with PostgreSQL UUID handling
  useEffect(() => {
    if (isAuthenticated && socketService.isSocketConnected()) {
      // Real-time candidate updates (PostgreSQL UUIDs)
      socketService.onCandidateUpdate((candidate) => {
        setCandidates(prev => 
          prev.map(c => c._id === candidate._id ? { ...candidate } : c)
        );
      });

      // Real-time notifications with PostgreSQL timestamps
      socketService.onNewNotification((notification) => {
        setNotifications(prev => [notification, ...prev]);
      });

      // PostgreSQL-specific real-time events
      socketService.onChatSessionStarted((session: ChatSession) => {
        console.log('Chat session started:', session);
        // Update candidate status in real-time
        setCandidates(prev => 
          prev.map(c => 
            c._id === session.candidateId 
              ? { ...c, hasChatStarted: true, status: 'screening' }
              : c
          )
        );
      });

      return () => {
        socketService.offNewMessage();
        socketService.offAiResponse();
        socketService.offCandidateUpdate();
        socketService.offNewNotification();
      };
    }
  }, [isAuthenticated]);

  // PostgreSQL-optimized search with debouncing
  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (isAuthenticated && searchQuery !== undefined) {
        setCandidateCurrentPage(1); // Reset to first page on search
        loadDashboardData();
      }
    }, 500); // 500ms debounce for PostgreSQL ILIKE queries

    return () => clearTimeout(searchTimer);
  }, [searchQuery, candidateFilter]);

  // Generate chat link for candidate (PostgreSQL UUID compatible)
  const generateChatLink = (candidate: Candidate): string => {
    const sessionId = `session_${candidate._id}_${Date.now()}`;
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      session: sessionId,
      candidate: candidate._id, // PostgreSQL UUID
      name: candidate.name,
      position: candidate.position
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  // Send chat link to candidate with PostgreSQL transaction support
  const sendChatLinkToCandidate = async (candidate: Candidate): Promise<string> => {
    try {
      if (!apiService || typeof apiService.createChatSession !== 'function' || typeof apiService.updateCandidate !== 'function') {
        throw new Error('API service not available');
      }
      
      // Create chat session (works in both real and mock mode)
      const session = await apiService.createChatSession(candidate._id);
      const chatLink = generateChatLink(candidate);
      
      // Update candidate with chat link (works in both real and mock mode)
      const updatedCandidate = await apiService.updateCandidate(candidate._id, {
        chatLink,
        chatSessionId: session.sessionId || `session_${candidate._id}_${Date.now()}`,
        status: 'screening',
        hasChatStarted: false
      });

      // Update local state
      setCandidates(prev => 
        prev.map(c => c._id === candidate._id ? { ...updatedCandidate, chatLink } : c)
      );

      // Create a notification about the chat link
      const notification = {
        _id: `notif_${Date.now()}`,
        type: 'chat_link' as const,
        title: 'Chat Link Generated',
        message: `Screening link created for ${candidate.name}`,
        createdAt: new Date().toISOString(),
        isRead: false,
        candidateName: candidate.name,
        candidateId: candidate._id,
        actionUrl: chatLink,
        priority: 'high' as const
      };

      setNotifications(prev => [notification, ...prev]);

      return chatLink;
    } catch (error) {
      // Only log in production or non-mock mode
      if (!apiService.isMockMode()) {
        console.error('Failed to send chat link:', error);
      }
      
      // In mock mode, still provide a working chat link even if the API call fails
      if (apiService && apiService.isMockMode()) {
        const chatLink = generateChatLink(candidate);
        
        // Update local state optimistically
        setCandidates(prev => 
          prev.map(c => c._id === candidate._id ? { 
            ...c, 
            chatLink,
            chatSessionId: `session_${candidate._id}_${Date.now()}`,
            status: 'screening' as const
          } : c)
        );

        return chatLink;
      }
      
      throw error;
    }
  };

  // Handle get started button click from landing page
  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  // Handle login with PostgreSQL authentication
  const handleLogin = async (credentials: { email: string; password: string; rememberMe: boolean }) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      if (!apiService || typeof apiService.login !== 'function') {
        throw new Error('API service not available');
      }
      
      const response = await apiService.login(credentials);
      
      setCurrentUser(response);
      setIsAuthenticated(true);
      
      // Check PostgreSQL connection status
      await checkDatabaseStatus();
      
      // Initialize Socket.IO connection
      await socketService.connect(response.token);
      
      // Load dashboard data
      await loadDashboardData();
      
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // PostgreSQL-specific error messages
        if (error.message.includes('connection')) {
          errorMessage = 'Database connection failed. Please try again later.';
          setDbStatus('disconnected');
        } else if (error.message.includes('authentication')) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        }
      }
      
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout with cleanup
  const handleLogout = () => {
    apiService.setAuthToken(null);
    socketService.disconnect();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveView('dashboard');
    setShowLandingPage(true);
    setCandidates([]);
    setNotifications([]);
    setDbStatus('unknown');
    setSearchQuery('');
    setCandidateCurrentPage(1);
  };

  // Handle user profile update with PostgreSQL validation
  const handleUpdateUser = async (updatedUser: Partial<User>) => {
    try {
      if (!apiService || typeof apiService.updateProfile !== 'function') {
        throw new Error('API service not available');
      }
      
      const response = await apiService.updateProfile(updatedUser);
      setCurrentUser(response);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  // Function to add new candidate from resume upload with PostgreSQL foreign key
  const addCandidateFromResume = async (candidateData: Omit<Candidate, '_id' | 'appliedDate' | 'status' | 'isShortlisted'>) => {
    try {
      if (!apiService || typeof apiService.createCandidate !== 'function') {
        throw new Error('API service not available');
      }
      
      const newCandidate = await apiService.createCandidate({
        ...candidateData,
        status: 'pending',
        isShortlisted: false,
        addedBy: currentUser?._id // PostgreSQL foreign key
      });

      setCandidates(prev => [newCandidate, ...prev]);
      setSelectedCandidate(newCandidate);
      setActiveView('candidates');
      setCandidateFilter('all');

      // Update metrics immediately
      setMetrics(prev => ({ 
        ...prev, 
        totalCandidates: prev.totalCandidates + 1,
        pending: prev.pending + 1
      }));

      // Automatically send chat link after PostgreSQL commit
      setTimeout(async () => {
        try {
          await sendChatLinkToCandidate(newCandidate);
        } catch (error) {
          console.error('Failed to send chat link automatically:', error);
        }
      }, 1000);

      return newCandidate;
    } catch (error) {
      console.error('Failed to create candidate:', error);
      throw error;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'screening':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'interview':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'upload':
        return <Upload className="h-4 w-4 text-orange-500" />;
      case 'analysis':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'chat_link':
        return <Link className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // PostgreSQL timestamp formatting
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      if (!apiService || typeof apiService.markNotificationRead !== 'function') {
        throw new Error('API service not available');
      }
      await apiService.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!apiService || typeof apiService.markAllNotificationsRead !== 'function') {
        throw new Error('API service not available');
      }
      await apiService.markAllNotificationsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      if (!apiService || typeof apiService.deleteNotification !== 'function') {
        throw new Error('API service not available');
      }
      await apiService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    switch (notification.type) {
      case 'application':
      case 'upload':
        setActiveView('candidates');
        break;
      case 'chat_link':
        setActiveView('chatlinks');
        break;
      case 'screening':
        setActiveView('chat');
        break;
      case 'interview':
        setActiveView('dashboard');
        break;
      case 'analysis':
        setActiveView('dashboard');
        break;
    }
  };

  const handleMetricClick = (filterType: typeof candidateFilter) => {
    setCandidateFilter(filterType);
    setCandidateCurrentPage(1); // Reset pagination
    setActiveView('candidates');
  };

  // Update candidate status with PostgreSQL transaction
  const updateCandidateStatus = async (candidateId: string, newStatus: Candidate['status']) => {
    try {
      if (!apiService || typeof apiService.updateCandidate !== 'function') {
        throw new Error('API service not available');
      }
      
      const updatedCandidate = await apiService.updateCandidate(candidateId, {
        status: newStatus,
        isShortlisted: newStatus === 'shortlisted'
      });

      setCandidates(prev => 
        prev.map(candidate => 
          candidate._id === candidateId ? updatedCandidate : candidate
        )
      );

      // Update metrics optimistically
      const oldCandidate = candidates.find(c => c._id === candidateId);
      if (oldCandidate && oldCandidate.status !== newStatus) {
        setMetrics(prev => ({
          ...prev,
          [oldCandidate.status]: Math.max(0, prev[oldCandidate.status as keyof DashboardMetrics] as number - 1),
          [newStatus]: (prev[newStatus as keyof DashboardMetrics] as number) + 1
        }));
      }
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      throw error;
    }
  };

  // Handle search input with PostgreSQL ILIKE support
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  const renderActiveView = () => {
    const isLoadingData = candidatesState.loading || notificationsState.loading || metricsState.loading;
    
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardOverview 
            onNavigate={setActiveView} 
            onSelectCandidate={setSelectedCandidate}
            candidates={candidates}
            metrics={metrics}
            onMetricClick={handleMetricClick}
            loading={isLoadingData}
          />
        );
      case 'upload':
        return (
          <FileUpload 
            onNavigate={setActiveView} 
            onSelectCandidate={setSelectedCandidate}
            onCandidateCreated={addCandidateFromResume}
          />
        );
      case 'chat':
        return <ChatInterface />;
      case 'candidates':
        return (
          <CandidateDashboard 
            onSelectCandidate={setSelectedCandidate}
            initialFilter={candidateFilter}
            onFilterChange={setCandidateFilter}
            candidates={candidates}
            onUpdateCandidateStatus={updateCandidateStatus}
            onSendChatLink={sendChatLinkToCandidate}
            loading={candidatesState.loading}
          />
        );
      case 'chatlinks':
        return (
          <ChatLinkManager 
            candidates={candidates}
            onSendChatLink={sendChatLinkToCandidate}
          />
        );
      case 'viewer':
        return <ResumeViewer candidate={selectedCandidate} />;
      case 'settings':
        return <SettingsPanel />;
      case 'profile':
        return (
          <ProfileSettings 
            user={currentUser!}
            onUpdateUser={handleUpdateUser}
            onClose={() => setActiveView('dashboard')}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <DashboardOverview 
            onNavigate={setActiveView} 
            onSelectCandidate={setSelectedCandidate}
            candidates={candidates}
            metrics={metrics}
            onMetricClick={handleMetricClick}
            loading={isLoadingData}
          />
        );
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'chat', label: 'Screening', icon: MessageCircle },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'chatlinks', label: 'Chat Links', icon: Link },
    { id: 'viewer', label: 'Resume Viewer', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Show demo chat if demo mode is active
  if (showDemoChat) {
    return (
      <CandidateChat
        sessionId="demo_session_123"
        candidateId="demo_candidate"
        candidateName="Alex Demo"
        position="Senior Software Engineer"
        companyName="TechCorp"
      />
    );
  }

  // Show candidate chat interface if URL parameters are present
  if (candidateChatMode) {
    return (
      <CandidateChat
        sessionId={candidateChatMode.sessionId}
        candidateId={candidateChatMode.candidateId}
        candidateName={candidateChatMode.candidateName}
        position={candidateChatMode.position}
        companyName="TechCorp"
      />
    );
  }

  // Show landing page first
  if (showLandingPage) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={loginError}
      />
    );
  }

  // Show dashboard if authenticated
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ backgroundColor: '#F0F4F8' }}>
        <Sidebar className="border-r" style={{ backgroundColor: '#F0F4F8', borderColor: 'rgba(20, 30, 48, 0.1)' }}>
          <SidebarHeader className="border-b px-6 py-4" style={{ borderColor: 'rgba(20, 30, 48, 0.1)', backgroundColor: '#141E30' }}>
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                <img 
                  src={thunderLogo} 
                  alt="Thunder Logo" 
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg" />
              </div>
              <div>
                <h1 className="font-semibold" style={{ color: '#F0F4F8' }}>Resume Screener</h1>
                <p className="text-xs" style={{ color: '#F0F4F8', opacity: 0.7 }}>HR Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4 py-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start hover:bg-primary/10"
                    style={{ 
                      backgroundColor: activeView === item.id ? '#141E30' : 'transparent',
                      color: activeView === item.id ? '#F0F4F8' : '#141E30'
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.id === 'candidates' && candidateFilter !== 'all' && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {candidateFilter}
                      </Badge>
                    )}
                    {item.id === 'chatlinks' && (
                      <Badge variant="secondary" className="ml-auto text-xs" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a' }}>
                        {candidates.filter(c => c.chatLink).length}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="border-b px-6 py-4" style={{ backgroundColor: '#141E30', borderColor: 'rgba(20, 30, 48, 0.2)' }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <SidebarTrigger style={{ color: '#F0F4F8' }} />
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#64748b' }} />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-10 w-full"
                    style={{ backgroundColor: '#F0F4F8', border: 'none' }}
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 flex-shrink-0">
                {/* Enhanced Connection Status */}
                {!isOnline && (
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-800">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm">Offline</span>
                  </div>
                )}

                {dbStatus === 'disconnected' && isOnline && (
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Demo Mode</span>
                  </div>
                )}

                {/* Enhanced Refresh Button with Database Check */}
                <Button
                  onClick={async () => {
                    // Try to reconnect if in mock mode
                    if (apiService && typeof apiService.isMockMode === 'function' && apiService.isMockMode()) {
                      try {
                        const reconnected = await apiService.retryConnection();
                        if (reconnected) {
                          console.log('✅ Backend connection restored');
                        }
                      } catch (reconnectError) {
                        // Silently handle reconnection failures in demo mode
                      }
                    }
                    
                    // Also try socket reconnection
                    if (socketService && typeof socketService.isMockMode === 'function' && socketService.isMockMode()) {
                      try {
                        await socketService.retryConnection(currentUser?.token || localStorage.getItem('hr_token'));
                      } catch (socketError) {
                        // Silently handle socket reconnection failures
                      }
                    }
                    
                    await checkDatabaseStatus();
                    await loadDashboardData();
                  }}
                  variant="outline"
                  size="sm"
                  style={{ borderColor: '#F0F4F8', color: '#F0F4F8' }}
                  disabled={candidatesState.loading || notificationsState.loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${(candidatesState.loading || notificationsState.loading) ? 'animate-spin' : ''}`} />
                  {apiService && typeof apiService.isMockMode === 'function' && apiService.isMockMode() ? 'Check Backend' : 'Refresh'}
                </Button>

                {/* Enhanced Live Demo Button */}
                <Button
                  onClick={() => {
                    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=chat`;
                    
                    // Enhanced demo launch with better error handling
                    try {
                      const newWindow = window.open(demoUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
                      
                      // Check if popup was blocked with timeout
                      setTimeout(() => {
                        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                          // Copy to clipboard as fallback
                          navigator.clipboard.writeText(demoUrl).then(() => {
                            const message = 'Popup blocked! Demo link copied to clipboard.\n\nPaste it in a new tab to experience the live candidate chat interface.';
                            alert(message);
                          }).catch(() => {
                            // Final fallback: navigate in current window
                            if (confirm('Unable to open demo in new tab. Open in current window instead?')) {
                              window.location.href = demoUrl;
                            }
                          });
                        }
                      }, 100);
                    } catch (error) {
                      // Error fallback: copy to clipboard
                      navigator.clipboard.writeText(demoUrl).then(() => {
                        alert('Demo link copied to clipboard! Paste it in a new tab to try the live candidate chat.');
                      }).catch(() => {
                        console.error('Failed to copy demo link:', error);
                        if (confirm('Unable to open demo. Navigate to demo in current window?')) {
                          window.location.href = demoUrl;
                        }
                      });
                    }
                  }}
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-3 py-2 rounded-md text-sm whitespace-nowrap"
                >
                  <Play className="h-4 w-4 mr-1.5" />
                  Live Chat
                </Button>

                {/* Enhanced Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative" style={{ color: '#F0F4F8' }}>
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-96">
                    <div className="flex items-center justify-between p-3">
                      <DropdownMenuLabel className="p-0">
                        Notifications ({unreadCount} unread)
                      </DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={markAllAsRead}
                          className="text-xs h-auto p-1"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-80">
                      <div className="space-y-1">
                        {notificationsState.loading ? (
                          <div className="p-4 text-center">
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Loading notifications...</p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                                !notification.isRead ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm truncate ${
                                      !notification.isRead ? 'font-medium' : ''
                                    }`}>
                                      {notification.title}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {getTimeAgo(notification.createdAt)}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(notification._id);
                                        }}
                                        className="h-auto w-auto p-1 opacity-0 group-hover:opacity-100 hover:text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {notification.message}
                                  </p>
                                  
                                  {/* Enhanced notification actions for chat links */}
                                  {notification.type === 'chat_link' && notification.actionUrl && (
                                    <div className="flex items-center space-x-2 mt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          copyToClipboard(notification.actionUrl!);
                                        }}
                                        className="text-xs h-6"
                                      >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy Link
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(notification.actionUrl, '_blank');
                                        }}
                                        className="text-xs h-6"
                                      >
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Test
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {!notification.isRead && (
                                    <div className="flex items-center mt-2">
                                      <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                                      <span className="text-xs text-primary">New</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                    {notifications.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                          <Button 
                            variant="ghost" 
                            className="w-full text-xs h-8"
                            onClick={() => setActiveView('dashboard')}
                          >
                            View all notifications
                          </Button>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatar} />
                        <AvatarFallback>
                          {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium" style={{ color: '#F0F4F8' }}>
                          {currentUser?.name}
                        </span>
                        <span className="text-xs" style={{ color: '#F0F4F8', opacity: 0.7 }}>
                          {currentUser?.role}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4" style={{ color: '#F0F4F8' }} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    {/* Profile Header */}
                    <div className="p-4 border-b">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={currentUser?.avatar} />
                          <AvatarFallback className="text-lg">
                            {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold" style={{ color: '#141E30' }}>{currentUser?.name}</p>
                          <p className="text-sm" style={{ color: '#64748b' }}>{currentUser?.role}</p>
                          <p className="text-xs" style={{ color: '#64748b' }}>{currentUser?.email}</p>
                        </div>
                      </div>
                      
                      {/* Quick Info */}
                      <div className="mt-3 space-y-2">
                        {currentUser?.phone && (
                          <div className="flex items-center space-x-2 text-xs" style={{ color: '#64748b' }}>
                            <Phone className="h-3 w-3" />
                            <span>{currentUser.phone}</span>
                          </div>
                        )}
                        {currentUser?.location && (
                          <div className="flex items-center space-x-2 text-xs" style={{ color: '#64748b' }}>
                            <MapPin className="h-3 w-3" />
                            <span>{currentUser.location}</span>
                          </div>
                        )}
                        {currentUser?.department && (
                          <div className="flex items-center space-x-2 text-xs" style={{ color: '#64748b' }}>
                            <Users className="h-3 w-3" />
                            <span>{currentUser.department}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <DropdownMenuSeparator />
                    
                    {/* Profile Actions */}
                    <DropdownMenuItem onClick={() => setActiveView('profile')} className="p-3">
                      <Edit3 className="h-4 w-4 mr-3" />
                      <div>
                        <p className="font-medium">Edit Profile</p>
                        <p className="text-xs text-muted-foreground">Update your personal information</p>
                      </div>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => setActiveView('settings')} className="p-3">
                      <Settings className="h-4 w-4 mr-3" />
                      <div>
                        <p className="font-medium">Account Settings</p>
                        <p className="text-xs text-muted-foreground">Manage preferences and security</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive p-3">
                      <LogOut className="h-4 w-4 mr-3" />
                      <div>
                        <p className="font-medium">Sign Out</p>
                        <p className="text-xs opacity-70">Sign out of your account</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto" style={{ backgroundColor: '#F0F4F8' }}>
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#141E30' }} />
                  <p style={{ color: '#64748b' }}>
                    {apiService && apiService.isMockMode() 
                      ? 'Loading demo data...' 
                      : 'Loading dashboard...'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Enhanced Error State - only show in production */}
            {apiService && typeof apiService.isMockMode === 'function' && !apiService.isMockMode() && (candidatesState.error || notificationsState.error || metricsState.error) && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Connection Error:</strong> {candidatesState.error || notificationsState.error || metricsState.error}
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={async () => {
                        // Try to reconnect API service
                        await apiService.retryConnection();
                        // Try to reconnect socket service
                        if (socketService && typeof socketService.retryConnection === 'function') {
                          try {
                            await socketService.retryConnection(currentUser?.token || localStorage.getItem('hr_token'));
                          } catch (socketError) {
                            console.error('Socket reconnection failed:', socketError);
                          }
                        }
                        // Check status and reload data
                        await checkDatabaseStatus();
                        await loadDashboardData();
                      }}
                      className="text-xs"
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      Retry Connection
                    </Button>
                    <span className="text-xs opacity-70">
                      Attempting to reconnect to backend services
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            )}



            {/* Development Mock Mode Alert - Less Intrusive */}
            {dbStatus === 'disconnected' && !isLoading && apiService && typeof apiService.isMockMode === 'function' && apiService.isMockMode() && (
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Zap className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Demo Mode:</strong> All features fully functional with sample data
                    </span>
                    <div className="flex items-center space-x-2 text-xs">
                      <span>🚀 Perfect for testing and exploration</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={async () => {
                        await checkDatabaseStatus();
                        await loadDashboardData();
                      }}
                      className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Check for Backend
                    </Button>
                    <span className="text-xs opacity-70">
                      Click to check if backend server is now available
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Actions Bar for Chat Links */}
            {!isLoading && activeView !== 'chatlinks' && candidates.filter(c => c.chatLink).length > 0 && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <Zap className="h-4 w-4 text-green-600" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-green-800">
                    <strong>{candidates.filter(c => c.chatLink).length} chat links</strong> generated and ready to share with candidates!
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveView('chatlinks')}
                    className="border-green-300 text-green-700 hover:bg-green-100 ml-4"
                  >
                    <Link className="h-4 w-4 mr-1" />
                    View All Links
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {!isLoading && renderActiveView()}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </SidebarProvider>
  );
}