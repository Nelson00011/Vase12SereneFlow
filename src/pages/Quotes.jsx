import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const categoryLabels = {
  mindfulness: '🧘 Mindfulness',
  gratitude: '🙏 Gratitude',
  strength: '💪 Strength',
  peace: '🕊️ Peace',
  self_love: '💜 Self Love',
  wisdom: '✨ Wisdom',
};

const FALLBACK_QUOTES = [
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh", category: "mindfulness", scheduled_hour: 7 },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", category: "peace", scheduled_hour: 9 },
  { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh", category: "mindfulness", scheduled_hour: 11 },
  { text: "Be where you are, not where you think you should be.", author: "Unknown", category: "wisdom", scheduled_hour: 13 },
  { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön", category: "strength", scheduled_hour: 15 },
  { text: "Inhale the future, exhale the past.", author: "Unknown", category: "peace", scheduled_hour: 17 },
  { text: "The quieter you become, the more you can hear.", author: "Ram Dass", category: "wisdom", scheduled_hour: 19 },
  { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse", category: "self_love", scheduled_hour: 21 },
];

export default function Quotes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuote, setNewQuote] = useState({ text: '', author: '', category: 'mindfulness', scheduled_hour: 9 });
  const queryClient = useQueryClient();

  const { data: quotes = [] } = useQuery({
    queryKey: ['daily-quotes'],
    queryFn: () => base44.entities.DailyQuote.list('scheduled_hour'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.DailyQuote.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quotes'] });
      setDialogOpen(false);
      setNewQuote({ text: '', author: '', category: 'mindfulness', scheduled_hour: 9 });
      toast.success('Quote added!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DailyQuote.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['daily-quotes'] }),
  });

  const currentHour = new Date().getHours();
  const allQuotes = quotes.length > 0 ? quotes : FALLBACK_QUOTES;

  const formatHour = (h) => {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-serif text-3xl font-semibold text-foreground">Daily Quotes</h2>
          <p className="text-muted-foreground mt-1">Positive intentions throughout your day.</p>
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Quote</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">Add a New Quote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Quote</Label>
                <Input
                  placeholder="Enter the quote text..."
                  value={newQuote.text}
                  onChange={e => setNewQuote({ ...newQuote, text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  placeholder="Who said it?"
                  value={newQuote.author}
                  onChange={e => setNewQuote({ ...newQuote, author: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newQuote.category} onValueChange={v => setNewQuote({ ...newQuote, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select value={String(newQuote.scheduled_hour)} onValueChange={v => setNewQuote({ ...newQuote, scheduled_hour: parseInt(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 16 }, (_, i) => i + 6).map(h => (
                        <SelectItem key={h} value={String(h)}>{formatHour(h)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate(newQuote)} disabled={!newQuote.text}>
                Save Quote
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <AnimatePresence>
          {allQuotes.map((quote, i) => {
            const isPast = (quote.scheduled_hour || 0) <= currentHour;
            const isCurrent = (quote.scheduled_hour || 0) <= currentHour &&
              (i === allQuotes.length - 1 || (allQuotes[i + 1]?.scheduled_hour || 24) > currentHour);

            return (
              <motion.div
                key={quote.id || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative flex gap-4 p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-primary/5 border-primary/30 shadow-sm'
                    : isPast
                    ? 'bg-card border-border'
                    : 'bg-muted/30 border-border/50 opacity-60'
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrent ? 'bg-primary text-primary-foreground' : isPast ? 'bg-muted' : 'bg-muted/50'
                  }`}>
                    {isCurrent ? <Sparkles className="w-4 h-4" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{formatHour(quote.scheduled_hour || 0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base italic text-foreground leading-relaxed">"{quote.text}"</p>
                  <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>
                  {quote.category && (
                    <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full mt-2 text-muted-foreground">
                      {categoryLabels[quote.category] || quote.category}
                    </span>
                  )}
                </div>
                {quote.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(quote.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}