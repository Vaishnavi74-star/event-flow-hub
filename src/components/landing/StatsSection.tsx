import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Tag, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AnimatedNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{count}+</div>;
};

const StatsSection = () => {
  const { data: stats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const [eventsRes, venuesRes, categoriesRes] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('venues').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);
      return {
        events: eventsRes.count || 0,
        venues: venuesRes.count || 0,
        categories: categoriesRes.count || 0,
      };
    },
  });

  const items = [
    { icon: Calendar, value: stats?.events || 0, label: 'Active Events', color: 'text-primary' },
    { icon: MapPin, value: stats?.venues || 0, label: 'Venues', color: 'text-accent' },
    { icon: Tag, value: stats?.categories || 0, label: 'Categories', color: 'text-neon-purple' },
    { icon: Users, value: 3, label: 'User Roles', color: 'text-neon-cyan' },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 relative">
        {items.map((item, i) => (
          <div key={i} className="glass rounded-2xl p-6 text-center space-y-3 hover-lift transition-premium glow-border-hover group">
            <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-premium`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <p className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              <AnimatedNumber target={item.value} />
            </p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
