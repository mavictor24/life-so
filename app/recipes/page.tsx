'use client';
import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, TextField, Button, Chip, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AppShell from '@/components/AppShell';
import RecipePicker from '@/components/RecipePicker';
import { Recipe } from '@/types/recipe';
import { loadRecipes, saveRecipes } from '@/lib/recipes';

const CUISINES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Drinks', 'Brunch'];

const FILTER_EXAMPLES: Record<string, string[]> = {
  Breakfast: ['Pancakes', 'Omelette', 'Overnight Oats'],
  Lunch: ['Chicken Wrap', 'Caesar Salad', 'Rice Bowl'],
  Dinner: ['Grilled Salmon', 'Pasta Alfredo', 'Steak & Veggies'],
  Dessert: ['Brownies', 'Cheesecake', 'Fruit Tart'],
  Snacks: ['Nachos', 'Protein Balls', 'Popcorn Mix'],
  Drinks: ['Berry Smoothie', 'Iced Matcha', 'Mango Lassi'],
  Brunch: ['Avocado Toast', 'Shakshuka', 'French Toast'],
};

const normalizeMealType = (value: string) => {
  if (!value.trim()) return '';
  const lower = value.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export default function RecipesView() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  const filtered = useMemo(() => (
    filter === 'All' ? recipes : recipes.filter((recipe) => recipe.cuisine === filter)
  ), [recipes, filter]);

  const uncooked = filtered.filter((recipe) => !recipe.cooked);
  const activeExampleKey = filter === 'All' ? 'Dinner' : filter;
  const activeExamples = FILTER_EXAMPLES[activeExampleKey] ?? FILTER_EXAMPLES.Dinner;
  const typedMealType = normalizeMealType(newCuisine);
  const typedExamples = FILTER_EXAMPLES[typedMealType] ?? [];

  const addRecipe = () => {
    if (!newTitle.trim()) return;
    const recipe: Recipe = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      cuisine: newCuisine.trim() || undefined,
      url: newUrl.trim() || undefined,
    };
    const updated = [...recipes, recipe];
    setRecipes(updated);
    saveRecipes(updated);
    setNewTitle('');
    setNewCuisine('');
    setNewUrl('');
  };

  const toggleCooked = (id: string) => {
    const updated = recipes.map((recipe) => (
      recipe.id === id ? { ...recipe, cooked: !recipe.cooked } : recipe
    ));
    setRecipes(updated);
    saveRecipes(updated);
  };

  const removeRecipe = (id: string) => {
    const updated = recipes.filter((recipe) => recipe.id !== id);
    setRecipes(updated);
    saveRecipes(updated);
  };

  return (
    <AppShell>
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          Food Lab
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff' }}>Recipe Shuffle 🍜</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.3 }}>
          {uncooked.length} to try · {recipes.filter((recipe) => recipe.cooked).length} cooked
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, mb: 3 }}>
        <RecipePicker recipes={uncooked.length ? uncooked : filtered} onCookedToggle={toggleCooked} />
      </Box>

      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {CUISINES.map((cuisine) => (
            <Chip
              key={cuisine}
              label={cuisine}
              onClick={() => setFilter(cuisine)}
              sx={{
                flexShrink: 0,
                background: filter === cuisine ? '#4ECDC4' : 'rgba(255,255,255,0.06)',
                color: filter === cuisine ? '#071118' : 'rgba(255,255,255,0.55)',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            />
          ))}
        </Box>
        <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>
          {filter === 'All' ? 'Example meal types' : `${filter} examples`}: {activeExamples.join(' • ')}
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ p: 2, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
            Add Recipe
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Recipe title..."
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && addRecipe()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' } }}
            />
            <Button
              variant="contained"
              onClick={addRecipe}
              sx={{ borderRadius: '12px', minWidth: 44, px: 1.5, background: '#4ECDC4', color: '#000' }}
            >
              <AddRoundedIcon fontSize="small" />
            </Button>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Meal type (e.g. Dinner, Dessert)..."
            value={newCuisine}
            onChange={(event) => setNewCuisine(event.target.value)}
            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' } }}
          />
          <Typography sx={{ mb: 1, color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
            {typedExamples.length
              ? `Examples for ${typedMealType}: ${typedExamples.join(' • ')}`
              : 'Examples: Breakfast, Lunch, Dinner, Dessert, Snacks, Drinks, Brunch'}
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Recipe link (optional, blog/video URL)..."
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' } }}
          />
        </Box>
      </Box>

      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
          Recipe List ({filtered.length})
        </Typography>
        <AnimatePresence>
          {filtered.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: index * 0.03 }}
            >
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: '10px 14px', mb: 1, borderRadius: '14px',
                background: recipe.cooked ? 'rgba(107,203,119,0.08)' : 'rgba(255,255,255,0.04)',
                border: recipe.cooked ? '1px solid rgba(107,203,119,0.2)' : '1px solid rgba(255,255,255,0.07)',
              }}>
                <IconButton
                  size="small"
                  onClick={() => toggleCooked(recipe.id)}
                  sx={{
                    width: 28, height: 28,
                    background: recipe.cooked ? '#6BCB77' : 'rgba(255,255,255,0.08)',
                    color: recipe.cooked ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: recipe.cooked ? 'rgba(255,255,255,0.45)' : '#fff', textDecoration: recipe.cooked ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {recipe.title}
                  </Typography>
                  {recipe.cuisine && <Typography variant="caption" sx={{ color: '#4ECDC4', fontSize: '0.65rem' }}>{recipe.cuisine}</Typography>}
                </Box>

                {recipe.url && (
                  <IconButton
                    size="small"
                    component="a"
                    href={recipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ width: 28, height: 28, background: 'rgba(78,205,196,0.15)', color: '#4ECDC4', '&:hover': { background: 'rgba(78,205,196,0.3)' } }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}

                <IconButton size="small" onClick={() => removeRecipe(recipe.id)} sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: '#FF6B6B' }, width: 28, height: 28 }}>
                  <DeleteRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </AppShell>
  );
}
