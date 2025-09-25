import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Clock, 
  Star,
  Upload,
  MessageCircle,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Linkedin,
  ExternalLink,
  MoreHorizontal,
  Send,
  StarOff
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Candidate {
  _id: string; // PostgreSQL UUID converted to _id for compatibility
  name: string;
  email: string;
  phone?: string;
  location?: string;
  position: string;
  experience?: string;
  education?: string;
  skills: string[];
  score: number;
  status: 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired';
  appliedDate: string;
  resumeUrl?: string;
  avatar?: string;
  isShortlisted: boolean;
  linkedinId?: string;
}

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
  onSelectCandidate: (candidate: any) => void;
  candidates: Candidate[];
  metrics: {
    totalCandidates: number;
    screened: number;
    shortlisted: number;
    pending: number;
    rejected: number;
    hired: number;
    averageScore: number;
  };
  onMetricClick: (filter: 'all' | 'pending' | 'screening' | 'shortlisted' | 'rejected' | 'hired') => void;
}

export function DashboardOverview({ 
  onNavigate, 
  onSelectCandidate, 
  candidates, 
  metrics, 
  onMetricClick 
}: DashboardOverviewProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');

  // Calculate weekly changes (mock data for now)
  const weeklyChanges = {
    candidatesChange: +12,
    screenedChange: +5,
    shortlistedChange: +3,
    scoreChange: +2
  };

  // Get top candidates by score
  const topCandidates = candidates
    .filter(c => c.status !== 'rejected')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Mock weekly data based on actual candidate data
  const weeklyData = [
    { day: 'Mon', applications: 12, screened: 8 },
    { day: 'Tue', applications: 19, screened: 15 },
    { day: 'Wed', applications: 8, screened: 6 },
    { day: 'Thu', applications: 15, screened: 12 },
    { day: 'Fri', applications: 25, screened: 18 },
    { day: 'Sat', applications: 5, screened: 3 },
    { day: 'Sun', applications: 3, screened: 2 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'shortlisted': return 'default';
      case 'screening': return 'secondary';
      case 'hired': return 'green';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const openLinkedInProfile = (linkedinId: string) => {
    window.open(`https://linkedin.com/in/${linkedinId}`, '_blank');
  };

  // Enhanced filtering logic
  const getFilteredCandidates = (filter: string) => {
    let filtered = candidates;
    
    // Apply status filter
    switch (filter) {
      case 'pending':
        filtered = candidates.filter(c => c.status === 'pending');
        break;
      case 'screening':
        filtered = candidates.filter(c => c.status === 'screening');
        break;
      case 'shortlisted':
        filtered = candidates.filter(c => c.status === 'shortlisted' || c.isShortlisted);
        break;
      case 'rejected':
        filtered = candidates.filter(c => c.status === 'rejected');
        break;
      case 'hired':
        filtered = candidates.filter(c => c.status === 'hired');
        break;
      default:
        filtered = candidates;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'position':
          return a.position.localeCompare(b.position);
        default:
          return 0;
      }
    });
  };

  const filteredCandidates = getFilteredCandidates(activeTab);

  const handleCandidateAction = (candidate: Candidate, action: string) => {
    switch (action) {
      case 'view':
        onSelectCandidate(candidate);
        onNavigate('viewer');
        break;
      case 'screen':
        onNavigate('chat');
        break;
      case 'email':
        window.open(`mailto:${candidate.email}`);
        break;
      case 'linkedin':
        if (candidate.linkedinId) {
          openLinkedInProfile(candidate.linkedinId);
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Sarah! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your recruitment pipeline today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => onNavigate('upload')}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resume
          </Button>
          <Button variant="outline" onClick={() => onNavigate('chat')}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Screening
          </Button>
        </div>
      </div>

      {/* Key Metrics - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
          onClick={() => onMetricClick('all')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                <p className="text-3xl font-bold">{metrics.totalCandidates}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{weeklyChanges.candidatesChange} this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
          onClick={() => onMetricClick('screening')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Screened</p>
                <p className="text-3xl font-bold">{metrics.screened}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{weeklyChanges.screenedChange} this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
          onClick={() => onMetricClick('shortlisted')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                <p className="text-3xl font-bold">{metrics.shortlisted}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{weeklyChanges.shortlistedChange} this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                <p className="text-3xl font-bold">{metrics.averageScore}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{weeklyChanges.scoreChange}% this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Content Grid with Expanded Candidate Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expanded Candidate Overview - Now Takes 2/3 of the Space */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Candidates Overview</CardTitle>
                  <CardDescription>Filter, search, and manage candidates by status</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => onNavigate('candidates')}
                  className="shrink-0"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Enhanced Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="date">Date Applied</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Enhanced Tabs with Real-time Counts */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all" className="text-xs">
                    All ({metrics.totalCandidates})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">
                    Pending ({metrics.pending})
                  </TabsTrigger>
                  <TabsTrigger value="screening" className="text-xs">
                    Screening ({candidates.filter(c => c.status === 'screening').length})
                  </TabsTrigger>
                  <TabsTrigger value="shortlisted" className="text-xs">
                    Shortlisted ({metrics.shortlisted})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="text-xs">
                    Rejected ({metrics.rejected})
                  </TabsTrigger>
                  <TabsTrigger value="hired" className="text-xs">
                    Hired ({metrics.hired})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-4">
                  {/* Results Summary */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''}
                      {activeTab !== 'all' && ` in ${activeTab} status`}
                      {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSearchTerm('')}
                        className="text-xs"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>

                  {/* Enhanced Candidate List */}
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-3">
                      {filteredCandidates.map((candidate) => (
                        <div 
                          key={candidate._id} 
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Avatar and Basic Info */}
                            <Avatar className="w-12 h-12 shrink-0">
                              <AvatarImage src={candidate.avatar} />
                              <AvatarFallback>
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              {/* Header Row */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-medium truncate">{candidate.name}</h4>
                                  <Badge variant={getStatusBadgeVariant(candidate.status) as any} className="text-xs">
                                    {candidate.status}
                                  </Badge>
                                  {candidate.isShortlisted && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                                    {candidate.score}%
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleCandidateAction(candidate, 'view')}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Resume
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCandidateAction(candidate, 'screen')}>
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Start Screening
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCandidateAction(candidate, 'email')}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                      </DropdownMenuItem>
                                      {candidate.linkedinId && (
                                        <DropdownMenuItem onClick={() => handleCandidateAction(candidate, 'linkedin')}>
                                          <Linkedin className="h-4 w-4 mr-2" />
                                          View LinkedIn
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {/* Position and Score Progress */}
                              <p className="text-sm text-muted-foreground mb-2">{candidate.position}</p>
                              <Progress value={candidate.score} className="h-2 mb-3" />
                              
                              {/* Contact and Details Grid */}
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate">{candidate.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate">{candidate.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Briefcase className="h-3 w-3 text-muted-foreground" />
                                  <span>{candidate.experience}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3 w-3 text-muted-foreground" />
                                  <span>{new Date(candidate.appliedDate).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* LinkedIn Profile Link */}
                              {candidate.linkedinId && (
                                <div className="mb-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                                    onClick={() => openLinkedInProfile(candidate.linkedinId!)}
                                  >
                                    <Linkedin className="h-3 w-3 mr-1" />
                                    <span className="text-xs">linkedin.com/in/{candidate.linkedinId}</span>
                                    <ExternalLink className="h-2 w-2 ml-1" />
                                  </Button>
                                </div>
                              )}

                              {/* Skills */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {candidate.skills.slice(0, 4).map(skill => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{candidate.skills.length - 4} more
                                  </Badge>
                                )}
                              </div>

                              {/* Quick Actions */}
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCandidateAction(candidate, 'view')}
                                  className="text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleCandidateAction(candidate, 'screen')}
                                  className="text-xs"
                                >
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Screen
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCandidateAction(candidate, 'email')}
                                  className="text-xs"
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredCandidates.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <h3 className="font-medium mb-2">No candidates found</h3>
                          <p className="text-sm">
                            {searchTerm 
                              ? `No candidates match "${searchTerm}"` 
                              : `No candidates found for ${activeTab} status`
                            }
                          </p>
                          {(searchTerm || activeTab !== 'all') && (
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                setSearchTerm('');
                                setActiveTab('all');
                              }}
                            >
                              Clear filters
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Overview - Now Takes 1/3 of the Space */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Applications and screening activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium">{day.day}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Applications</span>
                        <span className="text-sm font-medium">{day.applications}</span>
                      </div>
                      <Progress value={(day.applications / 25) * 100} className="h-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Screened</span>
                        <span className="text-sm font-medium">{day.screened}</span>
                      </div>
                      <Progress value={(day.screened / 20) * 100} className="h-2 bg-green-100" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Weekly Summary */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">This Week's Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Applications:</span>
                    <span className="font-medium">87</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Screened:</span>
                    <span className="font-medium">64</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">73.6%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Performers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Week</CardTitle>
          <CardDescription>Highest scoring candidates across all positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCandidates.slice(0, 6).map((candidate, index) => (
              <div 
                key={candidate._id}
                className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                onClick={() => {
                  onSelectCandidate(candidate);
                  onNavigate('viewer');
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{candidate.position}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <div className={`text-lg font-bold ${getScoreColor(candidate.score)}`}>
                        {candidate.score}%
                      </div>
                      <Badge variant={getStatusBadgeVariant(candidate.status) as any} className="text-xs">
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => onNavigate('upload')}
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Upload Resume</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => onNavigate('chat')}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm">Start Screening</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => onNavigate('candidates')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">View Candidates</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
            >
              <Download className="h-6 w-6" />
              <span className="text-sm">Export Report</span>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Tip: Bulk Processing</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Upload multiple resumes at once to speed up your screening process. The AI will automatically process and score each candidate.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}