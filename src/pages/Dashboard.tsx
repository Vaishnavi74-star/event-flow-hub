import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Ticket, IndianRupee, TrendingUp, Users, ArrowUpRight, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StatCard = ({ title, value, icon: Icon, trend, color }: {
  title: string; value: string | number; icon: any; trend?: string; color?: string;
}) => (
  <Card className="glass glow-border-hover hover-lift transition-premium group overflow-hidden relative">
    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-premium ${color || 'from-primary/10 to-transparent'}`} />
    <CardContent className="p-5 relative">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-heading font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-primary flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> {trend}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-premium">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const { data: events } = useQuery({
    queryKey: ['events-count'],
    queryFn: async () => {
      const { data } = await supabase.from('events').select('id, title, available_seats, total_seats, status, start_date, regular_price');
      return data || [];
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings-count'],
    queryFn: async () => {
      const { data } = await supabase.from('bookings').select('id, total_amount, status');
      return data || [];
    },
  });

  const openEvents = events?.filter(e => e.status === 'open').length || 0;
  const totalBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const totalRevenue = bookings?.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

  const greetings: Record<string, { title: string; subtitle: string }> = {
    admin: { title: 'Admin Dashboard', subtitle: 'Platform overview and management' },
    organizer: { title: 'Organizer Dashboard', subtitle: 'Your events at a glance' },
    participant: { title: 'Welcome Back', subtitle: 'Discover and book amazing events' },
  };

  const greeting = greetings[role || 'participant'];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero header */}
      <div className="glass rounded-2xl p-8 glow-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-primary/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[150px] bg-accent/5 rounded-full blur-[60px]" />
          <div className="bg-dots absolute inset-0 opacity-10" />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">{greeting.title}</h1>
            <p className="text-muted-foreground mt-2">{greeting.subtitle}</p>
          </div>
          {(role === 'organizer' || role === 'admin') && (
            <Button onClick={() => navigate('/events')} className="bg-gradient-primary hover:opacity-90 gap-2 shadow-lg shadow-primary/25 transition-premium">
              <Zap className="w-4 h-4" /> Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Events" value={openEvents} icon={Calendar} trend="+12% this month" color="from-primary/10 to-accent/5" />
        <StatCard title="Total Bookings" value={totalBookings} icon={Ticket} trend="+8% this week" color="from-accent/10 to-neon-cyan/5" />
        <StatCard title="Revenue" value={`₹${totalRevenue.toFixed(2)}`} icon={IndianRupee} trend="+23% growth" color="from-neon-purple/10 to-primary/5" />
        <StatCard title="Total Events" value={events?.length || 0} icon={TrendingUp} color="from-neon-cyan/10 to-accent/5" />
      </div>

      {/* Recent events */}
      <Card className="glass glow-border-hover transition-premium overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-heading text-lg">Recent Events</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/events')} className="text-primary hover:text-primary/80 text-xs gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="space-y-2">
              {events.slice(0, 5).map((event, i) => (
                <div key={event.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-premium cursor-pointer group"
                  onClick={() => navigate(`/events/${event.id}`)}
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-premium">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-premium">{event.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(event.start_date).toLocaleDateString()} · ${Number(event.regular_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      event.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      <Users className="w-3 h-3 inline mr-1" />{event.available_seats}/{event.total_seats}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary/40" />
              </div>
              <p className="text-muted-foreground">No events yet. Create your first event!</p>
              <Button onClick={() => navigate('/events')} className="mt-4 bg-gradient-primary hover:opacity-90 gap-2">
                <Zap className="w-4 h-4" /> Create Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
