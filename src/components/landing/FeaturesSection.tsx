import { Card, CardContent } from '@/components/ui/card';
import {
  Zap, Star, Users, Shield, BarChart3, Clock, Ticket, Globe,
  Cpu, Palette,
} from 'lucide-react';

const features = [
  { icon: Zap, title: 'Smart Event Creation', desc: 'Build events in minutes with AI-powered suggestions for pricing, timing, and venue selection.', color: 'from-primary/20 to-accent/10' },
  { icon: Star, title: 'Dynamic Pricing', desc: 'Early bird, regular, and VIP tiers with automatic deadline-based price switching.', color: 'from-neon-purple/20 to-primary/10' },
  { icon: Users, title: 'Role-Based Access', desc: 'Three distinct roles — Admin, Organizer, Participant — each with tailored dashboards.', color: 'from-accent/20 to-neon-cyan/10' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Row-level security, encrypted data, and role-based policies protect every interaction.', color: 'from-neon-cyan/20 to-accent/10' },
  { icon: BarChart3, title: 'Real-time Analytics', desc: 'Interactive charts for revenue, bookings, attendance, and event performance metrics.', color: 'from-primary/20 to-neon-purple/10' },
  { icon: Clock, title: 'Live Seat Updates', desc: 'Atomic transactions ensure no double bookings. Seats update in real-time.', color: 'from-accent/20 to-primary/10' },
  { icon: Ticket, title: 'Instant Booking', desc: 'One-click ticket purchase with multiple payment methods and instant confirmation.', color: 'from-neon-purple/20 to-neon-cyan/10' },
  { icon: Cpu, title: 'AI Assistant', desc: 'Get smart event recommendations, pricing suggestions, and attendee insights powered by AI.', color: 'from-neon-cyan/20 to-primary/10' },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 px-6 relative">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-6xl mx-auto relative">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary font-medium tracking-wider uppercase">
          <Palette className="w-3.5 h-3.5" /> Features
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-bold">
          Everything you need to
          <span className="text-gradient block mt-1">run world-class events</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          A complete ecosystem with intelligent automation, real-time operations, and beautiful analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <Card key={i} className="glass hover-lift transition-premium glow-border-hover group bg-transparent border-border/50 overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-premium`} />
            <CardContent className="p-6 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-premium">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
