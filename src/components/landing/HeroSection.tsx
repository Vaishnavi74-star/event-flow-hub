import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

const HeroSection = () => (
  <section className="relative pt-28 pb-24 px-6 overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/3 rounded-full blur-[150px]" />
      <div className="bg-grid absolute inset-0 opacity-30" />
    </div>

    <div className="max-w-5xl mx-auto text-center space-y-8 relative">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm animate-fade-in glow-border">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">The future of event management is here</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-[1.05] animate-slide-up tracking-tight">
        Create Stunning
        <br />
        <span className="text-gradient-neon">Events That</span>
        <br />
        <span className="text-gradient">Inspire</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in">
        The all-in-one platform for creating, discovering, and managing events.
        Built with AI-powered suggestions, real-time analytics, and dynamic pricing.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
        <Link to="/auth">
          <Button size="lg" className="gap-2 text-base px-8 h-13 bg-gradient-primary hover:opacity-90 transition-premium shadow-lg shadow-primary/30 neon-glow">
            Start Free Today <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <a href="#features">
          <Button size="lg" variant="outline" className="text-base px-8 h-13 gap-2 glow-border-hover transition-premium">
            <Play className="w-4 h-4" /> See How It Works
          </Button>
        </a>
      </div>

      {/* Social proof */}
      <div className="flex flex-wrap items-center justify-center gap-8 pt-8 animate-fade-in">
        <div className="flex -space-x-2">
          {['bg-primary', 'bg-accent', 'bg-neon-purple', 'bg-neon-cyan'].map((bg, i) => (
            <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-foreground`}>
              {['A', 'B', 'C', 'D'][i]}
            </div>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">500+</span> event organizers trust EventHub
        </div>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <svg key={i} className="w-4 h-4 text-warning fill-warning" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-sm text-muted-foreground ml-1">4.9/5</span>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
