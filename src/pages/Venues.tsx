import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, MapPin } from 'lucide-react';

const Venues = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', capacity: 100, description: '' });

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => { const { data } = await supabase.from('venues').select('*'); return data || []; },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('venues').insert(form);
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Venue created'); queryClient.invalidateQueries({ queryKey: ['venues'] }); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Venues</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Venue</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Add Venue</DialogTitle></DialogHeader>
            <form onSubmit={e => { e.preventDefault(); create.mutate(); }} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Address</Label><Input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>City</Label><Input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Capacity</Label><Input type="number" min={1} required value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={create.isPending}>Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues?.map(v => (
          <Card key={v.id} className="glass">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                <div><p className="font-heading font-semibold">{v.name}</p><p className="text-xs text-muted-foreground">{v.city}</p></div>
              </div>
              <p className="text-sm text-muted-foreground">{v.address}</p>
              <p className="text-sm mt-2">Capacity: <span className="text-primary font-medium">{v.capacity}</span></p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Venues;
