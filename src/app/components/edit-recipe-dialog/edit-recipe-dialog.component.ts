import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {Ingredient, Recipe} from '../recipe.model';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-edit-recipe-dialog',
  templateUrl: './edit-recipe-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    NgForOf,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    NgIf,
  ],
})
export class EditRecipeDialogComponent {
  recipeForm: FormGroup;
  previewImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Recipe
  ) {
    this.recipeForm = this.fb.group({
      title: [data.title, Validators.required],
      ingredients: this.fb.array(data.ingredients.map(ingredient => this.createIngredientGroup(ingredient))),
      instructions: [data.instructions, Validators.required],
      cookingTime: [data.cookingTime, Validators.required],
      image: [data.image],
    });

    this.previewImage = data.image || null;
  }

  createIngredientGroup(ingredient: Ingredient): FormGroup {
    return this.fb.group({
      name: [ingredient.name, Validators.required],
      quantity: [ingredient.quantity, [Validators.required, Validators.min(0.01)]],
      unit: [ingredient.unit, Validators.required]
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientGroup({ name: '', quantity: 0, unit: '' }));
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  removeImage(): void {
    this.previewImage = null;
    this.recipeForm.patchValue({ image: null });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.recipeForm.patchValue({ image: this.previewImage });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      this.dialogRef.close(this.recipeForm.value);
    }
  }
}
