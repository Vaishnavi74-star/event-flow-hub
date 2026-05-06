import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Calendar, MapPin, Users, IndianRupee, ArrowLeft, Ticket, Clock,
  Star, Tag, Zap, Shield, Sparkles, Trophy, Medal
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import SocialShare from '@/components/SocialShare';
import WeatherWidget from '@/components/WeatherWidget';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ticketType, setTicketType] = useState<string>('regular');
  const [quantity, setQuantity] = useState(1);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*, categories(name), venues(name, city, address)').eq('id', id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: feedbacks } = useQuery({
    queryKey: ['event-feedback', id],
    queryFn: async () => {
      const { data } = await supabase.from('feedback').select('*, profiles!feedback_user_id_fkey(full_name)').eq('event_id', id!);
      return data || [];
    },
    enabled: !!id,
  });

  const bookEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('book_event', { p_event_id: id!, p_ticket_type: ticketType as any, p_quantity: quantity });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Booking confirmed!'); queryClient.invalidateQueries({ queryKey: ['event', id] }); queryClient.invalidateQueries({ queryKey: ['my-bookings'] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const getPrice = () => {
    if (!event) return 0;
    let unitPrice = Number(event.regular_price);
    if (ticketType === 'early_bird' && event.early_bird_price && event.early_bird_deadline && new Date(event.early_bird_deadline) > new Date()) {
      unitPrice = Number(event.early_bird_price);
    } else if (ticketType === 'vip' && event.vip_price) {
      unitPrice = Number(event.vip_price);
    }
    return unitPrice * quantity;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) return <p className="text-center py-12 text-muted-foreground">Event not found</p>;

  const avgRating = feedbacks && feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : null;

  const seatPercentage = event ? ((event.total_seats - event.available_seats) / event.total_seats) * 100 : 0;

  // Parse Prize Pool from description if it exists
  let displayDescription = event?.description || '';
  let prizePool = null;
  if (displayDescription.includes('---PRIZEPOOL---')) {
    const parts = displayDescription.split('---PRIZEPOOL---');
    displayDescription = parts[0].trim();
    try {
      prizePool = JSON.parse(parts[1].trim());
    } catch (e) {}
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Button>

      {/* Event header */}
      <div className="glass rounded-2xl p-8 glow-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-primary/8 rounded-full blur-[80px]" />
          <div className="bg-dots absolute inset-0 opacity-10" />
        </div>
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold">{event.title}</h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {event.categories && (
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                    <Tag className="w-3 h-3" /> {(event.categories as any).name}
                  </span>
                )}
                <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
                  event.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>{event.status}</span>
                {avgRating && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground glass px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 text-warning fill-warning" /> {avgRating}
                  </span>
                )}
              </div>
            </div>
            {event.status === 'open' && (
              <div className="glass px-6 py-4 rounded-2xl glow-border">
                <CountdownTimer targetDate={event.start_date} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
            <Card className="glass border-none shadow-none bg-transparent sm:col-span-2">
              <CardContent className="p-0">
                <h3 className="font-heading font-bold text-xl mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> About This Event
                </h3>
                <div className="prose prose-invert max-w-none text-muted-foreground/90 whitespace-pre-line leading-relaxed">
                  {displayDescription || 'No description provided.'}
                </div>
              </CardContent>
            </Card>

            {prizePool && (prizePool.first > 0 || prizePool.second > 0 || prizePool.third > 0) && (
              <Card className="glass sm:col-span-2 glow-border overflow-hidden bg-gradient-to-br from-secondary/50 to-transparent">
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2 text-neon-purple">
                    <Trophy className="w-5 h-5" /> Event Prize Pool
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {prizePool.first > 0 && (
                      <div className="flex flex-col items-center p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 relative overflow-hidden group hover:scale-105 transition-premium">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl" />
                        <Medal className="w-10 h-10 text-yellow-500 mb-2 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">1st Prize</p>
                        <p className="text-xl font-heading font-bold text-yellow-500">₹{prizePool.first}</p>
                      </div>
                    )}
                    {prizePool.second > 0 && (
                      <div className="flex flex-col items-center p-4 rounded-xl bg-gray-400/10 border border-gray-400/20 relative overflow-hidden group hover:scale-105 transition-premium">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gray-400/10 rounded-full blur-xl" />
                        <Medal className="w-10 h-10 text-gray-400 mb-2 drop-shadow-[0_0_8px_rgba(156,163,175,0.5)]" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">2nd Prize</p>
                        <p className="text-xl font-heading font-bold text-gray-300">₹{prizePool.second}</p>
                      </div>
                    )}
                    {prizePool.third > 0 && (
                      <div className="flex flex-col items-center p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 relative overflow-hidden group hover:scale-105 transition-premium">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl" />
                        <Medal className="w-10 h-10 text-orange-500 mb-2 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">3rd Prize</p>
                        <p className="text-xl font-heading font-bold text-orange-400">₹{prizePool.third}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="glass glow-border-hover transition-premium overflow-hidden">
            <CardHeader><CardTitle className="font-heading">Event Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: 'Start', value: new Date(event.start_date).toLocaleString(), color: 'text-primary' },
                { icon: Clock, label: 'End', value: new Date(event.end_date).toLocaleString(), color: 'text-accent' },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <d.icon className={`w-5 h-5 ${d.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{d.label}</p>
                    <p className="text-sm font-medium">{d.value}</p>
                  </div>
                </div>
              ))}
              {event.venues && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Venue</p>
                    <p className="text-sm font-medium">{(event.venues as any).name} — {(event.venues as any).address}, {(event.venues as any).city}</p>
                  </div>
                </div>
              )}
              {/* Google Maps Embed */}
              {event.venues && (
                <div className="sm:col-span-2 rounded-xl overflow-hidden glow-border" style={{ height: '250px' }}>
                  <iframe
                    title="Venue Location"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${(event.venues as any).name}, ${(event.venues as any).address}, ${(event.venues as any).city}`)}&output=embed`}
                  />
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 sm:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-neon-cyan" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Seats</p>
                  <p className="text-sm font-medium">{event.available_seats} / {event.total_seats} available</p>
                  <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full transition-all duration-500" style={{ width: `${seatPercentage}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Widget */}
          {event.venues && (
            <WeatherWidget city={(event.venues as any).city} date={event.start_date} />
          )}

          {/* Reviews */}
          {feedbacks && feedbacks.length > 0 && (
            <Card className="glass glow-border-hover transition-premium overflow-hidden">
              <CardHeader><CardTitle className="font-heading">Reviews ({feedbacks.length})</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {feedbacks.map(f => (
                  <div key={f.id} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-premium">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= f.rating ? 'text-warning fill-warning' : 'text-muted'}`} />)}</div>
                      <span className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</span>
                    </div>
                    {f.comment && <p className="text-sm text-muted-foreground">{f.comment}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking sidebar */}
        <div className="space-y-4">
          <Card className="glass glow-border overflow-hidden">
            <div className="h-1 bg-gradient-neon" />
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" /> Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <span className="text-sm flex items-center gap-2"><Ticket className="w-3.5 h-3.5 text-muted-foreground" /> Regular</span>
                <span className="font-heading font-bold">₹{Number(event.regular_price).toFixed(2)}</span>
              </div>
              {event.early_bird_price && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 glow-border">
                  <div>
                    <span className="text-sm text-primary flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Early Bird</span>
                    {event.early_bird_deadline && <p className="text-[10px] text-muted-foreground mt-0.5">Until {new Date(event.early_bird_deadline).toLocaleDateString()}</p>}
                  </div>
                  <span className="font-heading font-bold text-primary">₹{Number(event.early_bird_price).toFixed(2)}</span>
                </div>
              )}
              {event.vip_price && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                  <span className="text-sm flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-neon-purple" /> VIP</span>
                  <span className="font-heading font-bold">₹{Number(event.vip_price).toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {role === 'participant' && event.status === 'open' && event.available_seats > 0 && (
            <Card className="glass glow-border overflow-hidden">
              <div className="h-1 bg-gradient-primary" />
              <CardHeader><CardTitle className="font-heading text-base">Book Tickets</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Ticket Type</Label>
                  <Select value={ticketType} onValueChange={setTicketType}>
                    <SelectTrigger className="bg-secondary/30 border-border/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      {event.early_bird_price && event.early_bird_deadline && new Date(event.early_bird_deadline) > new Date() && <SelectItem value="early_bird">Early Bird</SelectItem>}
                      {event.vip_price && <SelectItem value="vip">VIP</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Quantity</Label>
                  <Input type="number" min={1} max={event.available_seats} value={quantity} className="bg-secondary/30 border-border/50"
                    onChange={e => setQuantity(Math.max(1, +e.target.value))} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 glow-border">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-xl font-heading font-bold text-gradient">₹{getPrice().toFixed(2)}</span>
                </div>
                <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25 h-11 text-base transition-premium" onClick={() => bookEvent.mutate()} disabled={bookEvent.isPending}>
                  {bookEvent.isPending ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </CardContent>
            </Card>
          )}

          {event.status === 'open' && event.available_seats === 0 && (
            <Card className="glass border-destructive/30 overflow-hidden">
              <div className="h-1 bg-destructive" />
              <CardContent className="p-6 text-center">
                <p className="text-destructive font-heading font-bold">Sold Out</p>
                <p className="text-sm text-muted-foreground mt-1">All seats have been booked</p>
              </CardContent>
            </Card>
          )}

          <Card className="glass glow-border overflow-hidden">
            <CardContent className="p-6">
              <SocialShare title={event.title} description={event.description || 'Join this amazing event on EventHub!'} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
