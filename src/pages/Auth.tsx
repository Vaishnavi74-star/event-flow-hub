import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Shield, Mic, Ticket, CheckCircle, Calendar, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

type AppRole = 'admin' | 'organizer' | 'participant';

const roles: { value: AppRole; label: string; icon: typeof Shield; desc: string }[] = [
  { value: 'admin', label: 'Admin', icon: Shield, desc: 'Manage the entire platform' },
  { value: 'organizer', label: 'Organizer', icon: Mic, desc: 'Create and manage events' },
  { value: 'participant', label: 'Participant', icon: Ticket, desc: 'Browse and book events' },
];

const Auth = () => {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>('participant');
  const [signupDone, setSignupDone] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', fullName: '' });

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(signupForm.email, signupForm.password, signupForm.fullName, selectedRole);
      setSignupDone(true);
      toast.success('Account created! Check your email to verify, then sign in.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
        <div className="bg-grid absolute inset-0 opacity-20" />
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative p-12">
        <div className="max-w-md space-y-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-heading font-bold text-gradient">EventHub</span>
          </Link>

          <h1 className="text-4xl font-heading font-bold leading-tight">
            The platform for
            <span className="text-gradient-neon block mt-1">modern events</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed">
            Create, discover, and manage events with AI-powered tools, real-time analytics, and dynamic pricing.
          </p>

          <div className="space-y-4 pt-4">
            {[
              'Role-based access control',
              'Real-time seat availability',
              'AI event recommendations',
              'Dynamic ticket pricing',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:text-foreground transition-premium">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-gradient">EventHub</span>
            </Link>
          </div>

          <Card className="glass glow-border overflow-hidden">
            <Tabs defaultValue="login">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm">Email</Label>
                      <Input id="login-email" type="email" required placeholder="you@example.com" className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" value={loginForm.email}
                        onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm">Password</Label>
                      <Input id="login-password" type="password" required placeholder="••••••••" className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20" value={loginForm.password}
                        onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-premium shadow-lg shadow-primary/25 h-11" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  {signupDone ? (
                    <div className="text-center py-8 space-y-4 animate-scale-in">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto neon-glow">
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg">Check your email</h3>
                      <p className="text-sm text-muted-foreground">
                        We sent a verification link to <strong className="text-foreground">{signupForm.email}</strong>. Click it to activate your account, then sign in.
                      </p>
                      <Button variant="outline" onClick={() => setSignupDone(false)} className="glow-border-hover">Back to Sign Up</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                        <Input id="signup-name" required placeholder="John Doe" className="bg-secondary/30 border-border/50" value={signupForm.fullName}
                          onChange={e => setSignupForm(f => ({ ...f, fullName: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-sm">Email</Label>
                        <Input id="signup-email" type="email" required placeholder="you@example.com" className="bg-secondary/30 border-border/50" value={signupForm.email}
                          onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm">Password</Label>
                        <Input id="signup-password" type="password" required minLength={6} placeholder="Min 6 characters" className="bg-secondary/30 border-border/50" value={signupForm.password}
                          onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Select Your Role</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {roles.map(r => (
                            <button key={r.value} type="button"
                              onClick={() => setSelectedRole(r.value)}
                              className={`p-3 rounded-xl border text-center transition-premium group ${
                                selectedRole === r.value
                                  ? 'border-primary/50 bg-primary/10 glow-border'
                                  : 'border-border/50 bg-secondary/30 hover:border-muted-foreground/30 glow-border-hover'
                              }`}>
                              <r.icon className={`w-5 h-5 mx-auto mb-1 transition-premium ${selectedRole === r.value ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                              <span className="text-xs font-medium block">{r.label}</span>
                              <span className="text-[10px] text-muted-foreground block mt-0.5">{r.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-premium shadow-lg shadow-primary/25 h-11" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                      </Button>
                    </form>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
