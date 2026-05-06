import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Ticket, XCircle, Calendar, IndianRupee, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import QRTicket from '@/components/QRTicket';

const Bookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, events(title, start_date, end_date)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase.rpc('cancel_booking', { p_booking_id: bookingId });
      if (error) throw error;
      if (!data) throw new Error('Could not cancel booking');
    },
    onSuccess: () => {
      toast.success('Booking cancelled and refunded');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Your event reservations</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-secondary rounded-xl animate-pulse" />)}
        </div>
      ) : bookings && bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map(booking => (
            <Card key={booking.id} className="glass">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    booking.status === 'confirmed' ? 'bg-primary/10' : 'bg-destructive/10'
                  }`}>
                    <Ticket className={`w-5 h-5 ${booking.status === 'confirmed' ? 'text-primary' : 'text-destructive'}`} />
                  </div>
                  <div>
                    <p className="font-medium">{(booking.events as any)?.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date((booking.events as any)?.start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        ₹{Number(booking.total_amount).toFixed(2)}
                      </span>
                      <span className="capitalize">{booking.ticket_type} × {booking.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === 'confirmed' && (
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <QrCode className="w-4 h-4" /> View Ticket
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px] p-0 border-none bg-transparent shadow-none">
                          <DialogTitle className="sr-only">Your Ticket</DialogTitle>
                          <DialogDescription className="sr-only">Scan this QR code at the venue</DialogDescription>
                          <QRTicket
                            bookingId={booking.id}
                            eventTitle={(booking.events as any)?.title}
                            ticketType={booking.ticket_type}
                            quantity={booking.quantity}
                            date={(booking.events as any)?.start_date}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => cancelBooking.mutate(booking.id)} title="Cancel Booking">
                        <XCircle className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No bookings yet. Browse events to get started!</p>
        </div>
      )}
    </div>
  );
};

export default Bookings;
