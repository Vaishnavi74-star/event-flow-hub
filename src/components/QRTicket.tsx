import { QrCode, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRTicketProps {
  bookingId: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  date: string;
}

const QRTicket = ({ bookingId, eventTitle, ticketType, quantity, date }: QRTicketProps) => {
  const qrData = `EVENTHUB-TICKET:${bookingId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=0a0a0a&color=a78bfa&format=png`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-${bookingId.slice(0, 8)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(qrUrl, '_blank');
    }
  };

  return (
    <div className="glass glow-border rounded-2xl overflow-hidden relative group">
      {/* Ticket header stripe */}
      <div className="h-1.5 bg-gradient-neon" />

      {/* Ticket perforated edge effect */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-background" />

      <div className="p-5 space-y-4">
        {/* Event info */}
        <div className="text-center">
          <p className="text-[10px] text-primary uppercase tracking-widest font-semibold">EventHub Ticket</p>
          <h3 className="font-heading font-bold text-lg mt-1 truncate">{eventTitle}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-border/50" />

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-3 rounded-xl bg-white">
            <img
              src={qrUrl}
              alt="Ticket QR Code"
              className="w-[140px] h-[140px]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Ticket details */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="text-muted-foreground uppercase tracking-wider">Type</p>
            <p className="font-medium capitalize mt-0.5">{ticketType.replace('_', ' ')}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground uppercase tracking-wider">Qty</p>
            <p className="font-medium mt-0.5">{quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground uppercase tracking-wider">ID</p>
            <p className="font-mono font-medium mt-0.5 text-primary">{bookingId.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Download button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 glow-border-hover transition-premium"
          onClick={handleDownload}
        >
          <Download className="w-3.5 h-3.5" />
          Download Ticket
        </Button>
      </div>
    </div>
  );
};

export default QRTicket;
