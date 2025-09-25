import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import thunderLogo from 'figma:asset/94d07408ca5ca37c8e380c9ef62b9d0c31ab7c89.png';

interface Message {
  id: string;
  type: 'candidate' | 'ai';
  content: string;
  timestamp: Date;
  score?: number;
}

interface CandidateChatProps {
  sessionId: string;
  candidateId: string;
  candidateName: string;
  position: string;
  companyName?: string;
}

export function CandidateChat({ 
  sessionId, 
  candidateId, 
  candidateName, 
  position,
  companyName = "TechCorp" 
}: CandidateChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // AI Question Bank based on position type
  const getQuestionBank = (position: string) => {
    const positionLower = position.toLowerCase();
    
    if (positionLower.includes('frontend') || positionLower.includes('react')) {
      return [
        "Tell me about your experience with React and modern JavaScript frameworks.",
        "How do you approach responsive design and ensuring cross-browser compatibility?",
        "Describe a challenging frontend project you've worked on recently.",
        "How do you handle state management in large React applications?",
        "What's your experience with testing frontend applications?"
      ];
    } else if (positionLower.includes('backend') || positionLower.includes('api')) {
      return [
        "Tell me about your experience with backend development and API design.",
        "How do you approach database design and optimization?",
        "Describe your experience with microservices architecture.",
        "How do you handle error handling and logging in your applications?",
        "What's your approach to API security and authentication?"
      ];
    } else if (positionLower.includes('fullstack') || positionLower.includes('full stack')) {
      return [
        "Tell me about your experience working across the full technology stack.",
        "How do you decide between different technology choices for a project?",
        "Describe a project where you built both frontend and backend components.",
        "How do you ensure good communication between frontend and backend systems?",
        "What's your approach to deployment and DevOps practices?"
      ];
    } else if (positionLower.includes('devops') || positionLower.includes('infrastructure')) {
      return [
        "Tell me about your experience with cloud platforms and infrastructure.",
        "How do you approach CI/CD pipeline design and implementation?",
        "Describe your experience with containerization and orchestration.",
        "How do you handle monitoring and alerting in production systems?",
        "What's your approach to infrastructure as code?"
      ];
    } else {
      return [
        "Tell me about your relevant experience for this role.",
        "What interests you most about this position?",
        "Describe a challenging project you've worked on recently.",
        "How do you approach learning new technologies or skills?",
        "What are you looking for in your next role?"
      ];
    }
  };

  const questionBank = getQuestionBank(position);

  // AI Response Generator
  const generateAIResponse = (userMessage: string, questionIndex: number): { content: string; score: number } => {
    const messageLower = userMessage.toLowerCase();
    let score = 5; // Base score
    
    // Score based on message quality
    if (userMessage.length > 50) score += 2;
    if (userMessage.length > 100) score += 1;
    if (messageLower.includes('experience') || messageLower.includes('project')) score += 2;
    if (messageLower.includes('challenge') || messageLower.includes('problem')) score += 2;
    if (messageLower.includes('team') || messageLower.includes('collaborate')) score += 1;
    
    // Position-specific scoring
    const positionLower = position.toLowerCase();
    if (positionLower.includes('frontend')) {
      if (messageLower.includes('react') || messageLower.includes('javascript') || messageLower.includes('css')) score += 2;
      if (messageLower.includes('responsive') || messageLower.includes('mobile')) score += 1;
    } else if (positionLower.includes('backend')) {
      if (messageLower.includes('api') || messageLower.includes('database') || messageLower.includes('server')) score += 2;
      if (messageLower.includes('security') || messageLower.includes('scalable')) score += 1;
    }

    // Cap score at 10
    score = Math.min(score, 10);

    // Generate appropriate responses
    const responses = [
      `That's great experience! ${questionBank[questionIndex + 1] || "Tell me more about your approach to problem-solving."}`,
      `Excellent! I can see you have solid experience. ${questionBank[questionIndex + 1] || "What motivates you in your work?"}`,
      `Thank you for sharing that. ${questionBank[questionIndex + 1] || "How do you stay updated with industry trends?"}`,
      `That's very relevant to what we're looking for. ${questionBank[questionIndex + 1] || "What are your career goals?"}`,
      `I appreciate the detailed response. ${questionBank[questionIndex + 1] || "Is there anything you'd like to know about our company or this role?"}`
    ];

    // Final question responses
    if (questionIndex >= questionBank.length - 1) {
      return {
        content: "Thank you for taking the time to chat with me! I have all the information I need. Our team will review your responses and get back to you within 2-3 business days. We appreciate your interest in joining our team!",
        score
      };
    }

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      score
    };
  };

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const welcomeMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hello ${candidateName}! 👋 Thanks for your interest in the ${position} role at ${companyName}. I'm here to ask you a few questions to better understand your background. This should only take about 5-10 minutes. Ready to get started?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      setIsLoading(false);
    };

    initializeChat();
  }, [candidateName, position, companyName]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when ready
  useEffect(() => {
    if (!isLoading && !isComplete) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [isLoading, isComplete]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isTyping || isComplete) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'candidate',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Check if this is the start response
    if (!sessionStarted) {
      setSessionStarted(true);
      
      // Add first real question
      setTimeout(() => {
        const firstQuestion: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: questionBank[0],
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, firstQuestion]);
        setIsTyping(false);
        setQuestionCount(1);
      }, 1000 + Math.random() * 1000);
      
      return;
    }

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content, questionCount - 1);
      
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        score: aiResponse.score
      };

      setMessages(prev => [...prev, aiMessage]);
      setCurrentScore(prev => Math.round((prev * (questionCount - 1) + aiResponse.score) / questionCount));
      setIsTyping(false);
      
      // Check if interview is complete
      if (questionCount >= questionBank.length) {
        setIsComplete(true);
      } else {
        setQuestionCount(prev => prev + 1);
      }
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F4F8' }}>
        <Card className="w-full max-w-md mx-4" style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-8 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <img 
                src={thunderLogo} 
                alt="Company Logo" 
                className="w-full h-full object-contain animate-pulse"
                style={{
                  filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))'
                }}
              />
            </div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: '#141E30' }}>
              Connecting to {companyName}
            </h2>
            <p style={{ color: '#64748b' }}>
              Setting up your screening session...
            </p>
            <div className="flex items-center justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F4F8' }}>
        <Card className="w-full max-w-lg mx-4" style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#141E30' }}>
              Screening Complete! 🎉
            </h2>
            <p style={{ color: '#64748b' }} className="mb-6">
              Thank you for completing the pre-screening chat, {candidateName}. 
              Our team will review your responses and get back to you soon.
            </p>
            
            {currentScore > 0 && (
              <div className="mb-6">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                  <Star className="h-5 w-5" style={{ color: '#f59e0b' }} />
                  <span className="font-semibold" style={{ color: '#f59e0b' }}>
                    Score: {currentScore}/10
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-3 text-sm" style={{ color: '#64748b' }}>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Your responses have been recorded</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>We'll contact you within 2-3 business days</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="h-4 w-4 text-purple-500" />
                <span>Check your email for next steps</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: '#F0F4F8' }}>
              <p className="text-sm font-medium mb-2" style={{ color: '#141E30' }}>
                What's Next?
              </p>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Our hiring team will review your screening responses along with your resume. 
                If you're a good fit, we'll reach out to schedule a more detailed interview.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#141E30', borderColor: 'rgba(240, 244, 248, 0.1)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}>
                <img 
                  src={thunderLogo} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain p-1"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))'
                  }}
                />
              </div>
              <div>
                <h1 className="font-semibold text-lg" style={{ color: '#F0F4F8' }}>{companyName}</h1>
                <p className="text-sm" style={{ color: '#F0F4F8', opacity: 0.8 }}>Pre-screening Interview</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-800 border-green-200"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Active
              </Badge>
              {currentScore > 0 && (
                <Badge variant="outline" style={{ borderColor: '#f59e0b', color: '#f59e0b', backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                  <Star className="h-3 w-3 mr-1" />
                  {currentScore}/10
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Info Panel */}
          <div className="lg:col-span-1">
            <Card style={{ backgroundColor: '#ffffff' }}>
              <CardHeader>
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-3">
                    <AvatarFallback className="text-xl" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)', color: '#141E30' }}>
                      {candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold" style={{ color: '#141E30' }}>{candidateName}</h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>{position}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: '#141E30' }}>Session Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((questionCount / questionBank.length) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                    {questionCount} of {questionBank.length} questions
                  </p>
                </div>
                
                <div className="pt-4 border-t" style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: '#141E30' }}>💡 Tips:</p>
                  <ul className="text-xs space-y-1" style={{ color: '#64748b' }}>
                    <li>• Be specific and detailed</li>
                    <li>• Share real examples</li>
                    <li>• Take your time to think</li>
                    <li>• Ask questions if unclear</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
              <CardHeader className="flex-shrink-0 border-b" style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                    <Bot className="h-5 w-5" style={{ color: '#141E30' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#141E30' }}>HR Assistant</h3>
                    <p className="text-sm" style={{ color: '#64748b' }}>
                      {isTyping ? "Typing..." : "Powered by Resume Screener"}
                    </p>
                  </div>
                  {isTyping && (
                    <div className="flex space-x-1">
                      <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.type === 'candidate' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className={message.type === 'candidate' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                          {message.type === 'candidate' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex-1 max-w-xs lg:max-w-md ${message.type === 'candidate' ? 'text-right' : ''}`}>
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.type === 'candidate'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : 'bg-muted'
                          }`}
                          style={{
                            backgroundColor: message.type === 'candidate' ? '#141E30' : '#e2e8f0',
                            color: message.type === 'candidate' ? '#F0F4F8' : '#141E30'
                          }}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs" style={{ color: '#64748b' }}>
                            {formatTime(message.timestamp)}
                          </p>
                          {message.score && (
                            <Badge variant="outline" className="text-xs" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                              +{message.score}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-secondary">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex-shrink-0 border-t p-4" style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                {!isComplete && (
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your response..."
                      disabled={isTyping}
                      className="flex-1"
                      style={{ backgroundColor: '#F0F4F8' }}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                      style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}
                    >
                      {isTyping ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
                
                {isComplete && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Interview completed! Thank you for your time.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}