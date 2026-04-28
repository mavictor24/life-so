'use client';
import { Box, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { format, parseISO, isToday } from 'date-fns';
import { Habit } from '@/types/habit';
import { CATEGORY_CONFIG } from '@/lib/habits';

interface Props {
  date: string;
  habits: Habit[];
  completions: Record<string, boolean>;
  onToggle: (habitId: string) => void;
}

export default function DayColumn({ date, habits, completions, onToggle }: Props) {
  const d = parseISO(date);
  const today = isToday(d);
  const done = habits.filter(h => completions[h.id]).length;

  return (
    <Box sx={{
      minWidth: { xs: 110 },
      flex: { xs: '0 0 auto', md: '1 1 0' },
      p: 1.5,
      borderRadius: '16px',
      background: today ? 'rgba(124,77,255,0.1)' : 'rgba(255,255,255,0.03)',
      border: today ? '1px solid rgba(124,77,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}>
      <Typography variant="caption" sx={{ color: today ? '#9B6FFF' : 'rgba(255,255,255,0.35)', fontWeight: 700, fontSize: '0.65rem', display: 'block', textAlign: 'center' }}>
        {format(d, 'EEE')}
      </Typography>
      <Typography variant="body2" sx={{ color: today ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: 800, textAlign: 'center', mb: 1.5 }}>
        {format(d, 'd')}
      </Typography>
      {habits.map(h => {
        const cfg = CATEGORY_CONFIG[h.category];
        const done = completions[h.id];
        return (
          <Box
            key={h.id}
            onClick={() => onToggle(h.id)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 0.8, p: '6px 8px', borderRadius: '10px',
              background: done ? cfg.gradient : 'rgba(255,255,255,0.04)',
              cursor: 'pointer', transition: 'all 0.2s',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <Typography fontSize={14}>{h.icon}</Typography>
          </Box>
        );
      })}
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', display: 'block', mt: 0.5, fontSize: '0.6rem' }}>
        {done}/{habits.length}
      </Typography>
    </Box>
  );
}
