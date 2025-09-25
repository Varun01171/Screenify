import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  Users, 
  BarChart3,
  MessageCircle,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import thunderLogo from 'figma:asset/94d07408ca5ca37c8e380c9ef62b9d0c31ab7c89.png';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string; rememberMe: boolean }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginPage({ onLogin, isLoading = false, error = null }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onLogin({ email, password, rememberMe });
  };

  const features = [
    {
      icon: Upload,
      title: 'Smart Resume Processing',
      description: 'Powered resume analysis and scoring'
    },
    {
      icon: MessageCircle,
      title: 'Automated Screening',
      description: 'Intelligent candidate screening with voice chat'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Real-time recruitment metrics and insights'
    },
    {
      icon: Users,
      title: 'Candidate Management',
      description: 'Comprehensive candidate tracking and management'
    }
  ];

  // Demo credentials for easy access
  const demoCredentials = {
    email: 'hr@company.com',
    password: 'demo123'
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F0F4F8 0%, #E2E8F0 50%, #F0F4F8 100%)' }}>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Features */}
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)' }}>
                <img 
                  src={thunderLogo} 
                  alt="Thunder Logo" 
                  className="w-full h-full object-contain p-1"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))',
                    animation: 'thunderPulse 2.5s ease-in-out infinite'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow-300/20 rounded-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#141E30' }}>Resume Screener</h1>
                <p style={{ color: '#64748b' }}>Professional HR Dashboard</p>
              </div>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#141E30' }}>
              Welcome to the Future of
              <span className="block" style={{ color: '#141E30' }}>HR Recruitment</span>
            </h2>
            
            <p className="text-lg mb-8" style={{ color: '#64748b' }}>
              Streamline your hiring process with powered resume screening, 
              automated candidate analysis, and intelligent recruitment insights.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border hover:shadow-md transition-shadow" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(20, 30, 48, 0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(20, 30, 48, 0.1)' }}>
                  <feature.icon className="h-5 w-5" style={{ color: '#141E30' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#141E30' }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: '#64748b' }}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" style={{ color: '#64748b' }} />
              <span style={{ color: '#64748b' }}>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" style={{ color: '#64748b' }} />
              <span style={{ color: '#64748b' }}>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" style={{ color: '#64748b' }} />
              <span style={{ color: '#64748b' }}>Trusted by 1000+ HRs</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl" style={{ color: '#141E30' }}>Sign In to Your Account</CardTitle>
              <CardDescription style={{ color: '#64748b' }}>
                Access your HR dashboard and manage your recruitment pipeline
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Demo Credentials Info */}
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'rgba(20, 30, 48, 0.05)', borderColor: 'rgba(20, 30, 48, 0.2)' }}>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: '#141E30' }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#141E30' }}>Demo Access Available</p>
                      <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                        Use demo credentials: hr@company.com / demo123
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto mt-1"
                        onClick={fillDemoCredentials}
                        style={{ color: '#141E30' }}
                      >
                        Fill demo credentials
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#141E30' }}>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#64748b' }} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
                      style={{ backgroundColor: '#ffffff', borderColor: validationErrors.email ? '#d4183d' : 'rgba(20, 30, 48, 0.2)' }}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-destructive">{validationErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: '#141E30' }}>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#64748b' }} />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      className={`pl-10 pr-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                      style={{ backgroundColor: '#ffffff', borderColor: validationErrors.password ? '#d4183d' : 'rgba(20, 30, 48, 0.2)' }}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-destructive">{validationErrors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm cursor-pointer select-none"
                      style={{ color: '#141E30' }}
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto" style={{ color: '#141E30' }}>
                    Forgot password?
                  </Button>
                </div>

                {/* Sign In Button */}
                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={isLoading}
                  style={{ backgroundColor: '#141E30', color: '#F0F4F8' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'rgba(20, 30, 48, 0.2)' }} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-xs" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#64748b' }}>
                      Secure Access
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    By signing in, you agree to our{' '}
                    <Button variant="ghost" className="p-0 h-auto text-xs" style={{ color: '#141E30' }}>
                      Terms of Service
                    </Button>
                    {' '}and{' '}
                    <Button variant="ghost" className="p-0 h-auto text-xs" style={{ color: '#141E30' }}>
                      Privacy Policy
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Support Info */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#64748b' }}>
              Need help? Contact{' '}
              <Button variant="ghost" className="p-0 h-auto" style={{ color: '#141E30' }}>
                support@company.com
              </Button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes thunderPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1)) drop-shadow(0 0 35px rgba(255, 165, 0, 0.8));
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}