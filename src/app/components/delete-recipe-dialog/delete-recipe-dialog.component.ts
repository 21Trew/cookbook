import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-delete-recipe-dialog',
  templateUrl: 'delete-recipe-dialog.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatDialogActions
  ],
  standalone: true
})
export class DeleteRecipeDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteRecipeDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
