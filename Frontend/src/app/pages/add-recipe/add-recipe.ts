import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.css'
})
export class AddRecipeComponent {

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  availableTags = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Pasta', 'Carne', 'Pesce', 'Vegani'];

  // emoji disponibili per la ricetta
  availableEmojis = [
    '🍝', '🍕', '🍣', '🍜', '🍲', '🥗', '🥩', '🍗',
    '🐟', '🦐', '🥕', '🥦', '🧀', '🥚', '🍳', '🫕',
    '🍮', '🎂', '🍰', '🧁', '🍩', '🍪', '🫙', '🍞',
    '🥐', '🥙', '🌮', '🥘', '🍱', '🍛', '🥗', '🍽️'
  ];

  errorMessage = '';
  loading = false;

  form = {
    title: '',
    description: '',
    time: null as number | null,
    difficulty: 'Facile',
    emoji: '🍽️',
    ingredients: '' as string,
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

  selectEmoji(emoji: string) {
    this.form.emoji = emoji;
  }

  get isValid(): boolean {
    return (
      this.form.title.trim().length > 0 &&
      this.form.ingredients.trim().length > 0 &&
      this.form.tags.length > 0
    );
  }

  async onSubmit() {
    if (!this.isValid) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const recipeRes = await fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: this.form.title,
          description: this.form.description,
          category: this.form.tags[0],
          emoji: this.form.emoji,
        })
      });

      const recipeData = await recipeRes.json();

      if (!recipeRes.ok) {
        this.errorMessage = recipeData.message || 'Errore nella creazione della ricetta';
        return;
      }

      const lines = this.form.ingredients.split('\n').filter(l => l.trim());
      for (const line of lines) {
        const [name, quantity] = line.split('-').map(s => s.trim());
        await fetch('http://localhost:3000/api/ingredients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: name || line,
            quantity: quantity || '',
            recipeId: recipeData._id
          })
        });
      }

      this.router.navigate(['/recipes']);

    } catch (err) {
      this.errorMessage = 'Errore di connessione al server';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onCancel() {
    this.router.navigate(['/recipes']);
  }
}
