'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { getLast30Days, getCompletionRate } from '@/lib/habits';
import { Habit } from '@/types/habit';

interface Props {
  dayData: Record<string, Record<string, boolean>>;
  habits: Habit[];
}

function getColor(rate: number): string {
  if (rate === 0)   return 'rgba(255,255,255,0.05)';
  if (rate < 0.25)  return '#2D1B69';
  if (rate < 0.5)   return '#4A2FA3';
  if (rate < 0.75)  return '#6B45D4';
  if (rate < 1)     return '#9B6FFF';
  return '#7C4DFF';
}

export default function Heatmap({ dayData, habits }: Props) {
  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    setDays(getLast30Days());
  }, []);

  if (!days.length) return null;

  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1, display: 'block', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.6rem' }}>
        30-Day Activity
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
        {days.map(day => {
          const rate = getCompletionRate(habits, dayData[day] ?? {});
          const label = format(parseISO(day), 'MMM d') + ' — ' + Math.round(rate * 100) + '%';
          return (
            <Tooltip key={day} title={label} placement="top" arrow>
              <Box sx={{ width: '100%', aspectRatio: '1', borderRadius: '4px', background: getColor(rate), transition: 'transform 0.15s ease', cursor: 'pointer', '&:hover': { transform: 'scale(1.3)' } }} />
            </Tooltip>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, justifyContent: 'flex-end' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem' }}>Less</Typography>
        {[0,0.25,0.5,0.75,1].map(v => <Box key={v} sx={{ width: 10, height: 10, borderRadius: '2px', background: getColor(v) }} />)}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem' }}>More</Typography>
      </Box>
    </Box>
  );
}
