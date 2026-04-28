'use client';
import { useCallback, useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { Recipe } from '@/types/recipe';
import { pickRandomRecipe } from '@/lib/recipes';

interface Props {
  recipes: Recipe[];
  onCookedToggle?: (id: string) => void;
}

export default function RecipePicker({ recipes, onCookedToggle }: Props) {
  const [picked, setPicked] = useState<Recipe | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [key, setKey] = useState(0);

  const spin = useCallback(() => {
    if (!recipes.length) return;
    setSpinning(true);
    let count = 0;

    const interval = setInterval(() => {
      setPicked(pickRandomRecipe(recipes));
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setPicked(pickRandomRecipe(recipes));
        setSpinning(false);
        setKey((prev) => prev + 1);
      }
    }, 85);
  }, [recipes]);

  return (
    <Box>
      <AnimatePresence mode="wait">
        {picked ? (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.84, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.84 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <Box sx={{
              p: 3,
              mb: 2,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, rgba(78,205,196,0.16), rgba(124,77,255,0.1))',
              border: '1px solid rgba(78,205,196,0.26)',
              textAlign: 'center',
            }}>
              <Typography fontSize={36} mb={0.8}>🍽️</Typography>
              <Typography variant="h6" fontWeight={800} sx={{ color: '#fff', mb: 0.5 }}>
                {picked.title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {picked.cuisine && (
                  <Chip
                    label={picked.cuisine}
                    size="small"
                    sx={{ background: 'rgba(78,205,196,0.2)', color: '#4ECDC4', fontWeight: 700, fontSize: '0.65rem' }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {picked.url && (
                  <Button
                    size="small"
                    variant="contained"
                    component="a"
                    href={picked.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<PlayArrowRoundedIcon />}
                    sx={{ borderRadius: 10, background: '#4ECDC4', color: '#000', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
                  >
                    Open Recipe
                  </Button>
                )}
                {onCookedToggle && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onCookedToggle(picked.id)}
                    sx={{ borderRadius: 10, background: '#7C4DFF', fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
                  >
                    Toggle Cooked ✓
                  </Button>
                )}
              </Box>
            </Box>
          </motion.div>
        ) : (
          <Box sx={{ mb: 2, p: 3, borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography fontSize={36}>🍳</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.45)', mt: 1 }}>
              Pick a cuisine filter, then shuffle for a random recipe
            </Typography>
          </Box>
        )}
      </AnimatePresence>

      <Button
        fullWidth
        variant="contained"
        startIcon={<ShuffleRoundedIcon />}
        onClick={spin}
        disabled={spinning || recipes.length === 0}
        sx={{
          borderRadius: 50,
          py: 1.5,
          background: 'linear-gradient(135deg, #4ECDC4, #00A8CC)',
          color: '#051018',
          fontWeight: 800,
          textTransform: 'none',
          fontSize: '1rem',
          boxShadow: '0 4px 20px rgba(78,205,196,0.35)',
          '&:hover': { boxShadow: '0 6px 30px rgba(78,205,196,0.5)' },
        }}
      >
        {spinning ? 'Finding best bite…' : 'Shuffle Recipe 🎲'}
      </Button>

      {!recipes.length && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1.3, gap: 0.5 }}>
          <RestaurantRoundedIcon sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>
            No recipes in this filter yet
          </Typography>
        </Box>
      )}
    </Box>
  );
}
