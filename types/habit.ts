export type HabitCategory = 'work' | 'gym' | 'content' | 'learning' | 'rest';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  timeBlock: string;
  streak: number;
  lastCompleted: string | null;
}

export interface DayData {
  date: string; // YYYY-MM-DD
  completions: Record<string, boolean>;
}

export interface MonthDay {
  date: string;
  completionRate: number;
  totalHabits: number;
  completedHabits: number;
}
