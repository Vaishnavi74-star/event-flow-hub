import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';

const CTASection = () => (
  <section className="py-24 px-6 relative">
    <div className="max-w-4xl mx-auto relative">
      <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden glow-border">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-accent/8 rounded-full blur-[80px]" />
          <div className="bg-dots absolute inset-0 opacity-20" />
        </div>

        <div className="relative text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 text-sm text-primary">
            <Zap className="w-4 h-4" />
            Ready to get started?
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight">
            Start Creating
            <span className="text-gradient-neon block mt-1">Amazing Events Today</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join thousands of organizers who trust EventHub to create unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-base px-10 h-13 bg-gradient-primary hover:opacity-90 transition-premium shadow-lg shadow-primary/30 neon-glow">
                Create Your Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
