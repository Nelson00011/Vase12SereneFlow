import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const sessionTypes = [
  { value: 'guided', label: 'Guided' },
  { value: 'breathing', label: 'Breathing' },
  { value: 'body_scan', label: 'Body Scan' },
  { value: 'mindfulness', label: 'Mindfulness' },
  { value: 'loving_kindness', label: 'Loving Kindness' },
  { value: 'unguided', label: 'Unguided' },
];

const moods = [
  { value: 'stressed', label: '😰 Stressed' },
  { value: 'anxious', label: '😟 Anxious' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'calm', label: '😌 Calm' },
  { value: 'happy', label: '😊 Happy' },
];

export default function SessionForm({ duration, onSave, onCancel }) {
  const [form, setForm] = useState({
    duration_minutes: duration || 10,
    session_type: 'mindfulness',
    mood_before: '',
    mood_after: '',
    notes: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="space-y-5">
      <h3 className="font-serif text-xl font-semibold text-foreground">Log Your Session</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration (min)</Label>
          <Input
            type="number"
            value={form.duration_minutes}
            onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={form.session_type} onValueChange={v => setForm({ ...form, session_type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {sessionTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mood Before</Label>
          <Select value={form.mood_before} onValueChange={v => setForm({ ...form, mood_before: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {moods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Mood After</Label>
          <Select value={form.mood_after} onValueChange={v => setForm({ ...form, mood_after: v })}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {moods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          placeholder="How did you feel? Any insights?"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Session</Button>
      </div>
    </div>
  );
}