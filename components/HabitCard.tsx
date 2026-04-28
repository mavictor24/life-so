'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { Habit } from '@/types/habit';
import { CATEGORY_CONFIG } from '@/lib/habits';

interface Props {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, completed, onToggle }: Props) {
  const cfg = CATEGORY_CONFIG[habit.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      style={{ marginBottom: 10 }}
    >
      <Box
        onClick={onToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: '14px 16px',
          borderRadius: '16px',
          background: completed
            ? `${cfg.gradient}`
            : 'rgba(255,255,255,0.04)',
          border: `1px solid ${completed ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: completed ? `0 4px 20px ${cfg.color}40` : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow overlay */}
        {completed && (
          <Box
            sx={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
            }}
          />
        )}

        <Typography fontSize={26}>{habit.icon}</Typography>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              color: completed ? '#fff' : 'rgba(255,255,255,0.85)',
              textDecoration: completed ? 'none' : 'none',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {habit.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
            <Chip
              label={CATEGORY_CONFIG[habit.category].label}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.6rem',
                fontWeight: 700,
                background: completed ? 'rgba(255,255,255,0.2)' : `${cfg.color}25`,
                color: completed ? '#fff' : cfg.color,
                border: 'none',
              }}
            />
            <Typography variant="caption" sx={{ color: completed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
              {habit.timeBlock}
            </Typography>
          </Box>
        </Box>

        {/* Streak */}
        {habit.streak > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 14, color: '#FFD93D' }} />
            <Typography variant="caption" sx={{ color: '#FFD93D', fontWeight: 700, fontSize: '0.7rem' }}>
              {habit.streak}
            </Typography>
          </Box>
        )}

        {/* Check icon */}
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <CheckCircleRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <RadioButtonUncheckedRoundedIcon sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 22 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}
