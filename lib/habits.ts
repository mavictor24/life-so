import { Habit, DayData } from '@/types/habit';
import { format, subDays } from 'date-fns';
import habitsData from '@/lib/data/habits.json';

export const DEFAULT_HABITS: Habit[] = habitsData as Habit[];

export const CATEGORY_CONFIG: Record<string, { label: string; color: string; gradient: string }> = {
  work:     { label: 'Work',     color: '#7C4DFF', gradient: 'linear-gradient(135deg, #7C4DFF 0%, #4A00E0 100%)' },
  gym:      { label: 'Gym',      color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #ee0979 100%)' },
  content:  { label: 'Content',  color: '#FFD93D', gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF9A00 100%)' },
  learning: { label: 'Learning', color: '#6BCB77', gradient: 'linear-gradient(135deg, #6BCB77 0%, #1DB954 100%)' },
  rest:     { label: 'Rest',     color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #0099CC 100%)' },
};

const STORAGE_KEY = 'life-os-day-data';
const HABITS_KEY  = 'life-os-habits';

export function loadHabits(): Habit[] {
  if (typeof window === 'undefined') return DEFAULT_HABITS;
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_HABITS;
  } catch { return DEFAULT_HABITS; }
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadDayData(): Record<string, Record<string, boolean>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const demo = seedDemoData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    return demo;
  } catch { return {}; }
}

export function saveDayData(data: Record<string, Record<string, boolean>>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCompletionRate(habits: Habit[], dayCompletions: Record<string, boolean>): number {
  if (!habits.length) return 0;
  return habits.filter(h => dayCompletions?.[h.id]).length / habits.length;
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
  );
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
  );
}

export function calcWeeklyStreak(dayData: Record<string, Record<string, boolean>>, habits: Habit[]): number {
  const days = getLast7Days();
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (getCompletionRate(habits, dayData[days[i]] ?? {}) >= 0.5) streak++;
    else break;
  }
  return streak;
}

export function calcDailyStreak(dayData: Record<string, Record<string, boolean>>, habits: Habit[]): number {
  let streak = 0;
  let d = new Date();
  while (true) {
    const key = format(d, 'yyyy-MM-dd');
    if (getCompletionRate(habits, dayData[key] ?? {}) >= 1) { streak++; d = subDays(d, 1); }
    else break;
  }
  return streak;
}

export function seedDemoData(): Record<string, Record<string, boolean>> {
  const data: Record<string, Record<string, boolean>> = {};
  const ids = DEFAULT_HABITS.map(h => h.id);
  for (let i = 1; i <= 30; i++) {
    const key = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const completions: Record<string, boolean> = {};
    ids.forEach(id => { completions[id] = Math.random() > 0.35; });
    data[key] = completions;
  }
  return data;
}

// Backwards compat
export const weeklyData: DayData[] = [];
