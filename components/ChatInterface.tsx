import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, Bot, User, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  candidate?: string;
  score?: number;
}

interface Candidate {
  id: string;
  name: string;
  status: 'pending' | 'screening' | 'completed';
  score?: number;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI screening assistant. I can help you conduct initial interviews with candidates. Select a candidate to begin the screening process.',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVoiceBotMode, setIsVoiceBotMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const mockCandidates: Candidate[] = [
    { id: '1', name: 'Sarah Johnson', status: 'pending' },
    { id: '2', name: 'Michael Chen', status: 'screening', score: 85 },
    { id: '3', name: 'Emily Rodriguez', status: 'completed', score: 92 },
    { id: '4', name: 'David Kim', status: 'pending' },
  ];

  const mockAIResponses = [
    "That's a great point about your experience. Can you tell me about a specific challenge you faced in your previous role and how you overcame it?",
    "I see you have experience with React. How would you handle state management in a large-scale application?",
    "Interesting background! What motivated you to apply for this position specifically?",
    "Can you walk me through your approach to debugging a complex issue in production?",
    "Tell me about a time when you had to learn a new technology quickly. How did you approach it?",
    "Based on your resume, I can see you've worked on several projects. Which one are you most proud of and why?",
    "How do you stay updated with the latest trends and technologies in your field?",
    "What would you say is your greatest strength as a developer?",
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedCandidate) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      candidate: selectedCandidate
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
        timestamp: new Date(),
        candidate: selectedCandidate,
        score: Math.floor(Math.random() * 20) + 80 // Random score between 80-100
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startScreening = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    const candidate = mockCandidates.find(c => c.id === candidateId);
    
    const screeningMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Great! I'm now ready to screen ${candidate?.name}. Let's start with some basic questions. Hello ${candidate?.name}, thank you for your interest in this position. Can you start by telling me a bit about yourself and your background?`,
      timestamp: new Date(),
      candidate: candidateId
    };

    setMessages(prev => [...prev, screeningMessage]);
  };

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
  };

  const toggleVoiceBot = () => {
    setIsVoiceBotMode(!isVoiceBotMode);
    if (!isVoiceBotMode) {
      // Switching to voice mode
      setInputValue('');
      // Add a message indicating voice mode is active
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '🎤 Voice mode activated! You can now speak your responses. Click the microphone button to start speaking, or switch back to text mode anytime.',
        timestamp: new Date(),
        candidate: selectedCandidate
      };
      setMessages(prev => [...prev, voiceMessage]);
    } else {
      // Switching back to text mode
      setIsListening(false);
      const textMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '⌨️ Text mode activated! You can now type your responses.',
        timestamp: new Date(),
        candidate: selectedCandidate
      };
      setMessages(prev => [...prev, textMessage]);
    }
  };

  const toggleListening = () => {
    if (!isVoiceBotMode) return;
    
    setIsListening(!isListening);
    
    if (!isListening) {
      // Start listening simulation
      const listeningMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '🎧 I\'m listening... Please speak your response.',
        timestamp: new Date(),
        candidate: selectedCandidate
      };
      setMessages(prev => [...prev, listeningMessage]);
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        const simulatedVoiceInput = "This is a simulated voice response. In a real implementation, this would be the transcribed speech.";
        
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: `🎤 ${simulatedVoiceInput}`,
          timestamp: new Date(),
          candidate: selectedCandidate
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsListening(false);
        
        // AI response
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)],
            timestamp: new Date(),
            candidate: selectedCandidate,
            score: Math.floor(Math.random() * 20) + 80
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
        
      }, 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCandidates.map(candidate => (
                <div
                  key={candidate.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCandidate === candidate.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => startScreening(candidate.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{candidate.name}</p>
                    <Badge 
                      variant={
                        candidate.status === 'completed' ? 'default' :
                        candidate.status === 'screening' ? 'secondary' : 'outline'
                      }
                    >
                      {candidate.status}
                    </Badge>
                  </div>
                  {candidate.score && (
                    <p className="text-sm text-muted-foreground">Score: {candidate.score}%</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedCandidate 
                  ? `Screening: ${mockCandidates.find(c => c.id === selectedCandidate)?.name}`
                  : 'AI Screening Assistant'
                }
              </CardTitle>
              {selectedCandidate && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isVoiceActive ? "default" : "outline"}
                    size="sm"
                    onClick={toggleVoice}
                  >
                    {isVoiceActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isCallActive ? "destructive" : "outline"}
                    size="sm"
                    onClick={toggleCall}
                  >
                    {isCallActive ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
            
            {/* Voice Bot Mode Indicator */}
            {isVoiceBotMode && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Voice Bot Mode Active</span>
                {isListening && (
                  <Badge variant="secondary" className="animate-pulse">
                    Listening...
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.type === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`inline-block p-3 rounded-lg max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        {message.score && (
                          <>
                            <span className="mx-2">•</span>
                            <Badge variant="outline" className="text-xs">
                              Score: {message.score}%
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
              {!isVoiceBotMode ? (
                <>
                  <Input
                    placeholder={
                      selectedCandidate 
                        ? "Type your response..." 
                        : "Select a candidate to start screening"
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!selectedCandidate}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!selectedCandidate || !inputValue.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <Button
                    variant={isListening ? "destructive" : "default"}
                    size="lg"
                    onClick={toggleListening}
                    disabled={!selectedCandidate || isListening}
                    className="flex items-center space-x-2"
                  >
                    {isListening ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        <span>Click to Speak</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Voice Bot Toggle Button */}
              <Button
                variant={isVoiceBotMode ? "default" : "outline"}
                onClick={toggleVoiceBot}
                disabled={!selectedCandidate}
                className="flex items-center space-x-2"
              >
                {isVoiceBotMode ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span className="hidden sm:inline">Text Mode</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Voice Bot</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Voice Bot Instructions */}
            {isVoiceBotMode && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  💡 <strong>Voice Mode Tips:</strong> Click "Click to Speak" and speak clearly. 
                  The AI will transcribe your speech and respond accordingly. 
                  You can switch back to text mode anytime.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}