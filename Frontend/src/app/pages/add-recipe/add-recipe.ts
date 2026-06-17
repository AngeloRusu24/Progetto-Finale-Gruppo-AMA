import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.css'
})
export class AddRecipeComponent {

  constructor(private router: Router) {}

  availableTags = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Pasta', 'Carne', 'Pesce', 'Vegani'];

  form = {
    title: '',
    description: '',
    time: null as number | null,
    difficulty: 'Facile',
    ingredients: '',
    steps: '',
    tags: [] as string[],
  };

  toggleTag(tag: string) {
    if (this.form.tags.includes(tag)) {
      this.form.tags = this.form.tags.filter(t => t !== tag);
    } else {
      this.form.tags.push(tag);
    }
  }

  get isValid(): boolean {
    return (
      this.form.title.trim().length > 0 &&
      this.form.ingredients.trim().length > 0 &&
      this.form.steps.trim().length > 0 &&
      this.form.tags.length > 0
    );
  }

  onSubmit() {
    if (!this.isValid) return;
    console.log('Nuova ricetta:', this.form);
    this.router.navigate(['/recipes']);
  }

  onCancel() {
    this.router.navigate(['/recipes']);
  }
}
