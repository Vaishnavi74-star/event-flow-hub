import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-premium">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-gradient">EventHub</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-premium relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-primary transition-all duration-300" />
          </a>
          <a href="#pricing" className="hover:text-foreground transition-premium relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-primary transition-all duration-300" />
          </a>
          <a href="#events" className="hover:text-foreground transition-premium relative group">
            Events
            <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-primary transition-all duration-300" />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-premium shadow-lg shadow-primary/25">
              Get Started
            </Button>
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border/50 animate-slide-down">
          <div className="px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Features</a>
            <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
            <a href="#events" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>Events</a>
            <div className="flex gap-2 pt-2">
              <Link to="/auth" className="flex-1"><Button variant="outline" className="w-full" size="sm">Sign In</Button></Link>
              <Link to="/auth" className="flex-1"><Button className="w-full bg-gradient-primary" size="sm">Get Started</Button></Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
