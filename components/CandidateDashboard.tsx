import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Star, 
  Calendar,
  CheckCircle,
  X,
  Clock,
  Users,
  TrendingUp,
  Award,
  MessageCircle,
  ExternalLink,
  Copy,
  Link,
  Send
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CandidateDashboardProps {
  onSelectCandidate: (candidate: any) => void;
  initialFilter: 'all' | 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired';
  onFilterChange: (filter: 'all' | 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired') => void;
  candidates: any[];
  onUpdateCandidateStatus: (candidateId: string, newStatus: any) => void;
  onSendChatLink: (candidate: any) => string;
}

export function CandidateDashboard({ 
  onSelectCandidate, 
  initialFilter, 
  onFilterChange,
  candidates,
  onUpdateCandidateStatus,
  onSendChatLink
}: CandidateDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'date'>('score');
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialFilter);
  }, [initialFilter]);

  const handleTabChange = (value: string) => {
    const filter = value as 'all' | 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired';
    setActiveTab(filter);
    onFilterChange(filter);
  };

  // Filter and sort candidates
  const filteredCandidates = candidates
    .filter(candidate => {
      // Tab filter
      if (activeTab !== 'all' && candidate.status !== activeTab) {
        return false;
      }
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          candidate.name.toLowerCase().includes(searchLower) ||
          candidate.email.toLowerCase().includes(searchLower) ||
          candidate.position.toLowerCase().includes(searchLower) ||
          candidate.skills.some((skill: string) => skill.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.score - a.score;
        case 'date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        default:
          return 0;
      }
    });

  const getCandidatesByStatus = (status: string) => {
    if (status === 'all') return candidates.length;
    return candidates.filter(c => c.status === status).length;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'screening':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleSendChatLink = async (candidate: any) => {
    try {
      const chatLink = onSendChatLink(candidate);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(chatLink);
      setCopiedLink(candidate.id);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedLink(null), 2000);
      
    } catch (error) {
      console.error('Failed to copy chat link:', error);
    }
  };

  const copyToClipboard = async (text: string, candidateId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(candidateId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const tabsData = [
    { id: 'all', label: 'All Candidates', count: getCandidatesByStatus('all') },
    { id: 'pending', label: 'Pending', count: getCandidatesByStatus('pending') },
    { id: 'screening', label: 'Screening', count: getCandidatesByStatus('screening') },
    { id: 'shortlisted', label: 'Shortlisted', count: getCandidatesByStatus('shortlisted') },
    { id: 'rejected', label: 'Rejected', count: getCandidatesByStatus('rejected') },
    { id: 'hired', label: 'Hired', count: getCandidatesByStatus('hired') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#141E30' }}>Candidates</h1>
          <p className="text-lg mt-2" style={{ color: '#64748b' }}>
            Manage and review candidate applications
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#64748b' }} />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date Applied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {tabsData.map((tab) => (
          <Card 
            key={tab.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === tab.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleTabChange(tab.id)}
            style={{ 
              backgroundColor: '#ffffff',
              borderColor: activeTab === tab.id ? '#141E30' : 'rgba(20, 30, 48, 0.1)'
            }}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>{tab.count}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>{tab.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Candidates List */}
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardHeader>
          <CardTitle style={{ color: '#141E30' }}>
            {activeTab === 'all' ? 'All Candidates' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Candidates`}
            <span className="ml-2 text-lg font-normal" style={{ color: '#64748b' }}>
              ({filteredCandidates.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: '#64748b', opacity: 0.5 }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>No candidates found</h3>
                <p style={{ color: '#64748b' }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'No candidates match the current filter'}
                </p>
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>
                          {candidate.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold" style={{ color: '#141E30' }}>{candidate.name}</h3>
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className={`h-4 w-4 ${getScoreColor(candidate.score)}`} />
                            <span className={`font-medium ${getScoreColor(candidate.score)}`}>
                              {candidate.score}%
                            </span>
                          </div>
                        </div>
                        
                        <p className="font-medium mb-2" style={{ color: '#141E30' }}>{candidate.position}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-3" style={{ color: '#64748b' }}>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{candidate.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{candidate.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4" />
                            <span>{candidate.experience}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {candidate.skills.slice(0, 4).map((skill: string, index: number) => (
                            <Badge 
                              key={index} 
                              variant="outline"
                              style={{ borderColor: '#141E30', color: '#141E30' }}
                            >
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 4 && (
                            <Badge variant="outline" style={{ color: '#64748b' }}>
                              +{candidate.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm" style={{ color: '#64748b' }}>
                            Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                          </p>
                          
                          {/* Chat Link Status */}
                          {candidate.chatLink && (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                Chat Link Sent
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(candidate.chatLink, candidate.id)}
                                className="text-xs"
                              >
                                {copiedLink === candidate.id ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy Link
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Send Chat Link Button */}
                      {!candidate.chatLink && candidate.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendChatLink(candidate)}
                          style={{ borderColor: '#141E30', color: '#141E30' }}
                        >
                          {copiedLink === candidate.id ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Link Copied!
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Chat Link
                            </>
                          )}
                        </Button>
                      )}
                      
                      {/* Candidate Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem onClick={() => onSelectCandidate(candidate)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          
                          {candidate.chatLink && (
                            <>
                              <DropdownMenuItem onClick={() => window.open(candidate.chatLink, '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Chat Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(candidate.chatLink, candidate.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Chat Link
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          {!candidate.chatLink && (
                            <DropdownMenuItem onClick={() => handleSendChatLink(candidate)}>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Chat Link
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {candidate.status !== 'shortlisted' && (
                            <DropdownMenuItem 
                              onClick={() => onUpdateCandidateStatus(candidate.id, 'shortlisted')}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Shortlist
                            </DropdownMenuItem>
                          )}
                          
                          {candidate.status !== 'rejected' && (
                            <DropdownMenuItem 
                              onClick={() => onUpdateCandidateStatus(candidate.id, 'rejected')}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          )}
                          
                          {candidate.status !== 'hired' && candidate.status === 'shortlisted' && (
                            <DropdownMenuItem 
                              onClick={() => onUpdateCandidateStatus(candidate.id, 'hired')}
                              className="text-purple-600"
                            >
                              <Award className="h-4 w-4 mr-2" />
                              Mark as Hired
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}