'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import AppShell from '@/components/AppShell';
import StreakCard from '@/components/StreakCard';
import InsightCard from '@/components/InsightCard';
import ProgressRing from '@/components/ProgressRing';
import Heatmap from '@/components/Heatmap';
import { loadHabits, loadDayData, getCompletionRate, calcWeeklyStreak, calcDailyStreak, CATEGORY_CONFIG } from '@/lib/habits';
import { Habit } from '@/types/habit';

const QUICK_ACTIONS = [
  { label: 'Daily',   icon: <TodayRoundedIcon />,         href: '/daily',   color: '#7C4DFF' },
  { label: 'Weekly',  icon: <DateRangeRoundedIcon />,     href: '/weekly',  color: '#FF6B6B' },
  { label: 'Monthly', icon: <CalendarMonthRoundedIcon />, href: '/monthly', color: '#FFD93D' },
  { label: 'Movies',  icon: <MovieRoundedIcon />,         href: '/movies',  color: '#4ECDC4' },
  { label: 'Recipes', icon: <RestaurantMenuRoundedIcon />, href: '/recipes', color: '#6BCB77' },
];

export default function Dashboard() {
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dayData, setDayData] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    setHabits(loadHabits());
    setDayData(loadDayData());
  }, []);

  const todayCompletions = dayData[today] ?? {};
  const completionRate   = getCompletionRate(habits, todayCompletions);
  const weeklyStreak     = calcWeeklyStreak(dayData, habits);
  const dailyStreak      = calcDailyStreak(dayData, habits);
  const doneCount        = habits.filter(h => todayCompletions[h.id]).length;
  const totalCount       = habits.length;

  const catRates = Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
    const catHabits = habits.filter(h => h.category === cat);
    const rate = getCompletionRate(catHabits, todayCompletions);
    return { cat, cfg, rate };
  });

  const insights = [
    { icon: '⚡', title: 'Peak productivity', description: 'You complete 87% of work habits before 10 AM', gradient: 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(74,0,224,0.05))' },
    { icon: '💪', title: 'Gym streak on fire', description: "You haven't missed the gym in 5 days", gradient: 'linear-gradient(135deg, rgba(255,107,107,0.15), rgba(238,9,121,0.05))' },
    { icon: '📚', title: 'Learning champion', description: 'Reading habit completed 6/7 days this week', gradient: 'linear-gradient(135deg, rgba(107,203,119,0.15), rgba(29,185,84,0.05))' },
  ];

  return (
    <AppShell>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            {format(new Date(), 'EEEE, MMMM d')}
          </Typography>
          <Typography variant="h5" sx={{ color: '#fff', mt: 0.3 }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.3 }}>
            Your Life OS Dashboard
          </Typography>
        </motion.div>
      </Box>

      {/* Today Summary Card */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box sx={{
            p: 2.5, borderRadius: '24px',
            background: 'linear-gradient(135deg, #7C4DFF 0%, #4A00E0 100%)',
            boxShadow: '0 8px 32px rgba(124,77,255,0.4)',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem' }}>Today's Progress</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#fff', lineHeight: 1.1, mt: 0.5 }}>{doneCount}/{totalCount}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.3 }}>habits completed</Typography>
              </Box>
              <ProgressRing percent={Math.round(completionRate * 100)} size={80} color="#FFD93D" />
            </Box>
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={completionRate * 100}
                sx={{
                  height: 6, borderRadius: 10,
                  background: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': { background: '#FFD93D', borderRadius: 10 },
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Streak Cards */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={6} sm={3}>
            <StreakCard label="Daily Streak" value={dailyStreak} subtitle="consecutive days" color="#FFD93D" />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StreakCard label="Weekly Streak" value={weeklyStreak} subtitle="of 7 days" color="#FF6B6B" />
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
          Quick Access
        </Typography>
        <Grid container spacing={1}>
          {QUICK_ACTIONS.map((a, i) => (
            <Grid item xs={6} sm={3} key={a.href}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Box
                  onClick={() => router.push(a.href)}
                  sx={{
                    p: 2, borderRadius: '20px', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    transition: 'all 0.2s',
                    '&:hover': { background: 'rgba(255,255,255,0.08)', transform: 'translateY(-1px)' },
                    '&:active': { transform: 'scale(0.97)' },
                  }}
                >
                  <Box sx={{ color: a.color, display: 'flex' }}>{a.icon}</Box>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#fff' }}>{a.label}</Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Category breakdown */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
          Category Breakdown
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {catRates.map(({ cat, cfg, rate }) => (
            <Box key={cat} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', width: 60, fontSize: '0.7rem', fontWeight: 600 }}>{cfg.label}</Typography>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={rate * 100}
                  sx={{ height: 6, borderRadius: 10, background: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': { background: cfg.color, borderRadius: 10 } }} />
              </Box>
              <Typography variant="caption" sx={{ color: cfg.color, fontWeight: 700, width: 30, textAlign: 'right', fontSize: '0.7rem' }}>
                {Math.round(rate * 100)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Heatmap */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ p: 2, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Heatmap dayData={dayData} habits={habits} />
        </Box>
      </Box>

      {/* Insights */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
          Insights
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {insights.map(ins => <InsightCard key={ins.title} {...ins} />)}
        </Box>
      </Box>
    </AppShell>
  );
}
