import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function CycleCalendar({ logs, currentMonth, onMonthChange, onDayClick, predictedDays }) {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDay = getDay(start);

  const isPeriodDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs.some(l => l.date === dateStr && l.is_period_day);
  };

  const isPredicted = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return predictedDays?.includes(dateStr);
  };

  const hasLog = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs.some(l => l.date === dateStr);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => onMonthChange(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy')}</h3>
        <Button variant="ghost" size="icon" onClick={() => onMonthChange(addMonths(currentMonth, 1))}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const period = isPeriodDay(day);
          const predicted = isPredicted(day);
          const logged = hasLog(day);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center text-sm transition-all relative",
                period && "bg-chart-3 text-white font-medium",
                !period && predicted && "bg-chart-3/20 text-chart-3",
                !period && !predicted && logged && "bg-primary/10 text-primary",
                !period && !predicted && !logged && "hover:bg-muted text-foreground",
                isToday && !period && "ring-2 ring-primary/40"
              )}
            >
              {day.getDate()}
              {logged && !period && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-chart-3" />
          Period
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-chart-3/30" />
          Predicted
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-primary/30" />
          Logged
        </div>
      </div>
    </div>
  );
}