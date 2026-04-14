import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="py-12 px-6 border-t border-border/50">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-gradient">EventHub</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-premium">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-premium">Pricing</a>
          <a href="#events" className="hover:text-foreground transition-premium">Events</a>
          <Link to="/auth" className="hover:text-foreground transition-premium">Sign In</Link>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
