import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Copy, 
  ExternalLink, 
  Mail, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Users,
  Link,
  Send,
  QrCode,
  Share,
  MessageCircle,
  Zap,
  Play,
  ArrowRight
} from 'lucide-react';

interface Candidate {
  _id: string; // PostgreSQL UUID converted to _id for compatibility
  name: string;
  email: string;
  position: string;
  chatLink?: string;
  chatSessionId?: string;
  status: string;
  score: number;
  appliedDate: string;
}

interface ChatLinkManagerProps {
  candidates: Candidate[];
  onSendChatLink: (candidate: Candidate) => string;
}

export function ChatLinkManager({ candidates, onSendChatLink }: ChatLinkManagerProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [demoStatus, setDemoStatus] = useState<string | null>(null);

  // Filter candidates with chat links or those who need them
  const candidatesWithLinks = candidates.filter(c => c.chatLink);
  const candidatesNeedingLinks = candidates.filter(c => !c.chatLink && c.status === 'pending');

  const filteredCandidates = candidatesWithLinks.filter(candidate => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(searchLower) ||
      candidate.email.toLowerCase().includes(searchLower) ||
      candidate.position.toLowerCase().includes(searchLower)
    );
  });

  const copyToClipboard = async (text: string, candidateId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(candidateId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleSendChatLink = async (candidate: Candidate) => {
    const chatLink = onSendChatLink(candidate);
    await copyToClipboard(chatLink, candidate._id);
  };

  // Enhanced demo chat functionality with better UX
  const openDemoChat = () => {
    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=chat`;
    
    setDemoStatus('Opening demo chat...');
    
    // Try to open in new tab, with fallback for popup blockers
    try {
      const newWindow = window.open(demoUrl, '_blank', 'noopener,noreferrer');
      
      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        setDemoStatus('Popup blocked - navigating in current window...');
        setTimeout(() => {
          window.location.href = demoUrl;
        }, 1000);
      } else {
        setDemoStatus('Demo opened in new tab!');
        setTimeout(() => setDemoStatus(null), 3000);
      }
    } catch (error) {
      // Final fallback: Navigate in current window
      setDemoStatus('Opening demo in current window...');
      setTimeout(() => {
        window.location.href = demoUrl;
      }, 1000);
    }
  };

  // Copy demo link to clipboard
  const copyDemoLink = async () => {
    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=chat`;
    try {
      await navigator.clipboard.writeText(demoUrl);
      setCopiedLink('demo_link');
      setDemoStatus('Demo link copied to clipboard!');
      setTimeout(() => {
        setCopiedLink(null);
        setDemoStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy demo link:', error);
      setDemoStatus('Failed to copy link - please try again');
      setTimeout(() => setDemoStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#141E30' }}>Chat Link Manager</h1>
          <p className="text-lg mt-2" style={{ color: '#64748b' }}>
            Generate, manage, and share candidate screening links
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <Link className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>{candidatesWithLinks.length}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Links Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>{candidatesNeedingLinks.length}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Pending Links</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <MessageCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>
                  {candidates.filter(c => c.status === 'screening').length}
                </p>
                <p className="text-sm" style={{ color: '#64748b' }}>Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>{candidates.length}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instant Demo Section */}
      <Card style={{ backgroundColor: '#ffffff' }} className="border-2 border-dashed" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{ color: '#141E30' }}>
            <Play className="h-5 w-5 text-blue-600" />
            <span>Try the Candidate Chat Interface Now!</span>
          </CardTitle>
          <CardDescription>
            Click the button below to see exactly what candidates experience when they receive your screening links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
            <div className="flex-1 mb-4 sm:mb-0">
              <h3 className="font-semibold mb-2" style={{ color: '#141E30' }}>🎯 Live Demo Chat</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Experience the full candidate journey from their perspective. This opens the actual chat interface 
                that candidates see with AI-powered screening questions.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Real AI Chat
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  5-10 Minutes
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  No Login Required
                </Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={openDemoChat}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Play className="h-4 w-4 mr-2" />
                Launch Demo Chat
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                onClick={copyDemoLink}
                variant="outline"
                size="lg"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-3"
              >
                {copiedLink === 'demo_link' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <Zap className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-2">
                <p>
                  <strong>What you'll see:</strong> Complete candidate screening flow including AI questions, 
                  real-time scoring, progress tracking, and professional completion screen.
                </p>
                <p className="text-sm">
                  <strong>💡 Tip:</strong> If the demo doesn't open in a new tab due to popup blockers, 
                  use the "Copy Link" button and paste it in a new browser tab.
                </p>
                {demoStatus && (
                  <p className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    {demoStatus}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Candidates Needing Links */}
      {candidatesNeedingLinks.length > 0 && (
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ color: '#141E30' }}>
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Candidates Needing Chat Links ({candidatesNeedingLinks.length})</span>
            </CardTitle>
            <CardDescription>
              Generate and send screening links to these pending candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidatesNeedingLinks.map((candidate) => (
                <div
                  key={candidate._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" style={{ color: '#141E30' }}>{candidate.name}</p>
                      <p className="text-sm" style={{ color: '#64748b' }}>{candidate.position}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>{candidate.email}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSendChatLink(candidate)}
                    style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}
                  >
                    {copiedLink === candidate._id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Link Generated & Copied!
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Generate Link
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Links */}
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle style={{ color: '#141E30' }}>Generated Chat Links ({candidatesWithLinks.length})</CardTitle>
              <CardDescription>
                All candidate screening links with copy and share options
              </CardDescription>
            </div>
            <div className="w-64">
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-8">
                <Link className="h-12 w-12 mx-auto mb-4" style={{ color: '#64748b', opacity: 0.5 }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>
                  {candidatesWithLinks.length === 0 ? 'No chat links generated yet' : 'No matching candidates'}
                </h3>
                <p style={{ color: '#64748b' }}>
                  {candidatesWithLinks.length === 0 
                    ? 'Upload resumes or generate links for pending candidates to get started'
                    : 'Try adjusting your search terms'
                  }
                </p>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="border rounded-lg p-4"
                  style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold" style={{ color: '#141E30' }}>{candidate.name}</h3>
                        <p className="text-sm" style={{ color: '#64748b' }}>{candidate.position}</p>
                        <p className="text-xs" style={{ color: '#64748b' }}>{candidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={
                          candidate.status === 'screening' 
                            ? 'bg-blue-100 text-blue-800'
                            : candidate.status === 'shortlisted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {candidate.status}
                      </Badge>
                      <Badge variant="outline" style={{ borderColor: '#141E30', color: '#141E30' }}>
                        Score: {candidate.score}%
                      </Badge>
                    </div>
                  </div>

                  {/* Chat Link Display */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium" style={{ color: '#141E30' }}>
                        <MessageCircle className="h-4 w-4 inline mr-1" />
                        Screening Chat Link
                      </p>
                      <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Generated
                      </Badge>
                    </div>
                    <div className="bg-white p-2 rounded border text-xs font-mono text-gray-600 break-all">
                      {candidate.chatLink}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{ color: '#64748b' }}>
                      Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(candidate.chatLink!, candidate._id)}
                      >
                        {copiedLink === candidate._id ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(candidate.chatLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open Chat
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const subject = `Complete your pre-screening for ${candidate.position}`;
                          const body = `Hi ${candidate.name},\n\nThanks for applying! Please complete your screening here: ${candidate.chatLink}`;
                          window.open(`mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                        }}
                        style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email Link
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardHeader>
          <CardTitle style={{ color: '#141E30' }}>How to Use Chat Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3" style={{ color: '#141E30' }}>For HR Team:</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#64748b' }}>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Links are automatically generated when resumes are uploaded</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Use "Demo Chat" button above to test the candidate experience</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Use "Copy Link" to share via any platform (email, Slack, etc.)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Use "Email Link" to send via your default email client</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3" style={{ color: '#141E30' }}>For Candidates:</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#64748b' }}>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>No login required - just click the link to start</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>5-10 minute conversational screening with AI</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Real-time scoring based on responses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Works on mobile and desktop</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}