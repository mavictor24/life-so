'use client';
import { useEffect, useMemo, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const DAILY_QUOTES = [
  'Leap first, overthink later. Your story likes brave steps.',
  'You are allowed to glow in your own art style today.',
  'Tiny wins stack into superhero arcs. Keep going.',
  'Your future self is already clapping. Make one move now.',
  'Courage can be quiet. Progress can be loud.',
  'Good vibes, big focus, zero apologies.',
  'Even legends start with messy drafts. Ship anyway.',
  'Do it with heart, then do it with style.',
  'You are not behind. You are loading greatness.',
  'Your day is a canvas. Paint it bold.',
  'Focus mode on. Doubt mode off.',
  'One honest effort beats ten perfect plans.',
  'Your discipline is your secret superpower.',
  'Move with intention. Smile with chaos.',
  'Momentum loves the first small click.',
  'Today is a side quest that unlocks the main mission.',
  'Progress is punk. Consistency is cool.',
  'You are the main character. Act like chapter one matters.',
  'Make it playful, make it powerful, make it yours.',
  'Your hustle can be kind and still unstoppable.',
  'Build the life that makes your younger self proud.',
  'You do not need perfect timing. You need one decision.',
  'Keep your spark. Let your routine protect it.',
  'Reset. Refocus. Swing back stronger.',
  'You are one brave action away from a better mood.',
  'Great days are engineered, not wished for.',
  'Your dreams are real tasks with deadlines. Start now.',
  'Be soft with yourself, hard on your excuses.',
  'The vibe is: disciplined, joyful, and impossible to stop.',
  'No multiverse needed. This version of you can win.',
];

function getQuoteOfTheDay(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

export default function StartupIntro({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const totalMs = 9800;
    const startedAt = performance.now();
    let timerId: number | null = null;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const value = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setProgress(value);

      if (value >= 100) {
        timerId = window.setTimeout(() => setShowIntro(false), 450);
        return;
      }

      timerId = window.setTimeout(tick, 60);
    };

    tick();
    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [mounted]);

  const dailyQuote = useMemo(() => (mounted ? getQuoteOfTheDay() : 'Loading your universe...'), [mounted]);
  const phase = progress < 30 ? 'Powering comic core' : progress < 65 ? 'Syncing spider senses' : progress < 90 ? 'Warping through dimensions' : 'Final web-swing';

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 5000,
            }}
          >
            <Box
              sx={{
                height: '100dvh',
                width: '100%',
                background: 'radial-gradient(circle at 18% 20%, rgba(255,64,129,0.42), transparent 36%), radial-gradient(circle at 85% 18%, rgba(124,77,255,0.5), transparent 42%), radial-gradient(circle at 82% 80%, rgba(0,229,255,0.24), transparent 38%), linear-gradient(160deg, #090b17, #140f2e 44%, #0a1124)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2.5,
              }}
            >
              <motion.div
                animate={{ opacity: [0.14, 0.28, 0.14] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 0.6px, transparent 0.6px)',
                  backgroundSize: '8px 8px',
                  mixBlendMode: 'soft-light',
                  pointerEvents: 'none',
                }}
              />

              <motion.div
                animate={{ x: ['-6%', '4%', '-6%'] }}
                transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(112deg, transparent 35%, rgba(255,255,255,0.11) 49%, transparent 63%)',
                  transform: 'skewX(-16deg)',
                  mixBlendMode: 'screen',
                  opacity: 0.3,
                  pointerEvents: 'none',
                }}
              />

              <motion.div
                animate={{ x: ['-3%', '3%', '-3%'], y: ['-2%', '2%', '-2%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: '-10%',
                  background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 16px)',
                  mixBlendMode: 'screen',
                  opacity: 0.28,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.38), transparent 25%, transparent 70%, rgba(0,0,0,0.48))',
                }}
              />

              <Box
                sx={{
                  width: '100%',
                  maxWidth: 820,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.85)',
                      textTransform: 'uppercase',
                      letterSpacing: 3.2,
                      fontWeight: 700,
                      transform: 'skewX(-10deg)',
                      fontFamily: '"Arial Black", "Segoe UI", sans-serif',
                      fontSize: { xs: '0.68rem', sm: '0.86rem' },
                      textShadow: '1px 1px 0 rgba(255,64,129,0.5), -1px -1px 0 rgba(0,229,255,0.45)',
                    }}
                  >
                    Life OS Intro Sequence · Spider-Verse Energy
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Typography
                    sx={{
                      mt: 2,
                      fontWeight: 900,
                      lineHeight: 0.95,
                      letterSpacing: '-0.01em',
                      color: '#FFFFFF',
                      transform: 'skewX(-8deg)',
                      fontFamily: '"Arial Black", "Trebuchet MS", sans-serif',
                      textShadow: '4px 0 0 rgba(0,229,255,0.55), -4px 0 0 rgba(255,64,129,0.58), 0 0 28px rgba(124,77,255,0.46)',
                      fontSize: { xs: '2.15rem', sm: '3.6rem', md: '5rem' },
                    }}
                  >
                    Welcome Mokyy
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <Typography
                    sx={{
                      mt: 1.1,
                      color: '#ffdd57',
                      fontWeight: 800,
                      transform: 'skewX(-6deg)',
                      letterSpacing: 0.2,
                      textShadow: '0 0 10px rgba(255,221,87,0.38)',
                      fontSize: { xs: '0.9rem', sm: '1.2rem' },
                    }}
                  >
                    Keep smiling, champ ✨ Your universe is rooting for you.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.7 }}
                >
                  <Box
                    sx={{
                      mt: 2.3,
                      px: { xs: 1, sm: 3 },
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.94)',
                        fontSize: { xs: '0.92rem', sm: '1.12rem' },
                        fontStyle: 'italic',
                        transform: 'skewX(-4deg)',
                        textShadow: '1px 0 0 rgba(0,229,255,0.45), -1px 0 0 rgba(255,64,129,0.45)',
                        lineHeight: 1.45,
                      }}
                    >
                      “{dailyQuote}”
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.95 }}
                >
                  <Box sx={{ mt: 4, maxWidth: 520, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.74rem', fontWeight: 700 }}>{phase}</Typography>
                      <Typography sx={{ color: '#4ECDC4', fontSize: '0.74rem', fontWeight: 800 }}>{progress}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.18)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 999,
                          background: 'linear-gradient(90deg, #00e5ff, #7C4DFF, #ff4081, #FFD93D)',
                        },
                      }}
                    />
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', mt: 1, fontSize: '0.7rem' }}>
                      Booting your productive multiverse...
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && children}
    </>
  );
}
