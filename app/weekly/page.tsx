'use client';
import { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import AppShell from '@/components/AppShell';
import DayColumn from '@/components/DayColumn';
import Heatmap from '@/components/Heatmap';
import { loadHabits, loadDayData, saveDayData, getLast7Days, getCompletionRate } from '@/lib/habits';
import { Habit } from '@/types/habit';

export default function WeeklyView() {
  const [habits, setHabits]   = useState<Habit[]>([]);
  const [dayData, setDayData] = useState<Record<string, Record<string, boolean>>>({});
  const days = getLast7Days();

  useEffect(() => {
    setHabits(loadHabits());
    setDayData(loadDayData());
  }, []);

  const toggle = useCallback((date: string, habitId: string) => {
    setDayData(prev => {
      const updated = {
        ...prev,
        [date]: { ...(prev[date] ?? {}), [habitId]: !prev[date]?.[habitId] },
      };
      saveDayData(updated);
      return updated;
    });
  }, []);

  const weekTotal = days.reduce((acc, d) => acc + getCompletionRate(habits, dayData[d] ?? {}), 0);
  const weekAvg   = habits.length ? Math.round((weekTotal / 7) * 100) : 0;

  return (
    <AppShell>
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          {format(parseISO(days[0]), 'MMM d')} – {format(parseISO(days[6]), 'MMM d, yyyy')}
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff' }}>Weekly Flow ⚡</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.3 }}>
          Weekly avg: <span style={{ color: '#7C4DFF', fontWeight: 700 }}>{weekAvg}%</span>
        </Typography>
      </Box>

      {/* 7-day horizontal scroll */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, flexWrap: { xs: 'nowrap', md: 'wrap' }, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {days.map(date => (
            <DayColumn
              key={date}
              date={date}
              habits={habits}
              completions={dayData[date] ?? {}}
              onToggle={(id) => toggle(date, id)}
            />
          ))}
        </Box>
      </Box>

      {/* Heatmap */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ p: 2, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Heatmap dayData={dayData} habits={habits} />
        </Box>
      </Box>

      {/* Weekly stats */}
      <Box sx={{ px: 2.5 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
          This Week
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {days.map(date => {
            const rate = getCompletionRate(habits, dayData[date] ?? {});
            return (
              <Box key={date} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', width: 36, fontWeight: 600, fontSize: '0.7rem' }}>
                  {format(parseISO(date), 'EEE')}
                </Typography>
                <Box sx={{ flex: 1, height: 6, borderRadius: 10, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${rate * 100}%`, borderRadius: 10, background: rate >= 1 ? '#6BCB77' : '#7C4DFF', transition: 'width 0.5s ease' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#7C4DFF', fontWeight: 700, width: 32, textAlign: 'right', fontSize: '0.7rem' }}>
                  {Math.round(rate * 100)}%
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </AppShell>
  );
}
