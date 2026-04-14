import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, IndianRupee, ArrowRight, Sparkles } from 'lucide-react';

const UpcomingEvents = () => {
  const { data: events } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('events')
        .select('*, categories(name), venues(name, city)')
        .eq('status', 'open')
        .order('start_date', { ascending: true })
        .limit(6);
      return data || [];
    },
  });

  return (
    <section id="events" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary font-medium tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Live Events
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold">
              Happening
              <span className="text-gradient"> soon</span>
            </h2>
            <p className="text-muted-foreground">Discover events that match your interests</p>
          </div>
          <Link to="/auth" className="hidden md:block">
            <Button variant="outline" className="gap-2 glow-border-hover transition-premium">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event, i) => (
              <Card key={event.id} className="glass hover-lift transition-premium glow-border-hover group bg-transparent border-border/50 overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}>
                {/* Top gradient stripe */}
                <div className="h-1 bg-gradient-neon" />
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-premium">
                      {event.title}
                    </h3>
                    {event.categories && (
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full mt-2 inline-block">
                        {(event.categories as any).name}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  )}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary/60" />
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })}
                    </div>
                    {event.venues && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent/60" />
                        {(event.venues as any).name}, {(event.venues as any).city}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-neon-purple/60" />
                        {event.available_seats} seats
                      </div>
                      <div className="flex items-center gap-1 font-heading font-bold text-foreground text-base">
                        <IndianRupee className="w-4 h-4 text-primary" />
                        {Number(event.regular_price).toFixed(0)}
                      </div>
                    </div>
                  </div>
                  <Link to="/auth">
                    <Button className="w-full mt-1 bg-gradient-primary hover:opacity-90 transition-premium shadow-md shadow-primary/20" size="sm">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl glow-border">
            <Calendar className="w-14 h-14 text-muted-foreground mx-auto mb-4 animate-float" />
            <p className="text-muted-foreground text-lg font-heading font-semibold">No upcoming events yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to create one!</p>
            <Link to="/auth">
              <Button className="mt-6 bg-gradient-primary hover:opacity-90 gap-2">
                Create an Event <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="md:hidden text-center mt-8">
          <Link to="/auth">
            <Button variant="outline" className="gap-2 glow-border-hover">
              View All Events <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
