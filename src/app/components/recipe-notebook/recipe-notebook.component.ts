import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { v4 as uuidv4 } from 'uuid';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {EditRecipeDialogComponent} from '../edit-recipe-dialog/edit-recipe-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {DeleteRecipeDialogComponent} from '../delete-recipe-dialog/delete-recipe-dialog.component';

@Component({
  selector: 'app-recipe-notebook',
  templateUrl: './recipe-notebook.component.html',
  standalone: true,
  styleUrls: ['./recipe-notebook.component.css'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    NgForOf,
    NgIf,
    MatButtonModule,
    MatIconModule,
    DatePipe,
  ],
})
export class RecipeNotebookComponent {
  recipeForm: FormGroup;
  recipes: Recipe[] = [];
  units = ['г', 'кг', 'мл', 'л', 'шт', 'ч.л.', 'ст.л.', 'стакан'];
  previewImage: string | null = null;

  constructor(private fb: FormBuilder, private recipeService: RecipeService, private dialog: MatDialog) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: ['', Validators.required],
      cookingTime: ['', Validators.required],
      image: [],
    });

    this.recipes = this.recipeService.getRecipes();
    this.addIngredient();
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0.01)]],
      unit: ['', Validators.required]
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addRecipe(): void {
    if (this.recipeForm.valid) {
      const newRecipe: Recipe = {
        id: uuidv4(),
        title: this.recipeForm.value.title,
        ingredients: this.recipeForm.value.ingredients,
        instructions: this.recipeForm.value.instructions,
        cookingTime: this.recipeForm.value.cookingTime,
        image: this.previewImage,
        createdAt: new Date(),
      };

      this.recipeService.addRecipe(newRecipe);
      this.recipeForm.reset();
      this.ingredients.clear();
      this.addIngredient();
      this.previewImage = null;
      this.recipes = this.recipeService.getRecipes();
    }
  }

  deleteRecipe(id: string): void {
    const dialogRef = this.dialog.open(DeleteRecipeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.deleteRecipe(id);
        this.recipes = this.recipeService.getRecipes();
      }
    });
  }

  editRecipe(recipe: Recipe): void {
    const dialogRef = this.dialog.open(EditRecipeDialogComponent, {
      data: recipe,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeService.updateRecipe(recipe.id, result);
        this.recipes = this.recipeService.getRecipes();
      }
    });
  }
}
