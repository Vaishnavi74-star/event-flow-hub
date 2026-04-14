import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Calendar, MapPin, Users, IndianRupee, Search, Trash2, Edit, Eye, Zap, Sparkles } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/date-time-picker';

const Events = () => {
  const { role, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, categories(name), venues(name, city)')
        .order('start_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await supabase.from('categories').select('*'); return data || []; },
  });

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => { const { data } = await supabase.from('venues').select('*'); return data || []; },
  });

  const emptyForm = {
    title: '', description: '', start_date: '', end_date: '',
    total_seats: 100, regular_price: 0, early_bird_price: 0,
    vip_price: 0, category_id: '', venue_id: '', early_bird_deadline: '',
    status: 'open' as const,
  };
  const [form, setForm] = useState(emptyForm);

  const createEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('events').insert({
        title: form.title, description: form.description || null,
        start_date: form.start_date, end_date: form.end_date,
        total_seats: form.total_seats, available_seats: form.total_seats,
        regular_price: form.regular_price, organizer_id: user!.id,
        status: form.status, category_id: form.category_id || null,
        venue_id: form.venue_id || null,
        early_bird_price: form.early_bird_price || null,
        vip_price: form.vip_price || null,
        early_bird_deadline: form.early_bird_deadline || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Event created!'); queryClient.invalidateQueries({ queryKey: ['events'] }); setOpen(false); setForm(emptyForm); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('events').update({
        title: form.title, description: form.description || null,
        start_date: form.start_date, end_date: form.end_date,
        regular_price: form.regular_price,
        category_id: form.category_id || null, venue_id: form.venue_id || null,
        early_bird_price: form.early_bird_price || null,
        vip_price: form.vip_price || null,
        early_bird_deadline: form.early_bird_deadline || null,
        status: form.status,
      }).eq('id', editingEvent.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Event updated!'); queryClient.invalidateQueries({ queryKey: ['events'] }); setEditingEvent(null); setOpen(false); setForm(emptyForm); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Event deleted'); queryClient.invalidateQueries({ queryKey: ['events'] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const openEdit = (event: any) => {
    setEditingEvent(event);
    setForm({
      title: event.title, description: event.description || '',
      start_date: event.start_date || '', end_date: event.end_date || '',
      total_seats: event.total_seats, regular_price: Number(event.regular_price),
      early_bird_price: Number(event.early_bird_price || 0), vip_price: Number(event.vip_price || 0),
      category_id: event.category_id || '', venue_id: event.venue_id || '',
      early_bird_deadline: event.early_bird_deadline || '', status: event.status,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editingEvent ? updateEvent.mutate() : createEvent.mutate();
  };

  const filtered = events?.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const canCreate = role === 'organizer' || role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Events</h1>
          <p className="text-muted-foreground">Browse and manage events</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingEvent(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90 gap-2 shadow-lg shadow-primary/25 transition-premium">
                <Plus className="w-4 h-4" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto glass-strong border-border/50">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input required value={form.title} className="bg-secondary/30 border-border/50" onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} className="bg-secondary/30 border-border/50 min-h-[80px]" onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DateTimePicker 
                      value={form.start_date} 
                      onChange={v => setForm(f => ({ ...f, start_date: v }))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <DateTimePicker 
                      value={form.end_date} 
                      onChange={v => setForm(f => ({ ...f, end_date: v }))} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Category</Label><Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}><SelectTrigger className="bg-secondary/30 border-border/50"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Venue</Label><Select value={form.venue_id} onValueChange={v => setForm(f => ({ ...f, venue_id: v }))}><SelectTrigger className="bg-secondary/30 border-border/50"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{venues?.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select></div>
                </div>
                {editingEvent && (
                  <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}><SelectTrigger className="bg-secondary/30 border-border/50"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="closed">Closed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Total Seats</Label><Input type="number" min={1} required value={form.total_seats} disabled={!!editingEvent} className="bg-secondary/30 border-border/50" onChange={e => setForm(f => ({ ...f, total_seats: +e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Regular Price ($)</Label><Input type="number" min={0} step="0.01" required value={form.regular_price} className="bg-secondary/30 border-border/50" onChange={e => setForm(f => ({ ...f, regular_price: +e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Early Bird ($)</Label><Input type="number" min={0} step="0.01" value={form.early_bird_price} className="bg-secondary/30 border-border/50" onChange={e => setForm(f => ({ ...f, early_bird_price: +e.target.value }))} /></div>
                  <div className="space-y-2"><Label>VIP Price ($)</Label><Input type="number" min={0} step="0.01" value={form.vip_price} className="bg-secondary/30 border-border/50" onChange={e => setForm(f => ({ ...f, vip_price: +e.target.value }))} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Early Bird Deadline</Label>
                  <DateTimePicker 
                    value={form.early_bird_deadline} 
                    onChange={v => setForm(f => ({ ...f, early_bird_deadline: v }))} 
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-lg shadow-primary/25 h-11" disabled={createEvent.isPending || updateEvent.isPending}>
                  {editingEvent ? (updateEvent.isPending ? 'Updating...' : 'Update Event') : (createEvent.isPending ? 'Creating...' : 'Create Event')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-10 bg-secondary/30 border-border/50" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] bg-secondary/30 border-border/50"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Event Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-64 glass rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((event, i) => {
            const isOwner = event.organizer_id === user?.id;
            return (
              <Card key={event.id} className="glass hover-lift transition-premium glow-border-hover group bg-transparent border-border/50 overflow-hidden"
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className="h-1 bg-gradient-neon" />
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-semibold text-base group-hover:text-primary transition-premium">{event.title}</h3>
                      {event.categories && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium">
                          {(event.categories as any).name}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider ${
                      event.status === 'open' ? 'bg-primary/10 text-primary'
                        : event.status === 'cancelled' ? 'bg-destructive/10 text-destructive'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {event.status}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  )}

                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary/50" />{new Date(event.start_date).toLocaleDateString()}</div>
                    {event.venues && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-accent/50" />{(event.venues as any).name}, {(event.venues as any).city}</div>}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-neon-purple/50" />{event.available_seats}/{event.total_seats}</div>
                      <div className="flex items-center gap-1 font-heading font-bold text-foreground"><IndianRupee className="w-3.5 h-3.5 text-primary" />{Number(event.regular_price).toFixed(0)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 glow-border-hover transition-premium" onClick={() => navigate(`/events/${event.id}`)}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    {(isOwner || role === 'admin') && (
                      <>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-premium" onClick={() => openEdit(event)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive transition-premium"
                          onClick={() => { if (confirm('Delete this event?')) deleteEvent.mutate(event.id); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filtered?.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-lg font-heading">No events found</p>
        </div>
      )}
    </div>
  );
};

export default Events;
