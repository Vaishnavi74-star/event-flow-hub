import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Star, MessageSquare } from 'lucide-react';

const Feedback = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [eventId, setEventId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: events } = useQuery({
    queryKey: ['my-booked-events'],
    queryFn: async () => {
      const { data } = await supabase.from('bookings').select('event_id, events(id, title)').eq('status', 'confirmed');
      return data?.map(b => (b.events as any)) || [];
    },
  });

  const { data: feedbacks } = useQuery({
    queryKey: ['my-feedback'],
    queryFn: async () => {
      const { data } = await supabase.from('feedback').select('*, events(title)').eq('user_id', user!.id);
      return data || [];
    },
  });

  const submit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('feedback').insert({ user_id: user!.id, event_id: eventId, rating, comment });
      if (error) throw error;
    },
    onSuccess: () => { toast.success('Feedback submitted'); queryClient.invalidateQueries({ queryKey: ['my-feedback'] }); setComment(''); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold">Feedback</h1>

      <Card className="glass">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-heading font-semibold">Leave Feedback</h2>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger><SelectValue placeholder="Select event..." /></SelectTrigger>
            <SelectContent>{events?.map(e => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)}>
                <Star className={`w-6 h-6 ${s <= rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
          <Textarea placeholder="Your thoughts..." value={comment} onChange={e => setComment(e.target.value)} />
          <Button onClick={() => submit.mutate()} disabled={!eventId || submit.isPending}>Submit</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {feedbacks?.map(f => (
          <Card key={f.id} className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{(f.events as any)?.title}</p>
                <div className="flex items-center gap-1 my-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= f.rating ? 'text-warning fill-warning' : 'text-muted'}`} />)}
                </div>
                {f.comment && <p className="text-sm text-muted-foreground">{f.comment}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
