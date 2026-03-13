import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import CycleCalendar from '../components/period/CycleCalendar';
import DayLogForm from '../components/period/DayLogForm';
import CycleInsights from '../components/period/CycleInsights';

export default function PeriodTracker() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery({
    queryKey: ['period-logs'],
    queryFn: () => base44.entities.PeriodLog.list('-date', 500),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PeriodLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period-logs'] });
      toast.success('Log saved!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PeriodLog.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period-logs'] });
      toast.success('Log updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PeriodLog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['period-logs'] });
      toast.success('Log removed.');
    },
  });

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const existingLog = logs.find(l => l.date === selectedDateStr);

  // Predict next period
  const predictedDays = useMemo(() => {
    const periodDays = logs.filter(l => l.is_period_day).sort((a, b) => a.date.localeCompare(b.date));
    if (periodDays.length < 2) return [];

    const cycleStarts = [periodDays[0].date];
    for (let i = 1; i < periodDays.length; i++) {
      const gap = differenceInDays(parseISO(periodDays[i].date), parseISO(periodDays[i - 1].date));
      if (gap > 3) cycleStarts.push(periodDays[i].date);
    }

    if (cycleStarts.length < 2) return [];

    const cycleLengths = [];
    for (let i = 1; i < cycleStarts.length; i++) {
      cycleLengths.push(differenceInDays(parseISO(cycleStarts[i]), parseISO(cycleStarts[i - 1])));
    }
    const avgCycle = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
    const lastStart = parseISO(cycleStarts[cycleStarts.length - 1]);
    const nextStart = addDays(lastStart, avgCycle);

    return Array.from({ length: 5 }, (_, i) => format(addDays(nextStart, i), 'yyyy-MM-dd'));
  }, [logs]);

  const handleSave = (formData) => {
    if (existingLog) {
      updateMutation.mutate({ id: existingLog.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-serif text-3xl font-semibold text-foreground">Cycle Tracker</h2>
        <p className="text-muted-foreground mt-1">Track your cycle with care and awareness.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CycleCalendar
            logs={logs}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onDayClick={setSelectedDate}
            predictedDays={predictedDays}
          />
          <CycleInsights logs={logs} />
        </div>
        <DayLogForm
          date={selectedDate}
          existingLog={existingLog}
          onSave={handleSave}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
    </div>
  );
}