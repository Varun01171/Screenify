import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Download,
  Eye,
  Users,
  Brain,
  Clock,
  Zap
} from 'lucide-react';

interface FileUploadProps {
  onNavigate: (view: string) => void;
  onSelectCandidate: (candidate: any) => void;
  onCandidateCreated: (candidateData: any) => any;
}

interface ParsedCandidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  experience: string;
  education: string;
  skills: string[];
  score: number;
  resumeUrl?: string;
  linkedinId?: string;
}

export function FileUpload({ onNavigate, onSelectCandidate, onCandidateCreated }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [parsedCandidates, setParsedCandidates] = useState<ParsedCandidate[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample resume parsing function (simulates AI processing)
  const parseResume = async (file: File): Promise<ParsedCandidate> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate realistic sample data based on file name
    const fileName = file.name.toLowerCase();
    
    // Sample parsed data - in real implementation, this would use OCR/NLP
    const sampleCandidates = [
      {
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@email.com',
        phone: '+1 (555) 987-6543',
        location: 'Los Angeles, CA',
        position: 'Senior Software Engineer',
        experience: '7 years',
        education: 'MS Computer Science, UCLA',
        skills: ['JavaScript', 'React', 'Python', 'AWS', 'Docker'],
        score: 93,
        linkedinId: 'alex-rodriguez-swe'
      },
      {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1 (555) 456-7890',
        location: 'Phoenix, AZ',
        position: 'Data Analyst',
        experience: '4 years',
        education: 'BS Data Science, ASU',
        skills: ['SQL', 'Python', 'Tableau', 'Excel', 'R'],
        score: 86,
        linkedinId: 'maria-garcia-analyst'
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        phone: '+1 (555) 321-0987',
        location: 'Dallas, TX',
        position: 'Marketing Manager',
        experience: '6 years',
        education: 'MBA Marketing, UT Dallas',
        skills: ['Digital Marketing', 'SEO', 'Google Analytics', 'Content Strategy'],
        score: 89,
        linkedinId: 'james-wilson-marketing'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+1 (555) 654-3210',
        location: 'San Jose, CA',
        position: 'UX Designer',
        experience: '5 years',
        education: 'BFA Design, SJSU',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Wireframing'],
        score: 91,
        linkedinId: 'priya-patel-ux'
      }
    ];

    // Return a random candidate or create one based on filename
    const randomCandidate = sampleCandidates[Math.floor(Math.random() * sampleCandidates.length)];
    
    return {
      ...randomCandidate,
      resumeUrl: URL.createObjectURL(file)
    };
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Validate file types
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validFiles = files.filter(file => validTypes.includes(file.type));
    
    if (validFiles.length !== files.length) {
      setError('Please upload only PDF or Word documents');
      return;
    }

    setError(null);
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const processResumes = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setParsedCandidates([]);

    try {
      const results: ParsedCandidate[] = [];
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setProcessingProgress((i / uploadedFiles.length) * 50);
        
        // Parse individual resume
        const parsedCandidate = await parseResume(file);
        results.push(parsedCandidate);
        
        setProcessingProgress(50 + ((i + 1) / uploadedFiles.length) * 50);
      }

      setParsedCandidates(results);
      setProcessingProgress(100);

      // Auto-create candidates after a brief delay to show completion
      setTimeout(() => {
        results.forEach(candidate => {
          onCandidateCreated(candidate);
        });
      }, 1000);

    } catch (err) {
      setError('Failed to process resumes. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setUploadedFiles([]);
    setParsedCandidates([]);
    setProcessingProgress(0);
    setError(null);
  };

  const viewCandidate = (candidate: ParsedCandidate) => {
    onSelectCandidate(candidate);
    onNavigate('viewer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#141E30' }}>Upload Resumes</h1>
          <p className="text-lg mt-2" style={{ color: '#64748b' }}>
            Upload candidate resumes for automatic parsing and profile generation
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('candidates')}
            style={{ borderColor: '#141E30', color: '#141E30' }}
          >
            <Users className="h-4 w-4 mr-2" />
            View Candidates
          </Button>
        </div>
      </div>

      {/* Upload Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                <Upload className="h-5 w-5" style={{ color: '#141E30' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>{uploadedFiles.length}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Files Uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>{parsedCandidates.length}</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Profiles Created</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>
                  {parsedCandidates.length > 0 
                    ? Math.round(parsedCandidates.reduce((sum, c) => sum + c.score, 0) / parsedCandidates.length)
                    : '--'
                  }%
                </p>
                <p className="text-sm" style={{ color: '#64748b' }}>Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141E30' }}>~2min</p>
                <p className="text-sm" style={{ color: '#64748b' }}>Processing Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardHeader>
          <CardTitle style={{ color: '#141E30' }}>Upload Resume Files</CardTitle>
          <CardDescription>
            Drag and drop PDF or Word documents, or click to browse files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            style={{ 
              borderColor: dragActive ? '#141E30' : 'rgba(100, 116, 139, 0.25)',
              backgroundColor: dragActive ? 'rgba(20, 30, 48, 0.05)' : 'transparent'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: '#64748b' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>
              Drop resumes here or click to upload
            </h3>
            <p className="mb-4" style={{ color: '#64748b' }}>
              Supports PDF, DOC, and DOCX files up to 10MB each
            </p>
            
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
            />
            <Label htmlFor="resume-upload">
              <Button style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}>
                Browse Files
              </Button>
            </Label>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle style={{ color: '#141E30' }}>Uploaded Files ({uploadedFiles.length})</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={clearAll}
                style={{ borderColor: '#141E30', color: '#141E30' }}
              >
                Clear All
              </Button>
              <Button 
                onClick={processResumes}
                disabled={isProcessing}
                style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Process Resumes
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5" style={{ color: '#64748b' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#141E30' }}>{file.name}</p>
                      <p className="text-sm" style={{ color: '#64748b' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold" style={{ color: '#141E30' }}>Processing Resumes</h3>
                <span className="text-sm" style={{ color: '#64748b' }}>{Math.round(processingProgress)}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
              <p className="text-sm" style={{ color: '#64748b' }}>
                Extracting candidate information using advanced parsing...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsed Candidates Preview */}
      {parsedCandidates.length > 0 && !isProcessing && (
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardHeader>
            <CardTitle style={{ color: '#141E30' }}>Generated Candidate Profiles</CardTitle>
            <CardDescription>
              Successfully extracted information from {parsedCandidates.length} resume{parsedCandidates.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {parsedCandidates.map((candidate, index) => (
                <div key={index} className="border rounded-lg p-4" style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                          <User className="h-5 w-5" style={{ color: '#141E30' }} />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: '#141E30' }}>{candidate.name}</h3>
                          <p className="text-sm" style={{ color: '#64748b' }}>{candidate.position}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="ml-auto"
                          style={{ 
                            backgroundColor: candidate.score >= 90 ? '#dcfce7' : candidate.score >= 80 ? '#fef3c7' : '#fee2e2',
                            color: candidate.score >= 90 ? '#166534' : candidate.score >= 80 ? '#92400e' : '#991b1b'
                          }}
                        >
                          {candidate.score}% Match
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" style={{ color: '#64748b' }} />
                          <span style={{ color: '#64748b' }}>{candidate.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" style={{ color: '#64748b' }} />
                          <span style={{ color: '#64748b' }}>{candidate.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" style={{ color: '#64748b' }} />
                          <span style={{ color: '#64748b' }}>{candidate.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" style={{ color: '#64748b' }} />
                          <span style={{ color: '#64748b' }}>{candidate.experience}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4" style={{ color: '#64748b' }} />
                        <span className="text-sm" style={{ color: '#64748b' }}>{candidate.education}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map((skill, skillIndex) => (
                          <Badge 
                            key={skillIndex} 
                            variant="outline"
                            style={{ borderColor: '#141E30', color: '#141E30' }}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewCandidate(candidate)}
                        style={{ borderColor: '#141E30', color: '#141E30' }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800">
                  All candidate profiles have been automatically added to your candidates database!
                </p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                You can now view, screen, and manage these candidates in the Candidates tab.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {parsedCandidates.length > 0 && (
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => onNavigate('candidates')}
            style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}
          >
            <Users className="h-4 w-4 mr-2" />
            View All Candidates
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              clearAll();
              setUploadedFiles([]);
              setParsedCandidates([]);
            }}
            style={{ borderColor: '#141E30', color: '#141E30' }}
          >
            Upload More Resumes
          </Button>
        </div>
      )}
    </div>
  );
}