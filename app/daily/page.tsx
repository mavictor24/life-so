'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import AppShell from '@/components/AppShell';
import HabitCard from '@/components/HabitCard';
import ConfettiCelebration from '@/components/ConfettiCelebration';
import { loadHabits, loadDayData, saveDayData, getCompletionRate, CATEGORY_CONFIG } from '@/lib/habits';
import { Habit } from '@/types/habit';

export default function DailyView() {
  const [today, setToday] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [habits, setHabits]       = useState<Habit[]>([]);
  const [dayData, setDayData]     = useState<Record<string, Record<string, boolean>>>({});
  const [confetti, setConfetti]   = useState(false);
  const [prevRate, setPrevRate]   = useState(0);

  useEffect(() => {
    const now = new Date();
    const t = format(now, 'yyyy-MM-dd');
    setToday(t);
    setDateLabel(format(now, 'EEEE, MMMM d'));
    const h = loadHabits();
    const d = loadDayData();
    setHabits(h);
    setDayData(d);
    setPrevRate(getCompletionRate(h, d[t] ?? {}));
  }, []);

  const completions = dayData[today] ?? {};
  const rate = getCompletionRate(habits, completions);
  const doneCount = habits.filter(h => completions[h.id]).length;

  const toggle = useCallback((id: string) => {
    setDayData(prev => {
      const updated = {
        ...prev,
        [today]: { ...(prev[today] ?? {}), [id]: !prev[today]?.[id] },
      };
      saveDayData(updated);

      const newRate = getCompletionRate(habits, updated[today]);
      const wasComplete = prevRate >= 1;
      const isComplete  = newRate >= 1;

      if (!wasComplete && isComplete) {
        setConfetti(true);
        toast.success('🎉 All habits done! Amazing!', { icon: '🔥' });
        setTimeout(() => setConfetti(false), 100);
      } else if (updated[today][id]) {
        const h = habits.find(h => h.id === id);
        toast.success(`${h?.icon} ${h?.title} done!`);
      }
      setPrevRate(newRate);
      return updated;
    });
  }, [habits, today, prevRate]);

  const categories = [...new Set(habits.map(h => h.category))];

  return (
    <AppShell>
      <ConfettiCelebration trigger={confetti} />

      {/* Header */}
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          {dateLabel}
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff' }}>Daily Focus 🎯</Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ px: 2.5, mb: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.75rem' }}>
            {doneCount} of {habits.length} completed
          </Typography>
          <Typography variant="body2" sx={{ color: '#7C4DFF', fontWeight: 700, fontSize: '0.75rem' }}>
            {Math.round(rate * 100)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={rate * 100}
          sx={{
            height: 8, borderRadius: 10,
            background: 'rgba(255,255,255,0.07)',
            '& .MuiLinearProgress-bar': {
              background: rate >= 1 ? 'linear-gradient(90deg, #6BCB77, #1DB954)' : 'linear-gradient(90deg, #7C4DFF, #4A00E0)',
              borderRadius: 10,
              transition: 'width 0.5s ease',
            },
          }}
        />
        {rate >= 1 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="caption" sx={{ color: '#6BCB77', fontWeight: 700, mt: 0.8, display: 'block', textAlign: 'center' }}>
              ✅ Perfect Day! You crushed it!
            </Typography>
          </motion.div>
        )}
      </Box>

      {/* Habits by category */}
      <Box sx={{ px: 2.5 }}>
        {categories.map(cat => {
          const catHabits = habits.filter(h => h.category === cat);
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <Box key={cat} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                <Typography variant="caption" sx={{ color: cfg.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.65rem' }}>
                  {cfg.label}
                </Typography>
              </Box>
              {catHabits.map(h => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  completed={!!completions[h.id]}
                  onToggle={() => toggle(h.id)}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </AppShell>
  );
}
