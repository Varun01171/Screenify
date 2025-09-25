import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Upload, 
  MessageCircle, 
  BarChart3, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight,
  Play,
  Target,
  TrendingUp,
  Sparkles,
  Brain,
  Mail,
  Linkedin,
  Calendar
} from 'lucide-react';
import thunderLogo from 'figma:asset/94d07408ca5ca37c8e380c9ef62b9d0c31ab7c89.png';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 50%, #F0F4F8 100%)' }}>
      {/* Navigation */}
      <nav className="border-b sticky top-0 z-50" style={{ backgroundColor: '#141E30', borderColor: 'rgba(240, 244, 248, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}>
                <img 
                  src={thunderLogo} 
                  alt="Thunder Logo" 
                  className="w-full h-full object-contain p-1"
                  style={{
                    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
                    animation: 'thunderGlow 3s ease-in-out infinite'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/25 to-orange-500/25 rounded-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#F0F4F8' }}>Resume Screener</h1>
                <p className="text-xs" style={{ color: '#F0F4F8', opacity: 0.7 }}>Smart Hiring Solutions</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="transition-colors" style={{ color: '#F0F4F8', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'}>Features</a>
              <a href="#benefits" className="transition-colors" style={{ color: '#F0F4F8', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'}>Benefits</a>
              <a href="#testimonials" className="transition-colors" style={{ color: '#F0F4F8', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'}>Testimonials</a>
              <a href="#pricing" className="transition-colors" style={{ color: '#F0F4F8', opacity: 0.8 }} onMouseEnter={(e) => e.target.style.opacity = '1'} onMouseLeave={(e) => e.target.style.opacity = '0.8'}>Pricing</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onGetStarted} style={{ color: '#F0F4F8' }}>Sign In</Button>
              <Button onClick={onGetStarted} style={{ backgroundColor: '#F0F4F8', color: '#141E30' }}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" style={{ color: '#141E30', backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered Hiring Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ color: '#141E30' }}>
                  Hire the Best
                  <span className="block" style={{ color: '#141E30' }}>Candidates Faster</span>
                </h1>
                <p className="text-xl leading-relaxed" style={{ color: '#64748b' }}>
                  Transform your hiring process with powered resume screening, 
                  automated interviews, and intelligent candidate matching. 
                  Save 80% of time while improving hire quality.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-4" style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}>
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4" style={{ borderColor: '#141E30', color: '#141E30' }}>
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm" style={{ color: '#64748b' }}>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm" style={{ color: '#64748b' }}>Setup in 5 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl shadow-2xl border p-8" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold" style={{ color: '#141E30' }}>Live Demo</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      Online
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Upload className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium" style={{ color: '#141E30' }}>Resume uploaded</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>Sarah Johnson - Frontend Developer</p>
                      </div>
                      <Badge variant="outline">95% Match</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium" style={{ color: '#141E30' }}>Screening completed</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>Technical skills verified</p>
                      </div>
                      <Badge variant="outline">Approved</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium" style={{ color: '#141E30' }}>Analytics updated</p>
                        <p className="text-sm" style={{ color: '#64748b' }}>Pipeline performance +12%</p>
                      </div>
                      <Badge variant="outline">Insights</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(20, 30, 48, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#141E30' }}>10,000+</div>
              <div style={{ color: '#64748b' }}>Candidates Screened</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#141E30' }}>500+</div>
              <div style={{ color: '#64748b' }}>Companies Trust Us</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#141E30' }}>95%</div>
              <div style={{ color: '#64748b' }}>Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#141E30' }}>80%</div>
              <div style={{ color: '#64748b' }}>Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#141E30' }}>
              Powerful Features for Modern HR Teams
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#64748b' }}>
              Everything you need to streamline your hiring process and make better decisions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === 0 ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(0)}
                style={{ 
                  backgroundColor: '#ffffff',
                  borderColor: activeFeature === 0 ? '#141E30' : 'rgba(20, 30, 48, 0.1)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}
                         style={{ 
                           backgroundColor: activeFeature === 0 ? '#141E30' : '#F0F4F8'
                         }}>
                      <Brain className={`h-6 w-6`}
                             style={{ 
                               color: activeFeature === 0 ? '#F0F4F8' : '#141E30'
                             }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>Powered Resume Analysis</h3>
                      <p style={{ color: '#64748b' }}>Advanced machine learning algorithms analyze resumes with 95% accuracy.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === 1 ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(1)}
                style={{ 
                  backgroundColor: '#ffffff',
                  borderColor: activeFeature === 1 ? '#141E30' : 'rgba(20, 30, 48, 0.1)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}
                         style={{ 
                           backgroundColor: activeFeature === 1 ? '#141E30' : '#F0F4F8'
                         }}>
                      <MessageCircle className={`h-6 w-6`}
                                     style={{ 
                                       color: activeFeature === 1 ? '#F0F4F8' : '#141E30'
                                     }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>Smart Screening Interviews</h3>
                      <p style={{ color: '#64748b' }}>Conduct automated screening interviews with voice and text chat.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === 2 ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(2)}
                style={{ 
                  backgroundColor: '#ffffff',
                  borderColor: activeFeature === 2 ? '#141E30' : 'rgba(20, 30, 48, 0.1)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}
                         style={{ 
                           backgroundColor: activeFeature === 2 ? '#141E30' : '#F0F4F8'
                         }}>
                      <BarChart3 className={`h-6 w-6`}
                                 style={{ 
                                   color: activeFeature === 2 ? '#F0F4F8' : '#141E30'
                                 }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>Advanced Analytics Dashboard</h3>
                      <p style={{ color: '#64748b' }}>Get comprehensive insights into your recruitment pipeline.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === 3 ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(3)}
                style={{ 
                  backgroundColor: '#ffffff',
                  borderColor: activeFeature === 3 ? '#141E30' : 'rgba(20, 30, 48, 0.1)'
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center`}
                         style={{ 
                           backgroundColor: activeFeature === 3 ? '#141E30' : '#F0F4F8'
                         }}>
                      <Users className={`h-6 w-6`}
                             style={{ 
                               color: activeFeature === 3 ? '#F0F4F8' : '#141E30'
                             }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#141E30' }}>Collaborative Hiring</h3>
                      <p style={{ color: '#64748b' }}>Enable team-based hiring decisions with shared candidate profiles.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:sticky lg:top-24">
              <Card className="p-8" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#141E30' }}>
                      {activeFeature === 0 && <Brain className="h-6 w-6" style={{ color: '#F0F4F8' }} />}
                      {activeFeature === 1 && <MessageCircle className="h-6 w-6" style={{ color: '#F0F4F8' }} />}
                      {activeFeature === 2 && <BarChart3 className="h-6 w-6" style={{ color: '#F0F4F8' }} />}
                      {activeFeature === 3 && <Users className="h-6 w-6" style={{ color: '#F0F4F8' }} />}
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: '#141E30' }}>
                      {activeFeature === 0 && "Powered Resume Analysis"}
                      {activeFeature === 1 && "Smart Screening Interviews"}
                      {activeFeature === 2 && "Advanced Analytics Dashboard"}
                      {activeFeature === 3 && "Collaborative Hiring"}
                    </h3>
                  </div>
                  
                  <p style={{ color: '#64748b' }}>
                    {activeFeature === 0 && "Advanced machine learning algorithms analyze resumes with 95% accuracy, extracting key skills, experience, and qualifications automatically."}
                    {activeFeature === 1 && "Conduct automated screening interviews with voice and text chat capabilities, powered by natural language processing."}
                    {activeFeature === 2 && "Get comprehensive insights into your recruitment pipeline with real-time metrics, trends, and performance indicators."}
                    {activeFeature === 3 && "Enable team-based hiring decisions with shared candidate profiles, comments, and structured evaluation workflows."}
                  </p>
                  
                  <div className="space-y-3">
                    {activeFeature === 0 && (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Instant resume parsing</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Skill gap analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Experience matching</span>
                        </div>
                      </>
                    )}
                    {activeFeature === 1 && (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Voice & text interviews</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Real-time analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Behavioral insights</span>
                        </div>
                      </>
                    )}
                    {activeFeature === 2 && (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Pipeline visibility</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Time-to-hire tracking</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Source effectiveness</span>
                        </div>
                      </>
                    )}
                    {activeFeature === 3 && (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Team collaboration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Structured feedback</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span style={{ color: '#141E30' }}>Decision tracking</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Button onClick={onGetStarted} className="w-full" style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}>
                    Try This Feature
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20" style={{ backgroundColor: 'rgba(240, 244, 248, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#141E30' }}>
              Why Top HR Teams Choose Us
            </h2>
            <p className="text-xl" style={{ color: '#64748b' }}>
              Join hundreds of companies that have transformed their hiring process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                <Clock className="h-8 w-8" style={{ color: '#141E30' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#141E30' }}>Save 80% of Time</h3>
              <p style={{ color: '#64748b' }}>Reduce screening time from hours to minutes with automated analysis</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                <Target className="h-8 w-8" style={{ color: '#141E30' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#141E30' }}>Improve Quality</h3>
              <p style={{ color: '#64748b' }}>Find better candidates with data-driven matching and bias-free evaluation</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                <TrendingUp className="h-8 w-8" style={{ color: '#141E30' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#141E30' }}>Scale Efficiently</h3>
              <p style={{ color: '#64748b' }}>Handle 10x more candidates without increasing your HR team size</p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                <Shield className="h-8 w-8" style={{ color: '#141E30' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#141E30' }}>Stay Compliant</h3>
              <p style={{ color: '#64748b' }}>Built-in GDPR compliance and bias detection for ethical hiring</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#141E30' }}>
              Trusted by HR Leaders Worldwide
            </h2>
            <p className="text-xl" style={{ color: '#64748b' }}>
              See what our customers say about their hiring transformation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                
                <p className="italic" style={{ color: '#64748b' }}>"Resume Screener transformed our hiring process. We reduced time-to-hire by 60% and improved candidate quality significantly."</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" style={{ color: '#141E30' }}>Sarah Mitchell</p>
                      <p className="text-sm" style={{ color: '#64748b' }}>HR Director at TechCorp</p>
                    </div>
                  </div>
                  <Badge variant="outline">60% faster hiring</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                
                <p className="italic" style={{ color: '#64748b' }}>"The screening interviews are incredibly accurate. It feels like having a senior recruiter working 24/7."</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" style={{ color: '#141E30' }}>Michael Rodriguez</p>
                      <p className="text-sm" style={{ color: '#64748b' }}>Talent Acquisition Manager</p>
                    </div>
                  </div>
                  <Badge variant="outline">500+ candidates screened</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                
                <p className="italic" style={{ color: '#64748b' }}>"Best investment we made for our HR team. The analytics alone saved us thousands in bad hires."</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>EC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold" style={{ color: '#141E30' }}>Emily Chen</p>
                      <p className="text-sm" style={{ color: '#64748b' }}>VP of People</p>
                    </div>
                  </div>
                  <Badge variant="outline">$50K saved in Q1</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20" style={{ backgroundColor: 'rgba(240, 244, 248, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#141E30' }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl" style={{ color: '#64748b' }}>
              Choose the perfect plan for your hiring needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative p-8 hover:shadow-md transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: '#141E30' }}>Starter</h3>
                <div className="space-y-2">
                  <div className="text-4xl font-bold" style={{ color: '#141E30' }}>Free</div>
                  <p style={{ color: '#64748b' }}>Perfect for small teams getting started</p>
                </div>
                
                <div className="space-y-3 py-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Up to 50 candidates/month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Basic screening</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Dashboard analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Email support</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" onClick={onGetStarted} style={{ borderColor: '#141E30', color: '#141E30' }}>
                  Get Started Free
                </Button>
              </div>
            </Card>

            <Card className="relative p-8 shadow-lg scale-105" style={{ backgroundColor: '#ffffff', borderColor: '#141E30', borderWidth: '2px' }}>
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2" style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}>
                Most Popular
              </Badge>
              
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: '#141E30' }}>Professional</h3>
                <div className="space-y-2">
                  <div className="text-4xl font-bold" style={{ color: '#141E30' }}>
                    $99
                    <span className="text-lg" style={{ color: '#64748b' }}>/month</span>
                  </div>
                  <p style={{ color: '#64748b' }}>For growing companies with regular hiring</p>
                </div>
                
                <div className="space-y-3 py-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Up to 500 candidates/month</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Advanced + voice screening</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Team collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Custom integrations</span>
                  </div>
                </div>
                
                <Button className="w-full" onClick={onGetStarted} style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}>
                  Start Free Trial
                </Button>
              </div>
            </Card>

            <Card className="relative p-8 hover:shadow-md transition-shadow" style={{ backgroundColor: '#ffffff' }}>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold" style={{ color: '#141E30' }}>Enterprise</h3>
                <div className="space-y-2">
                  <div className="text-4xl font-bold" style={{ color: '#141E30' }}>Custom</div>
                  <p style={{ color: '#64748b' }}>For large organizations with complex needs</p>
                </div>
                
                <div className="space-y-3 py-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Unlimited candidates</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>White-label solution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Custom training</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>Dedicated support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#141E30' }}>SLA guarantee</span>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" onClick={onGetStarted} style={{ borderColor: '#141E30', color: '#141E30' }}>
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl mb-8" style={{ opacity: 0.9 }}>
            Join thousands of HR professionals who have revolutionized their recruitment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={onGetStarted}
              className="text-lg px-8 py-4"
              style={{ backgroundColor: '#F0F4F8', color: '#141E30' }}
            >
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4"
              style={{ borderColor: 'rgba(240, 244, 248, 0.3)', color: '#F0F4F8' }}
            >
              Schedule Demo
              <Calendar className="h-5 w-5 ml-2" />
            </Button>
          </div>
          <p className="text-sm mt-6" style={{ opacity: 0.75 }}>
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ backgroundColor: 'rgba(240, 244, 248, 0.5)', borderColor: 'rgba(20, 30, 48, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                  <img 
                    src={thunderLogo} 
                    alt="Thunder Logo" 
                    className="w-full h-full object-contain"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))'
                    }}
                  />
                </div>
                <span className="font-bold" style={{ color: '#141E30' }}>Resume Screener</span>
              </div>
              <p className="text-sm" style={{ color: '#64748b' }}>
                Transforming recruitment with intelligent automation and data-driven insights.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#141E30' }}>Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Features</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Pricing</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>API Docs</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Integrations</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#141E30' }}>Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>About</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Careers</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Press</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: '#141E30' }}>Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Help Center</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Privacy Policy</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Terms of Service</a>
                <a href="#" className="block transition-colors" style={{ color: '#64748b' }} onMouseEnter={(e) => e.target.style.color = '#141E30'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Status</a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderColor: 'rgba(20, 30, 48, 0.1)' }}>
            <p className="text-sm" style={{ color: '#64748b' }}>
              © 2024 Resume Screener. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes thunderGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8));
          }
          50% { 
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)) drop-shadow(0 0 30px rgba(255, 165, 0, 0.6));
          }
        }
      `}</style>
    </div>
  );
}