import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.css'
})
export class AddRecipeComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  availableTags = ['Antipasti', 'Primi', 'Secondi', 'Dolci', 'Pasta', 'Carne', 'Pesce', 'Vegani'];

  availableEmojis = [
    '🍝', '🍕', '🍣', '🍜', '🍲', '🥗', '🥩', '🍗',
    '🐟', '🦐', '🥕', '🥦', '🧀', '🥚', '🍳', '🫕',
    '🍮', '🎂', '🍰', '🧁', '🍩', '🍪', '🫙', '🍞',
    '🥐', '🥙', '🌮', '🥘', '🍱', '🍛', '🥗', '🍽️'
  ];

  errorMessage = '';
  loading = false;

  // modalità: true se stiamo modificando una ricetta esistente
  isEditMode = false;
  recipeId: string | null = null;

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

  ngOnInit() {
    // se l'URL contiene un id, siamo in modalità modifica
    this.recipeId = this.route.snapshot.paramMap.get('id');
    if (this.recipeId) {
      this.isEditMode = true;
      this.loadRecipeForEdit(this.recipeId);
    }
  }

  async loadRecipeForEdit(id: string) {
    this.loading = true;
    try {
      const [recipeRes, ingredientsRes] = await Promise.all([
        fetch(`http://localhost:3000/api/recipes/${id}`),
        fetch(`http://localhost:3000/api/ingredients/recipe/${id}`)
      ]);

      const recipe = await recipeRes.json();
      const ingredients = await ingredientsRes.json();

      // popola il form con i dati esistenti
      this.form.title = recipe.title || '';
      this.form.description = recipe.description || '';
      this.form.steps = recipe.steps || '';
      this.form.emoji = recipe.emoji || '🍽️';
      this.form.tags = recipe.category ? [recipe.category] : [];

      // ricostruisce il testo degli ingredienti riga per riga
      this.form.ingredients = ingredients
        .map((i: any) => `${i.name} - ${i.quantity}`)
        .join('\n');

    } catch (err) {
      this.errorMessage = 'Errore nel caricamento della ricetta';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

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
      if (this.isEditMode && this.recipeId) {
        await this.updateRecipe(token, this.recipeId);
      } else {
        await this.createRecipe(token);
      }
    } catch (err) {
      this.errorMessage = 'Errore di connessione al server';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async createRecipe(token: string) {
    console.log('STEPS DA INVIARE:', this.form.steps);
    const recipeRes = await fetch('http://localhost:3000/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: this.form.title,
        description: this.form.description,
        steps: this.form.steps,
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
  }

  async updateRecipe(token: string, id: string) {
    const recipeRes = await fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: this.form.title,
        description: this.form.description,
        steps: this.form.steps,
        category: this.form.tags[0],
        emoji: this.form.emoji,
      })
    });

    if (!recipeRes.ok) {
      const data = await recipeRes.json();
      this.errorMessage = data.message || 'Errore nell\'aggiornamento della ricetta';
      return;
    }

    // elimina i vecchi ingredienti e ricrea quelli nuovi (più semplice che fare un diff)
    const existingRes = await fetch(`http://localhost:3000/api/ingredients/recipe/${id}`);
    const existing = await existingRes.json();
    for (const ing of existing) {
      await fetch(`http://localhost:3000/api/ingredients/${ing._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
          recipeId: id
        })
      });
    }

    this.router.navigate(['/recipe', id]);
  }

  onCancel() {
    if (this.isEditMode && this.recipeId) {
      this.router.navigate(['/recipe', this.recipeId]);
    } else {
      this.router.navigate(['/recipes']);
    }
  }
}
