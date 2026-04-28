'use client';
import { useState, useCallback } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Movie } from '@/types/movie';
import { pickRandom } from '@/lib/movies';

interface Props {
  movies: Movie[];
  onWatched?: (id: string) => void;
}

export default function MoviePicker({ movies, onWatched }: Props) {
  const [picked, setPicked] = useState<Movie | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [key, setKey] = useState(0);

  const spin = useCallback(() => {
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setPicked(pickRandom(movies));
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setPicked(pickRandom(movies));
        setSpinning(false);
        setKey(k => k + 1);
      }
    }, 80);
  }, [movies]);

  return (
    <Box>
      <AnimatePresence mode="wait">
        {picked ? (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Box sx={{
              p: 3, mb: 2, borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(124,77,255,0.2), rgba(74,0,224,0.1))',
              border: '1px solid rgba(124,77,255,0.3)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <Typography fontSize={40} mb={1}>🎬</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#fff', mb: 0.5 }}>
                {picked.title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                {picked.genre && <Chip label={picked.genre} size="small" sx={{ background: 'rgba(124,77,255,0.3)', color: '#C4A8FF', fontSize: '0.65rem', fontWeight: 700 }} />}
                {picked.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <StarRoundedIcon sx={{ fontSize: 14, color: '#FFD93D' }} />
                    <Typography variant="caption" sx={{ color: '#FFD93D', fontWeight: 700 }}>{picked.rating}/10</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                {picked.url && (
                  <Button
                    size="small" variant="contained"
                    component="a"
                    href={picked.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<PlayArrowRoundedIcon />}
                    sx={{ borderRadius: 10, background: '#4ECDC4', color: '#000', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
                  >
                    Watch Now
                  </Button>
                )}
                {onWatched && (
                  <Button
                    size="small" variant="contained"
                    onClick={() => onWatched(picked.id)}
                    sx={{ borderRadius: 10, background: '#7C4DFF', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
                  >
                    Mark as Watched ✓
                  </Button>
                )}
              </Box>
            </Box>
          </motion.div>
        ) : (
          <Box sx={{ mb: 2, p: 3, borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography fontSize={40}>🎲</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1 }}>Hit shuffle to pick a movie</Typography>
          </Box>
        )}
      </AnimatePresence>

      <Button
        fullWidth
        variant="contained"
        startIcon={<ShuffleRoundedIcon />}
        onClick={spin}
        disabled={spinning || movies.length === 0}
        sx={{
          borderRadius: 50, py: 1.5,
          background: 'linear-gradient(135deg, #7C4DFF, #4A00E0)',
          fontWeight: 700, textTransform: 'none', fontSize: '1rem',
          boxShadow: '0 4px 20px rgba(124,77,255,0.4)',
          '&:hover': { boxShadow: '0 6px 30px rgba(124,77,255,0.6)' },
        }}
      >
        {spinning ? 'Picking…' : 'Shuffle Pick 🎬'}
      </Button>
    </Box>
  );
}
