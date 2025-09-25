import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  FileText, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Award,
  Globe,
  Github,
  Linkedin,
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  experience: string;
  education: string;
  skills: string[];
  score: number;
  status: string;
  appliedDate: string;
  linkedinId?: string;
}

interface ResumeViewerProps {
  candidate: Candidate | null;
}

export function ResumeViewer({ candidate }: ResumeViewerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock detailed candidate data with proper defaults
  const mockDetailedData = {
    summary: "Experienced frontend developer with 5+ years of expertise in React, TypeScript, and modern web technologies. Proven track record of building scalable applications and leading development teams.",
    workExperience: [
      {
        company: "TechCorp Inc.",
        position: "Senior Frontend Developer",
        duration: "2021 - Present",
        description: "Lead development of customer-facing web applications serving 100K+ users. Implemented modern React architecture and improved performance by 40%.",
        achievements: [
          "Reduced bundle size by 30% through code splitting",
          "Mentored 3 junior developers",
          "Implemented automated testing pipeline"
        ]
      },
      {
        company: "StartupXYZ",
        position: "Frontend Developer",
        duration: "2019 - 2021",
        description: "Built responsive web applications using React and Vue.js. Collaborated with design team to implement pixel-perfect UI components.",
        achievements: [
          "Delivered 15+ production features",
          "Improved mobile performance by 25%",
          "Implemented real-time chat feature"
        ]
      }
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "Bachelor of Science in Computer Science",
        duration: "2015 - 2019",
        gpa: "3.8/4.0",
        achievements: ["Dean's List", "CS Honor Society"]
      }
    ],
    projects: [
      {
        name: "E-commerce Platform",
        description: "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe API"],
        link: "https://github.com/user/ecommerce"
      },
      {
        name: "Task Management App",
        description: "Real-time collaborative task management with React and Socket.io",
        technologies: ["React", "Socket.io", "MongoDB", "Express"],
        link: "https://github.com/user/taskmanager"
      }
    ],
    skillsAssessment: [
      { skill: "React", level: 95, category: "Frontend" },
      { skill: "TypeScript", level: 90, category: "Language" },
      { skill: "Node.js", level: 85, category: "Backend" },
      { skill: "CSS/SCSS", level: 88, category: "Frontend" },
      { skill: "Git", level: 92, category: "Tools" },
      { skill: "Testing (Jest)", level: 80, category: "Testing" }
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023",
        credentialId: "AWS-123456"
      }
    ],
    aiInsights: {
      strengths: [
        "Strong technical background in modern frontend technologies",
        "Proven leadership and mentoring experience",
        "Excellent problem-solving skills demonstrated through achievements"
      ],
      concerns: [
        "Limited backend experience compared to frontend expertise",
        "No mobile app development experience mentioned"
      ],
      recommendations: [
        "Great fit for senior frontend role",
        "Could benefit from mobile development training",
        "Strong candidate for technical leadership positions"
      ]
    }
  };

  const openLinkedInProfile = (linkedinId: string) => {
    window.open(`https://linkedin.com/in/${linkedinId}`, '_blank');
  };

  if (!candidate) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Resume Selected</h3>
          <p className="text-muted-foreground">
            Select a candidate from the dashboard to view their resume and details.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 80) return 'bg-blue-500';
    if (level >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{candidate.name}</CardTitle>
                <CardDescription className="text-lg">{candidate.position}</CardDescription>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{candidate.location}</span>
                  </div>
                </div>
                {candidate.linkedinId && (
                  <div className="flex items-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => openLinkedInProfile(candidate.linkedinId!)}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      <span className="text-sm">linkedin.com/in/{candidate.linkedinId}</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(candidate.score)}`}>
                {candidate.score}%
              </div>
              <p className="text-sm text-muted-foreground">AI Match Score</p>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                {candidate.linkedinId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openLinkedInProfile(candidate.linkedinId!)}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {mockDetailedData.summary}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <span className="font-medium">{candidate.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applied</span>
                    <span className="font-medium">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills Match</span>
                    <span className="font-medium">{candidate.score}%</span>
                  </div>
                  <Progress value={candidate.score} className="h-2" />
                  {candidate.linkedinId && (
                    <>
                      <div className="flex justify-between items-center">
                        <span>LinkedIn Profile</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLinkedInProfile(candidate.linkedinId!)}
                        >
                          <Linkedin className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(candidate.skills || []).map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Work Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockDetailedData.workExperience.map((job, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{job.position}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant="outline">{job.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Achievements:</p>
                    {(job.achievements || []).map((achievement, i) => (
                      <div key={i} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                  {index < mockDetailedData.workExperience.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockDetailedData.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{edu.duration}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(edu.achievements || []).map((achievement, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                AI-powered evaluation based on resume analysis and industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDetailedData.skillsAssessment.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Certifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockDetailedData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{cert.date}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {cert.credentialId}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDetailedData.projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Technologies Used:</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || []).map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(mockDetailedData.aiInsights.strengths || []).map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Areas of Concern</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(mockDetailedData.aiInsights.concerns || []).map((concern, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(mockDetailedData.aiInsights.recommendations || []).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Technical Fit</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={92} className="w-32 h-2" />
                    <span className="font-medium">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Experience Level</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={88} className="w-32 h-2" />
                    <span className="font-medium">88%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cultural Fit (Predicted)</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="w-32 h-2" />
                    <span className="font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Overall Match</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={candidate.score} className="w-32 h-2" />
                    <span className={`font-bold ${getScoreColor(candidate.score)}`}>
                      {candidate.score}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}