import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'Perfect for discovering events',
    features: ['Browse unlimited events', 'Book up to 5 tickets/month', 'Basic event filtering', 'Email notifications'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹2,499',
    period: '/month',
    desc: 'For organizers who mean business',
    features: ['Create unlimited events', 'Dynamic ticket pricing', 'Real-time analytics dashboard', 'Priority support', 'AI event suggestions', 'Custom branding'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Full platform control',
    features: ['Everything in Pro', 'Admin dashboard access', 'User & role management', 'API access', 'Dedicated support', 'White-label solution'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="py-24 px-6 relative">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
    </div>

    <div className="max-w-5xl mx-auto relative">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary font-medium tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Pricing
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-bold">
          Simple, transparent
          <span className="text-gradient block mt-1">pricing for everyone</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <Card key={i} className={`relative overflow-hidden transition-premium hover-lift ${
            plan.popular
              ? 'glass glow-border neon-glow'
              : 'glass border-border/50 glow-border-hover'
          }`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-xl">
                Most Popular
              </div>
            )}
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-primary">{plan.name}</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-heading font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button className={`w-full gap-2 ${plan.popular ? 'bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
