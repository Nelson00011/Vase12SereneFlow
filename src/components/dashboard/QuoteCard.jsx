import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const FALLBACK_QUOTES = [
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh", scheduled_hour: 7 },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", scheduled_hour: 9 },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh", scheduled_hour: 11 },
  { text: "Be where you are, not where you think you should be.", author: "Unknown", scheduled_hour: 13 },
  { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön", scheduled_hour: 15 },
  { text: "Inhale the future, exhale the past.", author: "Unknown", scheduled_hour: 17 },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass", scheduled_hour: 19 },
  { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse", scheduled_hour: 21 },
];

export default function QuoteCard({ quotes }) {
  const currentHour = new Date().getHours();
  const allQuotes = quotes?.length > 0 ? quotes : FALLBACK_QUOTES;
  
  // Find the most recent quote for the current time
  const sortedQuotes = [...allQuotes].sort((a, b) => (b.scheduled_hour || 0) - (a.scheduled_hour || 0));
  const currentQuote = sortedQuotes.find(q => (q.scheduled_hour || 0) <= currentHour) || allQuotes[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/30 to-secondary/20 p-8"
    >
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-16 h-16 text-primary" />
      </div>
      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Today's Intention</p>
        <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground mb-4 italic">
          "{currentQuote.text}"
        </p>
        <p className="text-sm text-muted-foreground">— {currentQuote.author}</p>
      </div>
    </motion.div>
  );
}