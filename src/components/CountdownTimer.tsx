import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        Event has started or ended
      </div>
    );
  }

  if (!timeLeft) return null;

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 glow-border flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
              <span className="text-xl font-heading font-bold text-primary relative">
                {String(block.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-medium">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-primary/50 font-bold text-lg mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
