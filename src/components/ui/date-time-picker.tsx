import * as React from "react";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value?: string; // ISO string or datetime-local string
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  className,
  placeholder = "Pick a date",
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [time, setTime] = React.useState<string>(
    value ? format(new Date(value), "HH:mm") : "00:00"
  );

  React.useEffect(() => {
    if (value) {
      const d = new Date(value);
      setDate(d);
      setTime(format(d, "HH:mm"));
    }
  }, [value]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    
    // Combine date and time
    const combined = new Date(newDate);
    const [hours, minutes] = time.split(":").map(Number);
    combined.setHours(hours);
    combined.setMinutes(minutes);
    
    onChange?.(combined.toISOString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    
    if (date) {
      const combined = new Date(date);
      const [hours, minutes] = newTime.split(":").map(Number);
      combined.setHours(hours);
      combined.setMinutes(minutes);
      onChange?.(combined.toISOString());
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-secondary/30 border-border/50 transition-premium hover:bg-secondary/50",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
          {date ? format(date, "PPP p") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 glass-strong border-border/50" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className="p-3"
        />
        <div className="p-3 border-t border-border/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Time</span>
          </div>
          <Input
            type="time"
            value={time}
            onChange={handleTimeChange}
            className="w-[120px] bg-secondary/30 border-border/50 text-foreground"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
