'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isToday } from 'date-fns';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { loadHabits, loadDayData, getCompletionRate } from '@/lib/habits';
import { Habit } from '@/types/habit';

function getColor(rate: number): string {
  if (rate === 0)  return 'rgba(255,255,255,0.05)';
  if (rate < 0.25) return '#2D1B69';
  if (rate < 0.5)  return '#4A2FA3';
  if (rate < 0.75) return '#6B45D4';
  if (rate < 1)    return '#9B6FFF';
  return '#6BCB77';
}

export default function MonthlyView() {
  const [habits, setHabits]     = useState<Habit[]>([]);
  const [dayData, setDayData]   = useState<Record<string, Record<string, boolean>>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [now, setNow]           = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    setHabits(loadHabits());
    setDayData(loadDayData());
  }, []);

  const start = now ? startOfMonth(now) : null;
  const end   = now ? endOfMonth(now) : null;
  const days  = start && end ? eachDayOfInterval({ start, end }) : [];
  const startDow = start ? start.getDay() : 0;

  const selCompletions = selected ? (dayData[selected] ?? {}) : {};
  const selRate = selected ? getCompletionRate(habits, selCompletions) : 0;
  const selDone = selected ? habits.filter(h => selCompletions[h.id]).length : 0;

  return (
    <AppShell>
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          {now ? format(now, 'yyyy') : ''}
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff' }}>{now ? format(now, 'MMMM') : ''} 📅</Typography>
      </Box>

      {/* Calendar grid */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ p: 2, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Day labels */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <Typography key={i} variant="caption" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: '0.6rem' }}>{d}</Typography>
            ))}
          </Box>
          {/* Calendar cells */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Empty cells for offset */}
            {Array.from({ length: startDow }).map((_, i) => <Box key={'e'+i} />)}
            {days.map(day => {
              const key  = format(day, 'yyyy-MM-dd');
              const rate = getCompletionRate(habits, dayData[key] ?? {});
              const isTd = isToday(day);
              const isSel = selected === key;
              return (
                <Tooltip key={key} title={`${format(day, 'MMM d')} — ${Math.round(rate*100)}%`} placement="top" arrow>
                  <Box
                    onClick={() => setSelected(isSel ? null : key)}
                    sx={{
                      aspectRatio: '1', borderRadius: '8px',
                      background: getColor(rate),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      border: isTd ? '2px solid #FFD93D' : isSel ? '2px solid #7C4DFF' : 'none',
                      transition: 'transform 0.15s ease',
                      '&:hover': { transform: 'scale(1.15)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: rate > 0.4 ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                      {format(day, 'd')}
                    </Typography>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Selected day detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ px: 2.5, mb: 2 }}>
            <Box sx={{ p: 2, borderRadius: '20px', background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.25)' }}>
              <Typography variant="body1" fontWeight={700} sx={{ color: '#fff', mb: 0.5 }}>
                {format(parseISO(selected), 'MMMM d, yyyy')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5 }}>
                {selDone}/{habits.length} habits · {Math.round(selRate * 100)}% completion
              </Typography>
              {habits.map(h => (
                <Box key={h.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: selCompletions[h.id] ? '#6BCB77' : 'rgba(255,255,255,0.15)' }} />
                  <Typography fontSize={14}>{h.icon}</Typography>
                  <Typography variant="body2" sx={{ color: selCompletions[h.id] ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: selCompletions[h.id] ? 600 : 400 }}>
                    {h.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Legend */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem' }}>Less</Typography>
          {[0, 0.25, 0.5, 0.75, 1].map(v => <Box key={v} sx={{ width: 12, height: 12, borderRadius: '3px', background: getColor(v) }} />)}
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem' }}>More</Typography>
        </Box>
      </Box>
    </AppShell>
  );
}
