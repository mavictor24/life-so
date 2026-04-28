import { Movie } from '@/types/movie';
import moviesData from '@/lib/data/movies.json';

const MOVIES_KEY = 'life-os-movies';

export const DEFAULT_MOVIES: Movie[] = moviesData as Movie[];

export function loadMovies(): Movie[] {
  if (typeof window === 'undefined') return DEFAULT_MOVIES;
  try {
    const raw = localStorage.getItem(MOVIES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_MOVIES;
  } catch { return DEFAULT_MOVIES; }
}

export function saveMovies(movies: Movie[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
}

export function pickRandom(movies: Movie[]): Movie {
  return movies[Math.floor(Math.random() * movies.length)];
}

export const defaultMovies = DEFAULT_MOVIES;
