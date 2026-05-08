import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LabelList } from 'recharts';
import { IndianRupee, Calendar, TrendingUp, Users, ArrowUpRight } from 'lucide-react';

const COLORS = ['hsl(250, 85%, 65%)', 'hsl(210, 100%, 65%)', 'hsl(185, 100%, 55%)', 'hsl(270, 100%, 70%)'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <p className="font-bold text-sm mb-1 text-popover-foreground">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-xs flex items-center gap-2 font-medium" style={{ color: item.color || item.fill }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
            <span className="capitalize">{item.name}</span>: <span className="font-mono font-bold text-foreground">{item.name === 'revenue' ? `₹${item.value}` : item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
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

  const participantsByEvent = bookings?.filter(b => b.status === 'confirmed')
    .reduce((acc, b) => {
      const title = (b.events as any)?.title || 'Unknown';
      acc[title] = (acc[title] || 0) + (b.quantity || 1);
      return acc;
    }, {} as Record<string, number>);

  const revenueData = Object.entries(revenueByEvent || {}).map(([name, revenue]) => ({ name, revenue })).slice(0, 8);
  const participantData = Object.entries(participantsByEvent || {}).map(([name, count]) => ({ name, count })).slice(0, 8);
  
  const totalRevenue = bookings?.filter(b => b.status === 'confirmed').reduce((s, b) => s + Number(b.total_amount), 0) || 0;
  const totalParticipants = bookings?.filter(b => b.status === 'confirmed').reduce((s, b) => s + (b.quantity || 1), 0) || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'from-primary/10 to-accent/5' },
    { title: 'Total Participants', value: totalParticipants.toLocaleString(), icon: Users, color: 'from-neon-cyan/10 to-primary/5' },
    { title: 'Total Events', value: events?.length || 0, icon: Calendar, color: 'from-accent/10 to-neon-cyan/5' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Analytics Overview</h1>
        <p className="text-muted-foreground mt-1 text-lg">Detailed performance tracking for your events</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="glass border-border/50 glow-border-hover hover-lift transition-premium group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-premium duration-500`} />
            <CardContent className="p-6 flex items-center gap-5 relative">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-premium duration-500">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">{s.title}</p>
                <p className="text-3xl font-heading font-bold mt-1">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-border/50 glow-border-hover transition-premium overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading text-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              Revenue by Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} 
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--primary)/0.05)' }} />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#barGradient)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                      animationDuration={1500}
                    >
                      <LabelList 
                        dataKey="revenue" 
                        position="top" 
                        formatter={(val: any) => `₹${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                        style={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 opacity-20" />
                  </div>
                  <p>No revenue data available</p>
                </div>}
          </CardContent>
        </Card>

        <Card className="glass border-border/50 glow-border-hover transition-premium overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading text-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-accent" />
              </div>
              Participants by Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participantData.length > 0 ? (
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={participantData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }} 
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#areaGradient)" 
                      animationDuration={1500}
                      name="Participants"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 opacity-20" />
                  </div>
                  <p>No participant data available</p>
                </div>}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="glass border-border/50 glow-border-hover transition-premium overflow-hidden lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-xl">Event Status</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={70} 
                      outerRadius={90} 
                      dataKey="value" 
                      strokeWidth={5} 
                      stroke="hsl(var(--background))"
                      paddingAngle={5}
                    >
                      {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-center py-16 text-muted-foreground">No events yet</p>}
          </CardContent>
        </Card>

        <Card className="glass border-border/50 glow-border-hover transition-premium overflow-hidden lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-heading text-xl">System Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[300px]">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Average Revenue per Event</p>
                <p className="text-4xl font-heading font-bold">₹{(totalRevenue / (events?.length || 1)).toFixed(0)}</p>
                <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden mt-4">
                  <div className="bg-primary h-full w-[65%]" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Booking Conversion Rate</p>
                <p className="text-4xl font-heading font-bold">84%</p>
                <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden mt-4">
                  <div className="bg-accent h-full w-[84%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
