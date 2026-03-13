import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import MeditationTimer from '../components/meditation/MeditationTimer';
import SessionForm from '../components/meditation/SessionForm';
import RecentSessions from '../components/dashboard/RecentSessions';
import { toast } from 'sonner';

export default function Meditate() {
  const [showForm, setShowForm] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(null);
  const queryClient = useQueryClient();

  const { data: sessions = [] } = useQuery({
    queryKey: ['meditation-sessions'],
    queryFn: () => base44.entities.MeditationSession.list('-date', 50),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MeditationSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meditation-sessions'] });
      setShowForm(false);
      setCompletedDuration(null);
      toast.success('Session saved!');
    },
  });

  const handleTimerComplete = (minutes) => {
    setCompletedDuration(minutes);
    setShowForm(true);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="font-serif text-3xl font-semibold text-foreground">Meditate</h2>
        <p className="text-muted-foreground mt-1">Find your calm center.</p>
      </motion.div>

      <div className="bg-card rounded-2xl border border-border p-6">
        {showForm ? (
          <SessionForm
            duration={completedDuration}
            onSave={(data) => createMutation.mutate(data)}
            onCancel={() => { setShowForm(false); setCompletedDuration(null); }}
          />
        ) : (
          <MeditationTimer onComplete={handleTimerComplete} />
        )}
      </div>

      <RecentSessions sessions={sessions} />
    </div>
  );
}