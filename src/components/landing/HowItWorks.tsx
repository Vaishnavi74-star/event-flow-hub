import { UserPlus, Search, Ticket, PartyPopper } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Sign up in seconds and choose your role — Organizer or Participant.', gradient: 'from-primary to-accent' },
  { icon: Search, title: 'Discover Events', desc: "Browse by category, venue, or date. AI suggests events you'll love.", gradient: 'from-accent to-neon-cyan' },
  { icon: Ticket, title: 'Book Instantly', desc: 'Choose ticket type, select quantity, and confirm — all in one click.', gradient: 'from-neon-cyan to-neon-purple' },
  { icon: PartyPopper, title: 'Enjoy & Review', desc: 'Attend amazing events and share your experience with the community.', gradient: 'from-neon-purple to-primary' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background pointer-events-none" />

    <div className="max-w-5xl mx-auto relative">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary font-medium tracking-wider uppercase">
          How It Works
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-bold">
          Get started in
          <span className="text-gradient"> minutes</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="text-center space-y-4 relative group">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px">
                <div className={`h-full bg-gradient-to-r ${step.gradient} opacity-30`} />
              </div>
            )}

            <div className="relative mx-auto w-fit">
              <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center group-hover:glow-border transition-premium group-hover:scale-105">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                {i + 1}
              </span>
            </div>

            <h3 className="font-heading font-semibold text-lg">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
