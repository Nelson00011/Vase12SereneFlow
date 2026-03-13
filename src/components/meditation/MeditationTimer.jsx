import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MeditationTimer({ onComplete }) {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(selectedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);

  const presets = [5, 10, 15, 20, 30];

  useEffect(() => {
    if (!isRunning) setTimeLeft(selectedMinutes * 60);
  }, [selectedMinutes]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const toggle = () => setIsRunning(!isRunning);
  
  const reset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(selectedMinutes * 60);
    clearInterval(intervalRef.current);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / (selectedMinutes * 60);

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🧘</span>
        </div>
        <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">Session Complete</h3>
        <p className="text-muted-foreground mb-6">{selectedMinutes} minutes of mindfulness</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={reset}>Meditate Again</Button>
          <Button onClick={() => onComplete(selectedMinutes)}>Save Session</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="text-center py-8">
      {/* Presets */}
      {!isRunning && (
        <div className="flex justify-center gap-2 mb-8">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setSelectedMinutes(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedMinutes === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {p}m
            </button>
          ))}
        </div>
      )}

      {/* Timer circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light text-foreground tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
            {isRunning ? 'breathe' : 'ready'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {isRunning && (
          <Button variant="outline" size="icon" className="rounded-full w-12 h-12" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
        <Button
          size="icon"
          className="rounded-full w-16 h-16"
          onClick={toggle}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </Button>
      </div>
    </div>
  );
}