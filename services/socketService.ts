// Safe environment variable access for browser environments
const getEnvVar = (name: string, fallback: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[name] || fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
};

// Type definitions
interface ChatMessage {
  id: string;
  type: 'candidate' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  sessionId: string;
  metadata?: {
    score?: number;
    question?: string;
    isComplete?: boolean;
  };
}

class SocketService {
  private socket: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnected = false;
  private isDevelopment = getEnvVar('NODE_ENV', 'development') === 'development';
  private mockMode = false;
  private connectionTimeout: NodeJS.Timeout | null = null;

  async connect(token?: string) {
    // Clear any existing timeout
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }

    try {
      // Dynamic import for socket.io-client to avoid build issues
      const { io } = await import('socket.io-client');
      
      const socketUrl = getEnvVar('REACT_APP_SOCKET_URL', 'http://localhost:5000');
      
      this.socket = io(socketUrl, {
        auth: token ? { token } : undefined,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 3000, // Reduced timeout for faster fallback
      });

      // Set a connection timeout for development mode
      if (this.isDevelopment) {
        this.connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            console.info('🎯 Socket: Demo mode for real-time features');
            this.enableMockMode();
          }
        }, 3000); // 3 second timeout in development
      }

      this.socket.on('connect', () => {
        console.log('✅ Real-time connection established');
        this.isConnected = true;
        this.mockMode = false;
        this.reconnectAttempts = 0;
        
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
      });

      this.socket.on('disconnect', (reason: string) => {
        this.isConnected = false;
        
        // If disconnected in development, switch to mock mode
        if (this.isDevelopment && !this.mockMode) {
          console.info('🎯 Real-time: Switching to demo mode');
          this.enableMockMode();
        }
      });

      this.socket.on('reconnect', (attemptNumber: number) => {
        console.log('✅ Real-time connection restored');
        this.isConnected = true;
        this.mockMode = false;
        
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
      });

      this.socket.on('reconnect_error', (error: Error) => {
        // Enable mock mode after failed reconnection attempts in development
        if (this.isDevelopment && this.reconnectAttempts >= this.maxReconnectAttempts - 1) {
          this.enableMockMode();
        }
      });

      this.socket.on('connect_error', (error: Error) => {
        // In development, fall back to mock mode immediately
        if (this.isDevelopment) {
          this.enableMockMode();
        }
      });

      return this.socket;
    } catch (error) {
      // Enable mock mode in development
      if (this.isDevelopment) {
        console.info('🎯 Real-time: Demo mode active');
        this.enableMockMode();
      }
      
      return null;
    }
  }

  private enableMockMode() {
    this.mockMode = true;
    this.isConnected = false;
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    // Disconnect socket if it exists
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  disconnect() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.mockMode = false;
  }

  // Chat functionality
  joinChatSession(sessionId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_chat_session', sessionId);
      console.log('🔗 Joined chat session:', sessionId);
    } else if (this.mockMode) {
      console.log('🔗 [Mock] Joined chat session:', sessionId);
    }
  }

  leaveChatSession(sessionId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat_session', sessionId);
      console.log('👋 Left chat session:', sessionId);
    } else if (this.mockMode) {
      console.log('👋 [Mock] Left chat session:', sessionId);
    }
  }

  sendCandidateMessage(message: ChatMessage) {
    if (this.socket && this.isConnected) {
      this.socket.emit('candidate_message', message);
    } else if (this.mockMode) {
      console.log('📤 [Mock] Candidate message sent:', message);
      // Simulate AI response in mock mode
      setTimeout(() => {
        this.simulateMockAiResponse(message);
      }, 1000 + Math.random() * 2000);
    }
  }

  // Event listeners
  onNewMessage(callback: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onAiResponse(callback: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on('ai_response', callback);
    } else if (this.mockMode) {
      // Store callback for mock mode
      this.mockAiResponseCallback = callback;
    }
  }

  onSessionUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('session_update', callback);
    }
  }

  onTypingIndicator(callback: (data: { sessionId: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('typing_indicator', callback);
    }
  }

  // Remove event listeners
  offNewMessage(callback?: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.off('new_message', callback);
    }
  }

  offAiResponse(callback?: (message: ChatMessage) => void) {
    if (this.socket) {
      this.socket.off('ai_response', callback);
    } else if (this.mockMode) {
      this.mockAiResponseCallback = undefined;
    }
  }

  offSessionUpdate(callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off('session_update', callback);
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  isMockMode(): boolean {
    return this.mockMode;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // HR Dashboard real-time updates
  onCandidateUpdate(callback: (candidate: any) => void) {
    if (this.socket && this.isConnected) {
      this.socket.on('candidate_update', callback);
    } else if (this.mockMode && this.isDevelopment) {
      // Simulate candidate updates in mock mode
      console.log('📊 [Mock] Candidate update listener registered');
    }
  }

  onNewNotification(callback: (notification: any) => void) {
    if (this.socket && this.isConnected) {
      this.socket.on('new_notification', callback);
    } else if (this.mockMode && this.isDevelopment) {
      // Simulate notifications in mock mode
      console.log('🔔 [Mock] Notification listener registered');
    }
  }

  onChatSessionStarted(callback: (session: any) => void) {
    if (this.socket && this.isConnected) {
      this.socket.on('chat_session_started', callback);
    } else if (this.mockMode && this.isDevelopment) {
      console.log('💬 [Mock] Chat session started listener registered');
    }
  }

  onChatSessionCompleted(callback: (session: any) => void) {
    if (this.socket && this.isConnected) {
      this.socket.on('chat_session_completed', callback);
    } else if (this.mockMode && this.isDevelopment) {
      console.log('✅ [Mock] Chat session completed listener registered');
    }
  }

  // Mock mode functionality for development
  private mockAiResponseCallback?: (message: ChatMessage) => void;
  
  private simulateMockAiResponse(originalMessage: ChatMessage) {
    if (!this.mockAiResponseCallback) return;

    const mockResponses = [
      "Thank you for sharing that with me. Can you tell me more about your experience with team leadership?",
      "That's interesting! How do you typically approach problem-solving in challenging situations?",
      "I'd love to hear more about your technical background. What technologies are you most passionate about?",
      "Great answer! Can you walk me through a specific project where you demonstrated these skills?",
      "That sounds like valuable experience. How do you stay current with industry trends and developments?",
      "Excellent! Now, let me ask you about your career goals. Where do you see yourself in the next few years?",
      "Can you describe a time when you had to work under pressure? How did you handle it?",
      "What motivates you most in your professional work?",
      "How do you handle feedback and criticism?",
      "What would you say is your greatest professional achievement so far?"
    ];

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    const mockAiMessage: ChatMessage = {
      id: 'mock_ai_' + Date.now(),
      type: 'ai',
      content: randomResponse,
      timestamp: new Date(),
      sessionId: originalMessage.sessionId,
      metadata: {
        score: Math.floor(Math.random() * 20) + 70, // Random score between 70-90
        isComplete: false
      }
    };

    this.mockAiResponseCallback(mockAiMessage);
  }

  // Mock typing indicator
  simulateTyping(sessionId: string, duration: number = 2000) {
    if (this.mockMode) {
      console.log('⌨️ [Mock] AI is typing...');
      // You could emit typing events here if needed
    }
  }

  // Method to manually retry connection
  retryConnection(token?: string) {
    if (this.mockMode && this.isDevelopment) {
      console.log('🔄 Attempting to reconnect...');
      this.mockMode = false;
      this.reconnectAttempts = 0;
      return this.connect(token);
    }
  }

  // Get connection status for UI
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' | 'mock' {
    if (this.mockMode) return 'mock';
    if (this.isConnected) return 'connected';
    if (this.socket && !this.isConnected) return 'connecting';
    return 'disconnected';
  }
}

export default new SocketService();