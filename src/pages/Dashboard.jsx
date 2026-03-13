import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Brain, Heart, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import QuoteCard from '../components/dashboard/QuoteCard';
import StatsOverview from '../components/dashboard/StatsOverview';
import RecentSessions from '../components/dashboard/RecentSessions';

export default function Dashboard() {
  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ['meditation-sessions'],
    queryFn: () => base44.entities.MeditationSession.list('-date', 100),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['daily-quotes'],
    queryFn: () => base44.entities.DailyQuote.list(),
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-serif text-3xl font-semibold text-foreground">{greeting()}</h2>
        <p className="text-muted-foreground mt-1">Take a moment to breathe and be present.</p>
      </motion.div>

      <QuoteCard quotes={quotes} />

      <StatsOverview sessions={sessions} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/Meditate">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Brain className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-medium text-foreground">Start Meditating</h3>
            <p className="text-xs text-muted-foreground mt-1">Begin a new session</p>
          </motion.div>
        </Link>
        <Link to="/Quotes">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Quote className="w-8 h-8 text-chart-2 mb-3" />
            <h3 className="font-medium text-foreground">Daily Quotes</h3>
            <p className="text-xs text-muted-foreground mt-1">View all today's quotes</p>
          </motion.div>
        </Link>
        <Link to="/PeriodTracker">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <Heart className="w-8 h-8 text-chart-3 mb-3" />
            <h3 className="font-medium text-foreground">Cycle Tracker</h3>
            <p className="text-xs text-muted-foreground mt-1">Log & track your cycle</p>
          </motion.div>
        </Link>
      </div>

      <RecentSessions sessions={sessions} />
    </div>
  );
}