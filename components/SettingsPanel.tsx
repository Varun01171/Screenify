import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Brain, 
  Filter, 
  MessageSquare, 
  Users, 
  Save, 
  RefreshCw,
  Plus,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export function SettingsPanel() {
  const [aiSettings, setAISettings] = useState({
    scoreThreshold: [75],
    enableVoiceChat: true,
    autoShortlist: false,
    maxCandidatesPerDay: 50,
    analysisDepth: 'comprehensive'
  });

  const [screeningCriteria, setScreeningCriteria] = useState({
    requiredSkills: ['React', 'JavaScript', 'CSS'],
    preferredSkills: ['TypeScript', 'Node.js', 'GraphQL'],
    minimumExperience: 3,
    educationRequired: false,
    locationPreference: 'any'
  });

  const [chatSettings, setChatSettings] = useState({
    tone: 'professional',
    questionTypes: ['technical', 'behavioral', 'cultural'],
    averageSessionLength: 15,
    followUpQuestions: true
  });

  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Show success message (in real app)
  };

  const addSkill = (type: 'required' | 'preferred') => {
    if (!newSkill.trim()) return;
    
    if (type === 'required') {
      setScreeningCriteria(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()]
      }));
    } else {
      setScreeningCriteria(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, newSkill.trim()]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skill: string, type: 'required' | 'preferred') => {
    if (type === 'required') {
      setScreeningCriteria(prev => ({
        ...prev,
        requiredSkills: prev.requiredSkills.filter(s => s !== skill)
      }));
    } else {
      setScreeningCriteria(prev => ({
        ...prev,
        preferredSkills: prev.preferredSkills.filter(s => s !== skill)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">
            Configure AI screening parameters and criteria
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ai-settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-settings" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Settings</span>
          </TabsTrigger>
          <TabsTrigger value="screening" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Screening</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat & Voice</span>
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Integration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Engine Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure how the AI analyzes and scores candidates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Minimum Score Threshold ({aiSettings.scoreThreshold[0]}%)</Label>
                <Slider
                  value={aiSettings.scoreThreshold}
                  onValueChange={(value) => setAISettings(prev => ({ ...prev, scoreThreshold: value }))}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Candidates scoring below this threshold will be flagged for review
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Analysis Depth</Label>
                <Select 
                  value={aiSettings.analysisDepth} 
                  onValueChange={(value) => setAISettings(prev => ({ ...prev, analysisDepth: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - Quick skill matching</SelectItem>
                    <SelectItem value="standard">Standard - Skills + experience analysis</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive - Full profile analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Shortlist High Scorers</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically shortlist candidates with scores above 90%
                    </div>
                  </div>
                  <Switch
                    checked={aiSettings.autoShortlist}
                    onCheckedChange={(checked) => setAISettings(prev => ({ ...prev, autoShortlist: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Voice Chat Integration</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable voice-based candidate screening
                    </div>
                  </div>
                  <Switch
                    checked={aiSettings.enableVoiceChat}
                    onCheckedChange={(checked) => setAISettings(prev => ({ ...prev, enableVoiceChat: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-candidates">Maximum Candidates per Day</Label>
                <Input
                  id="max-candidates"
                  type="number"
                  value={aiSettings.maxCandidatesPerDay}
                  onChange={(e) => setAISettings(prev => ({ ...prev, maxCandidatesPerDay: parseInt(e.target.value) }))}
                  min={1}
                  max={200}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Screening Criteria</span>
              </CardTitle>
              <CardDescription>
                Define the requirements and preferences for candidate evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Required Skills</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Candidates must have these skills to pass initial screening
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {screeningCriteria.requiredSkills.map(skill => (
                      <Badge key={skill} variant="default" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill, 'required')}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add required skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill('required')}
                    />
                    <Button onClick={() => addSkill('required')} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-medium">Preferred Skills</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    These skills will boost candidate scores but are not required
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {screeningCriteria.preferredSkills.map(skill => (
                      <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill, 'preferred')}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add preferred skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill('preferred')}
                    />
                    <Button onClick={() => addSkill('preferred')} variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="min-experience">Minimum Experience (years)</Label>
                    <Input
                      id="min-experience"
                      type="number"
                      value={screeningCriteria.minimumExperience}
                      onChange={(e) => setScreeningCriteria(prev => ({ 
                        ...prev, 
                        minimumExperience: parseInt(e.target.value) 
                      }))}
                      min={0}
                      max={20}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location Preference</Label>
                    <Select 
                      value={screeningCriteria.locationPreference}
                      onValueChange={(value) => setScreeningCriteria(prev => ({ ...prev, locationPreference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Location</SelectItem>
                        <SelectItem value="local">Local Only</SelectItem>
                        <SelectItem value="remote">Remote Friendly</SelectItem>
                        <SelectItem value="specific">Specific Cities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Education Required</Label>
                    <div className="text-sm text-muted-foreground">
                      Require formal education credentials
                    </div>
                  </div>
                  <Switch
                    checked={screeningCriteria.educationRequired}
                    onCheckedChange={(checked) => setScreeningCriteria(prev => ({ ...prev, educationRequired: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat & Voice Settings</span>
              </CardTitle>
              <CardDescription>
                Configure the AI interviewer's personality and approach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Interview Tone</Label>
                  <Select 
                    value={chatSettings.tone}
                    onValueChange={(value) => setChatSettings(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly & Casual</SelectItem>
                      <SelectItem value="formal">Formal & Traditional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Average Session Length (minutes)</Label>
                  <Slider
                    value={[chatSettings.averageSessionLength]}
                    onValueChange={(value) => setChatSettings(prev => ({ ...prev, averageSessionLength: value[0] }))}
                    max={60}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5 min</span>
                    <span>{chatSettings.averageSessionLength} min</span>
                    <span>60 min</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Question Types</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'technical', label: 'Technical Skills' },
                      { id: 'behavioral', label: 'Behavioral' },
                      { id: 'cultural', label: 'Cultural Fit' },
                      { id: 'experience', label: 'Experience-based' }
                    ].map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={type.id}
                          checked={chatSettings.questionTypes.includes(type.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setChatSettings(prev => ({
                                ...prev,
                                questionTypes: [...prev.questionTypes, type.id]
                              }));
                            } else {
                              setChatSettings(prev => ({
                                ...prev,
                                questionTypes: prev.questionTypes.filter(t => t !== type.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={type.id}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Follow-up Questions</Label>
                    <div className="text-sm text-muted-foreground">
                      AI will ask clarifying questions based on responses
                    </div>
                  </div>
                  <Switch
                    checked={chatSettings.followUpQuestions}
                    onCheckedChange={(checked) => setChatSettings(prev => ({ ...prev, followUpQuestions: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Integration Settings</span>
              </CardTitle>
              <CardDescription>
                Connect with external systems and APIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">LI</span>
                      </div>
                      <div>
                        <h3 className="font-medium">LinkedIn Integration</h3>
                        <p className="text-sm text-muted-foreground">Import candidate profiles from LinkedIn</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">ATS</span>
                      </div>
                      <div>
                        <h3 className="font-medium">ATS Integration</h3>
                        <p className="text-sm text-muted-foreground">Sync with your existing ATS system</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-yellow-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">@</span>
                      </div>
                      <div>
                        <h3 className="font-medium">Email Integration</h3>
                        <p className="text-sm text-muted-foreground">Send automated emails to candidates</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">API Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">OpenAI API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="sk-..."
                        value="••••••••••••••••"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Used for AI-powered resume analysis
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        type="url"
                        placeholder="https://your-app.com/webhooks"
                      />
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about screening results
                      </p>
                    </div>
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