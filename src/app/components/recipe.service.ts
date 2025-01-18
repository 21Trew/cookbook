import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [];
  private readonly storageKey = 'savedRecipes';

  constructor() {
    this.loadRecipes();
  }

  private saveRecipes(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.recipes));
  }

  private loadRecipes(): void {
    const storedRecipes = localStorage.getItem(this.storageKey);
    if (storedRecipes) {
      this.recipes = JSON.parse(storedRecipes);
    }
  }

  getRecipes(): Recipe[] {
    return [...this.recipes];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.saveRecipes();
  }

  deleteRecipe(id: string): void {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
    this.saveRecipes();
  }

  updateRecipe(id: string, updatedRecipe: Recipe): void {
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
      this.recipes[index] = { ...this.recipes[index], ...updatedRecipe };
      this.saveRecipes();
    }
  }
}
