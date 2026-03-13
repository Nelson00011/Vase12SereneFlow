import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, TrendingUp, Sun } from 'lucide-react';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';

export default function StatsOverview({ sessions }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todaySessions = sessions.filter(s => s.date === today);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const totalSessions = sessions.length;

  // Calculate streak
  const uniqueDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let streak = 0;
  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = format(new Date(Date.now() - i * 86400000), 'yyyy-MM-dd');
    if (uniqueDates[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  const stats = [
    { label: 'Today', value: `${todayMinutes}m`, icon: Sun, color: 'text-chart-4' },
    { label: 'Streak', value: `${streak}d`, icon: Flame, color: 'text-chart-3' },
    { label: 'Sessions', value: totalSessions, icon: TrendingUp, color: 'text-chart-2' },
    { label: 'Total', value: `${Math.round(totalMinutes / 60)}h`, icon: Clock, color: 'text-chart-1' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
          <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}