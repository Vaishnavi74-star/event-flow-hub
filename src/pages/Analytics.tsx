import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { IndianRupee, Calendar, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const COLORS = ['hsl(250, 85%, 65%)', 'hsl(210, 100%, 65%)', 'hsl(185, 100%, 55%)', 'hsl(270, 100%, 70%)'];

const tooltipStyle = {
  background: 'hsl(232, 30%, 8%)',
  border: '1px solid hsl(232, 20%, 14%)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px -8px hsl(0, 0%, 0%, 0.5)',
};

const Analytics = () => {
  const { data: events } = useQuery({
    queryKey: ['analytics-events'],
    queryFn: async () => { const { data } = await supabase.from('events').select('*'); return data || []; },
  });

  const { data: bookings } = useQuery({
    queryKey: ['analytics-bookings'],
    queryFn: async () => { const { data } = await supabase.from('bookings').select('*, events(title)'); return data || []; },
  });

  const statusData = [
    { name: 'Open', value: events?.filter(e => e.status === 'open').length || 0 },
    { name: 'Draft', value: events?.filter(e => e.status === 'draft').length || 0 },
    { name: 'Closed', value: events?.filter(e => e.status === 'closed').length || 0 },
    { name: 'Cancelled', value: events?.filter(e => e.status === 'cancelled').length || 0 },
  ].filter(d => d.value > 0);

  const revenueByEvent = bookings?.filter(b => b.status === 'confirmed')
    .reduce((acc, b) => {
      const title = (b.events as any)?.title || 'Unknown';
      acc[title] = (acc[title] || 0) + Number(b.total_amount);
      return acc;
    }, {} as Record<string, number>);

  const revenueData = Object.entries(revenueByEvent || {}).map(([name, revenue]) => ({ name, revenue })).slice(0, 10);
  const totalRevenue = bookings?.filter(b => b.status === 'confirmed').reduce((s, b) => s + Number(b.total_amount), 0) || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'from-primary/10 to-accent/5' },
    { title: 'Total Events', value: events?.length || 0, icon: Calendar, color: 'from-accent/10 to-neon-cyan/5' },
    { title: 'Confirmed Bookings', value: confirmedBookings, icon: TrendingUp, color: 'from-neon-purple/10 to-primary/5' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track performance across your events</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="glass glow-border-hover hover-lift transition-premium group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-premium`} />
            <CardContent className="p-5 flex items-center gap-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-premium">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.title}</p>
                <p className="text-2xl font-heading font-bold mt-0.5">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass glow-border-hover transition-premium overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              Revenue by Event
              <ArrowUpRight className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(250, 85%, 65%)" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(210, 100%, 65%)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(232, 20%, 14%)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(220, 15%, 50%)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'hsl(220, 15%, 50%)', fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-16 text-muted-foreground">No revenue data yet</p>}
          </CardContent>
        </Card>

        <Card className="glass glow-border-hover transition-premium overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-lg">Event Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, i) => (
                      <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={65} outerRadius={105} dataKey="value" strokeWidth={2} stroke="hsl(232, 30%, 8%)"
                    label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={`url(#pieGrad${i % COLORS.length})`} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-16 text-muted-foreground">No events yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
