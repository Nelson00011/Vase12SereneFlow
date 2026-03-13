import React from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Activity, Calendar, Droplets } from 'lucide-react';

export default function CycleInsights({ logs }) {
  const periodDays = logs.filter(l => l.is_period_day).sort((a, b) => a.date.localeCompare(b.date));

  // Find cycle starts (first period day after a gap)
  const cycleStarts = [];
  for (let i = 0; i < periodDays.length; i++) {
    if (i === 0) {
      cycleStarts.push(periodDays[i].date);
    } else {
      const gap = differenceInDays(parseISO(periodDays[i].date), parseISO(periodDays[i - 1].date));
      if (gap > 3) {
        cycleStarts.push(periodDays[i].date);
      }
    }
  }

  // Calculate average cycle length
  const cycleLengths = [];
  for (let i = 1; i < cycleStarts.length; i++) {
    cycleLengths.push(differenceInDays(parseISO(cycleStarts[i]), parseISO(cycleStarts[i - 1])));
  }
  const avgCycleLength = cycleLengths.length > 0
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 28;

  // Calculate average period length
  const periodLengths = [];
  let currentPeriodStart = null;
  let currentPeriodEnd = null;
  for (const day of periodDays) {
    if (!currentPeriodStart) {
      currentPeriodStart = day.date;
      currentPeriodEnd = day.date;
    } else {
      const gap = differenceInDays(parseISO(day.date), parseISO(currentPeriodEnd));
      if (gap <= 2) {
        currentPeriodEnd = day.date;
      } else {
        periodLengths.push(differenceInDays(parseISO(currentPeriodEnd), parseISO(currentPeriodStart)) + 1);
        currentPeriodStart = day.date;
        currentPeriodEnd = day.date;
      }
    }
  }
  if (currentPeriodStart) {
    periodLengths.push(differenceInDays(parseISO(currentPeriodEnd), parseISO(currentPeriodStart)) + 1);
  }
  const avgPeriodLength = periodLengths.length > 0
    ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
    : null;

  // Most common symptoms
  const symptomCounts = {};
  logs.forEach(l => {
    (l.symptoms || []).forEach(s => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const insights = [
    { label: 'Avg Cycle', value: `${avgCycleLength} days`, icon: Calendar },
    { label: 'Avg Period', value: avgPeriodLength ? `${avgPeriodLength} days` : 'N/A', icon: Droplets },
    { label: 'Cycles Tracked', value: cycleStarts.length, icon: Activity },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      <h3 className="font-semibold text-foreground">Cycle Insights</h3>
      <div className="grid grid-cols-3 gap-3">
        {insights.map(item => (
          <div key={item.label} className="text-center p-3 bg-muted/50 rounded-xl">
            <item.icon className="w-4 h-4 text-chart-3 mx-auto mb-2" />
            <p className="text-lg font-semibold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      {topSymptoms.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Most Common Symptoms</p>
          <div className="flex gap-2">
            {topSymptoms.map(([s, count]) => (
              <span key={s} className="text-xs bg-accent px-2.5 py-1 rounded-full capitalize text-accent-foreground">
                {s.replace('_', ' ')} ({count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}