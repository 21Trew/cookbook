import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RecipeNotebookComponent} from './components/recipe-notebook/recipe-notebook.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RecipeNotebookComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cookbook';
}
