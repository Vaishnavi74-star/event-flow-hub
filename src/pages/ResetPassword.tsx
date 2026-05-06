import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { KeyRound, CheckCircle, Calendar, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase will auto-detect the recovery token from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });

    // Also check if there's already a session (in case the event fired before mount)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-6">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
        <div className="bg-grid absolute inset-0 opacity-20" />
      </div>

      <div className="w-full max-w-md animate-fade-in relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-heading font-bold text-gradient">EventHub</span>
          </Link>
        </div>

        <Card className="glass glow-border overflow-hidden">
          <div className="h-1 bg-gradient-primary" />
          <CardHeader className="text-center pb-2">
            {done ? (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto neon-glow">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-2">
            {done ? (
              <div className="text-center space-y-4 py-4 animate-scale-in">
                <h2 className="text-xl font-heading font-bold">Password Updated!</h2>
                <p className="text-sm text-muted-foreground">
                  Your password has been reset successfully. Redirecting you to the dashboard...
                </p>
              </div>
            ) : !sessionReady ? (
              <div className="text-center space-y-4 py-4">
                <h2 className="text-xl font-heading font-bold">Verifying Link...</h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we verify your reset link. If this takes too long, try requesting a new reset link.
                </p>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <Link to="/auth">
                  <Button variant="outline" className="mt-4 glow-border-hover">Back to Sign In</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-heading font-bold">Set New Password</h2>
                  <p className="text-sm text-muted-foreground mt-1">Enter your new password below.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm">New Password</Label>
                  <div className="relative">
                    <Input id="new-password" type={showPassword ? 'text' : 'password'} required minLength={6}
                      placeholder="Min 6 characters"
                      className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 pr-10"
                      value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-premium">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm">Confirm Password</Label>
                  <Input id="confirm-password" type={showPassword ? 'text' : 'password'} required minLength={6}
                    placeholder="Re-enter password"
                    className="bg-secondary/30 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-premium shadow-lg shadow-primary/25 h-11" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
