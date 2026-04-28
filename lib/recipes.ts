import { Recipe } from '@/types/recipe';
import recipesData from '@/lib/data/recipes.json';

const RECIPES_KEY = 'life-os-recipes';

export const DEFAULT_RECIPES: Recipe[] = recipesData as Recipe[];

export function loadRecipes(): Recipe[] {
  if (typeof window === 'undefined') return DEFAULT_RECIPES;
  try {
    const raw = localStorage.getItem(RECIPES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_RECIPES;
  } catch {
    return DEFAULT_RECIPES;
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

export function pickRandomRecipe(recipes: Recipe[]): Recipe {
  return recipes[Math.floor(Math.random() * recipes.length)];
}
