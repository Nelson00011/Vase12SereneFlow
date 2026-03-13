import React from 'react';
import { format, parseISO } from 'date-fns';
import { Clock, Brain } from 'lucide-react';

const typeLabels = {
  guided: 'Guided',
  breathing: 'Breathing',
  body_scan: 'Body Scan',
  mindfulness: 'Mindfulness',
  loving_kindness: 'Loving Kindness',
  unguided: 'Unguided',
};

const moodEmoji = {
  stressed: '😰',
  anxious: '😟',
  neutral: '😐',
  calm: '😌',
  happy: '😊',
};

export default function RecentSessions({ sessions }) {
  const recent = sessions.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">No sessions yet. Start your first meditation!</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Sessions</h3>
      </div>
      <div className="divide-y divide-border">
        {recent.map((session) => (
          <div key={session.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{typeLabels[session.session_type] || session.session_type}</p>
              <p className="text-xs text-muted-foreground">{format(parseISO(session.date), 'MMM d, yyyy')}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-foreground">{session.duration_minutes}m</p>
              {session.mood_after && (
                <p className="text-xs">{moodEmoji[session.mood_after]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}