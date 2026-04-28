'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Chip, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import AppShell from '@/components/AppShell';
import MoviePicker from '@/components/MoviePicker';
import { loadMovies, saveMovies } from '@/lib/movies';
import { Movie } from '@/types/movie';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Drama', 'Thriller', 'Romance', 'Animation', 'Horror', 'Comedy'];

export default function MoviesView() {
  const [movies, setMovies]     = useState<Movie[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newUrl, setNewUrl]     = useState('');
  const [filter, setFilter]     = useState('All');

  useEffect(() => { setMovies(loadMovies()); }, []);

  const filtered = filter === 'All' ? movies : movies.filter(m => m.genre === filter);
  const unwatched = filtered.filter(m => !m.watched);

  const addMovie = () => {
    if (!newTitle.trim()) return;
    const m: Movie = { id: Date.now().toString(), title: newTitle.trim(), genre: newGenre || undefined, url: newUrl.trim() || undefined };
    const updated = [...movies, m];
    setMovies(updated);
    saveMovies(updated);
    setNewTitle('');
    setNewGenre('');
    setNewUrl('');
  };

  const markWatched = (id: string) => {
    const updated = movies.map(m => m.id === id ? { ...m, watched: !m.watched } : m);
    setMovies(updated);
    saveMovies(updated);
  };

  const removeMovie = (id: string) => {
    const updated = movies.filter(m => m.id !== id);
    setMovies(updated);
    saveMovies(updated);
  };

  return (
    <AppShell>
      <Box sx={{ px: 2.5, pt: 3, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          Entertainment
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff' }}>Movie Night 🎬</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.3 }}>
          {unwatched.length} to watch · {movies.filter(m => m.watched).length} watched
        </Typography>
      </Box>

      {/* Shuffle Picker */}
      <Box sx={{ px: 2.5, mb: 3 }}>
        <MoviePicker movies={unwatched.length ? unwatched : movies} onWatched={markWatched} />
      </Box>

      {/* Genre filter */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {GENRES.map(g => (
            <Chip
              key={g}
              label={g}
              onClick={() => setFilter(g)}
              sx={{
                flexShrink: 0,
                background: filter === g ? '#7C4DFF' : 'rgba(255,255,255,0.06)',
                color: filter === g ? '#fff' : 'rgba(255,255,255,0.5)',
                fontWeight: 700,
                fontSize: '0.7rem',
                '&:hover': { background: filter === g ? '#7C4DFF' : 'rgba(255,255,255,0.1)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Add movie */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Box sx={{ p: 2, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
            Add Movie
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              fullWidth size="small"
              placeholder="Movie title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMovie()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' } }}
            />
            <Button
              variant="contained"
              onClick={addMovie}
              sx={{ borderRadius: '12px', minWidth: 44, px: 1.5, background: '#7C4DFF' }}
            >
              <AddRoundedIcon fontSize="small" />
            </Button>
          </Box>
          <TextField
            fullWidth size="small"
            placeholder="Genre (optional)..."
            value={newGenre}
            onChange={e => setNewGenre(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' } }}
          />
          <TextField
            fullWidth size="small"
            placeholder="Watch link (optional, e.g. Netflix URL)..."
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' } }}
          />
        </Box>
      </Box>

      {/* Movie list */}
      <Box sx={{ px: 2.5, mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, fontSize: '0.6rem', mb: 1.5, display: 'block' }}>
          Watchlist ({filtered.length})
        </Typography>
        <AnimatePresence>
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.03 }}
            >
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: '10px 14px', mb: 1, borderRadius: '14px',
                background: m.watched ? 'rgba(107,203,119,0.08)' : 'rgba(255,255,255,0.04)',
                border: m.watched ? '1px solid rgba(107,203,119,0.2)' : '1px solid rgba(255,255,255,0.07)',
              }}>
                <IconButton
                  size="small"
                  onClick={() => markWatched(m.id)}
                  sx={{
                    width: 28, height: 28,
                    background: m.watched ? '#6BCB77' : 'rgba(255,255,255,0.08)',
                    color: m.watched ? '#fff' : 'rgba(255,255,255,0.4)',
                    '&:hover': { background: m.watched ? '#5ab868' : 'rgba(255,255,255,0.15)' },
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ color: m.watched ? 'rgba(255,255,255,0.4)' : '#fff', textDecoration: m.watched ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.title}
                  </Typography>
                  {m.genre && <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>{m.genre}</Typography>}
                </Box>
                {m.url && (
                  <IconButton
                    size="small"
                    component="a"
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ width: 28, height: 28, background: 'rgba(78,205,196,0.15)', color: '#4ECDC4', '&:hover': { background: 'rgba(78,205,196,0.3)' } }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
                {m.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                    <StarRoundedIcon sx={{ fontSize: 12, color: '#FFD93D' }} />
                    <Typography variant="caption" sx={{ color: '#FFD93D', fontWeight: 700, fontSize: '0.65rem' }}>{m.rating}</Typography>
                  </Box>
                )}
                <IconButton size="small" onClick={() => removeMovie(m.id)} sx={{ color: 'rgba(255,255,255,0.2)', '&:hover': { color: '#FF6B6B' }, width: 28, height: 28 }}>
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
