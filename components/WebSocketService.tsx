// WebSocket service for real-time candidate screening
export interface ChatMessage {
  id: string;
  type: 'candidate' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  candidateId: string;
  sessionId: string;
  metadata?: {
    score?: number;
    question?: string;
    isComplete?: boolean;
  };
}

export interface CandidateSession {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  email: string;
  status: 'active' | 'completed' | 'expired';
  startTime: Date;
  endTime?: Date;
  messages: ChatMessage[];
  aiScore?: number;
  isComplete: boolean;
  summary?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  // Simulate WebSocket connection (in production, this would be a real WebSocket server)
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Simulate WebSocket connection
      this.simulateWebSocket();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private simulateWebSocket() {
    // Simulate WebSocket behavior for demo purposes
    this.ws = {
      readyState: WebSocket.OPEN,
      close: () => {},
      send: (data: string) => {
        const message = JSON.parse(data);
        this.handleMessage(message);
      }
    } as WebSocket;

    this.emit('connected');
    console.log('WebSocket connected (simulated)');
  }

  private handleMessage(message: any) {
    // Simulate AI responses and processing
    setTimeout(() => {
      switch (message.type) {
        case 'join_session':
          this.emit('session_joined', {
            sessionId: message.sessionId,
            candidateId: message.candidateId
          });
          break;
        
        case 'candidate_message':
          // Simulate AI response generation
          this.generateAIResponse(message);
          break;
        
        case 'start_screening':
          this.startScreeningProcess(message);
          break;
      }
    }, 1000 + Math.random() * 2000); // Simulate network delay
  }

  private generateAIResponse(candidateMessage: ChatMessage) {
    const aiResponses = this.getAIResponses(candidateMessage.content);
    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: response.content,
      timestamp: new Date(),
      candidateId: candidateMessage.candidateId,
      sessionId: candidateMessage.sessionId,
      metadata: {
        question: response.followUp,
        score: response.score
      }
    };

    this.emit('ai_response', aiMessage);
  }

  private getAIResponses(candidateInput: string) {
    const input = candidateInput.toLowerCase();
    
    if (input.includes('experience') || input.includes('year')) {
      return [
        {
          content: "That's great experience! Can you tell me about a challenging project you've worked on recently?",
          followUp: "project_challenge",
          score: 8
        },
        {
          content: "Excellent background! What technologies are you most passionate about working with?",
          followUp: "tech_passion",
          score: 7
        }
      ];
    }
    
    if (input.includes('react') || input.includes('javascript') || input.includes('frontend')) {
      return [
        {
          content: "Perfect! We work extensively with React. How do you approach state management in large applications?",
          followUp: "state_management",
          score: 9
        }
      ];
    }
    
    if (input.includes('team') || input.includes('collaborate')) {
      return [
        {
          content: "Team collaboration is crucial here. Can you describe how you handle code reviews and feedback?",
          followUp: "code_reviews",
          score: 8
        }
      ];
    }

    // Default responses
    return [
      {
        content: "That's interesting! Can you elaborate on that a bit more?",
        followUp: "elaborate",
        score: 6
      },
      {
        content: "Great answer! Tell me about your problem-solving approach when facing technical challenges.",
        followUp: "problem_solving",
        score: 7
      }
    ];
  }

  private startScreeningProcess(message: any) {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Hello ${message.candidateName} 👋! Thanks for your interest in the ${message.position} role. I'm here to ask you a few quick questions to better understand your background. This should only take about 5-10 minutes. Ready to get started?`,
      timestamp: new Date(),
      candidateId: message.candidateId,
      sessionId: message.sessionId,
      metadata: {
        question: 'introduction'
      }
    };

    this.emit('screening_started', welcomeMessage);
  }

  // Public methods
  sendMessage(message: ChatMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'candidate_message',
        ...message
      }));
    }
  }

  joinSession(sessionId: string, candidateId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'join_session',
        sessionId,
        candidateId
      }));
    }
  }

  startScreening(sessionId: string, candidateId: string, candidateName: string, position: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'start_screening',
        sessionId,
        candidateId,
        candidateName,
        position
      }));
    }
  }

  // Event handling
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
export const wsService = new WebSocketService();